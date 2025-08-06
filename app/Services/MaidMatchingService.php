<?php

namespace App\Services;

use App\Models\Maid\Maid;
use App\Models\JobPosting\JobPosting;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class MaidMatchingService
{
    /**
     * Find the best matching job posting for a maid
     *
     * @param Maid $maid
     * @param Collection $jobPostings
     * @return array|null
     */
    public function findBestMatch(Maid $maid, Collection $jobPostings)
    {
        $bestMatch = null;
        $highestScore = 0;

        foreach ($jobPostings as $jobPosting) {
            $matchScore = $this->calculateMatchScore($maid, $jobPosting);

            if ($matchScore > $highestScore) {
                $highestScore = $matchScore;
                $bestMatch = [
                    'job_id' => $jobPosting->id,
                    'job_title' => $jobPosting->title,
                    'match_percentage' => $matchScore,
                ];
            }
        }

        return $bestMatch;
    }

    /**
     * Calculate match score between a maid and a job posting
     * This is a backend implementation of the matching logic in matchingUtils.ts
     *
     * @param Maid $maid
     * @param JobPosting $jobPosting
     * @return int
     */
    public function calculateMatchScore(Maid $maid, JobPosting $jobPosting)
    {
        // Log input data for debugging
        Log::debug('MaidMatchingService - Input Data', [
            'maid_id' => $maid->id,
            'job_id' => $jobPosting->id,
            'maid_skills' => $maid->skills,
            'job_work_types' => $jobPosting->work_types,
        ]);

        // Initialize factors
        $skillMatch = 0;
        $languageMatch = 0;
        $accommodationMatch = 0;
        $salaryMatch = 0;
        $locationMatch = 0;

        // 1. Skills matching
        $maidSkills = $maid->skills ?? [];
        $jobWorkTypes = is_string($jobPosting->work_types)
            ? json_decode($jobPosting->work_types, true)
            : $jobPosting->work_types ?? [];

        if (!empty($maidSkills) && !empty($jobWorkTypes)) {
            // Normalize job work types to match client-side approach
            $jobSkills = array_map(function ($type) {
                return ucwords(str_replace('_', ' ', strtolower($type)));
            }, $jobWorkTypes);

            $matchingSkills = array_filter($maidSkills, function ($skill) use ($jobSkills) {
                foreach ($jobSkills as $jobSkill) {
                    if (stripos($jobSkill, $skill) !== false || stripos($skill, $jobSkill) !== false) {
                        return true;
                    }
                }
                return false;
            });

            $skillMatch = !empty($jobSkills)
                ? min(100, (count($matchingSkills) / count($jobSkills)) * 100)
                : 0;
        }

        // 2. Language matching
        $maidLanguages = $maid->languages ?? [];
        $jobLanguages = is_string($jobPosting->language_preferences)
            ? json_decode($jobPosting->language_preferences, true)
            : $jobPosting->language_preferences ?? [];

        if (!empty($maidLanguages) && !empty($jobLanguages)) {
            $matchingLanguagesCount = 0;
            foreach ($maidLanguages as $lang) {
                if (in_array(strtolower($lang), array_map('strtolower', $jobLanguages))) {
                    $matchingLanguagesCount++;
                }
            }

            $languageMatch = !empty($jobLanguages)
                ? min(100, ($matchingLanguagesCount / count($jobLanguages)) * 100)
                : 0;
        }

        // 3. Accommodation matching
        if ($maid->preferred_accommodation && $jobPosting->accommodation_type) {
            if (
                $maid->preferred_accommodation === $jobPosting->accommodation_type ||
                $maid->preferred_accommodation === 'either'
            ) {
                $accommodationMatch = 100;
            }
        }

        // 4. Salary matching
        if ($maid->expected_salary && $jobPosting->min_salary && $jobPosting->max_salary) {
            $expectedSalary = (float) $maid->expected_salary;
            $minSalary = (float) $jobPosting->min_salary;
            $maxSalary = (float) $jobPosting->max_salary;

            if ($expectedSalary <= $maxSalary && $expectedSalary >= $minSalary) {
                $salaryMatch = 100;
            } elseif ($expectedSalary < $minSalary) {
                $salaryMatch = 90; // Below minimum, still good for employer
            } else {
                // Above maximum
                $overBudgetPercent = (($expectedSalary - $maxSalary) / $maxSalary) * 100;
                $salaryMatch = max(0, 100 - $overBudgetPercent);
            }
        }

        // 5. Location matching
        // Get maid profile with address
        $profile = null;
        $profileAddress = null;

        if ($maid->user && $maid->user->profile) {
            $profile = $maid->user->profile;
            $profileAddress = $profile->address; // Use the attribute, not a method
        }

        // Get job location (from relation or direct property)
        $jobLocationData = null;

        // First check if the location relation is loaded
        if ($jobPosting->relationLoaded('location') && $jobPosting->location) {
            $jobLocationData = [
                'barangay' => $jobPosting->location->brgy,
                'city' => $jobPosting->location->city,
                'province' => $jobPosting->location->province,
            ];
        }
        // Then check if it's a direct property
        else if (is_string($jobPosting->location)) {
            $jobLocationData = json_decode($jobPosting->location, true);
        }
        // Or already an array
        else if (is_array($jobPosting->location)) {
            $jobLocationData = $jobPosting->location;
        }
        // Otherwise try to load the relation
        else {
            try {
                $locationModel = $jobPosting->location()->first();
                if ($locationModel) {
                    $jobLocationData = [
                        'barangay' => $locationModel->brgy,
                        'city' => $locationModel->city,
                        'province' => $locationModel->province,
                    ];
                }
            } catch (\Exception $e) {
                Log::error('Failed to load job location', [
                    'job_id' => $jobPosting->id,
                    'error' => $e->getMessage()
                ]);
            }
        }

        // Log location data for debugging
        Log::debug('Location data for matching', [
            'maid_id' => $maid->id,
            'job_id' => $jobPosting->id,
            'profile_address' => $profileAddress,
            'job_location_data' => $jobLocationData
        ]);

        if ($profileAddress && $jobLocationData) {
            // Extract maid location fields
            $maidBarangay = '';
            $maidCity = '';
            $maidProvince = '';

            if (is_array($profileAddress)) {
                $maidBarangay = strtolower($profileAddress['barangay'] ?? '');
                $maidCity = strtolower($profileAddress['city'] ?? '');
                $maidProvince = strtolower($profileAddress['province'] ?? '');
            } else if (is_object($profileAddress)) {
                $maidBarangay = strtolower($profileAddress->barangay ?? '');
                $maidCity = strtolower($profileAddress->city ?? '');
                $maidProvince = strtolower($profileAddress->province ?? '');
            }

            // Extract job location fields
            $jobBarangay = strtolower($jobLocationData['barangay'] ?? $jobLocationData['brgy'] ?? '');
            $jobCity = strtolower($jobLocationData['city'] ?? '');
            $jobProvince = strtolower($jobLocationData['province'] ?? '');

            // Do the location matching
            if (
                $maidBarangay && $jobBarangay && $maidBarangay === $jobBarangay &&
                $maidCity && $jobCity && $maidCity === $jobCity
            ) {
                $locationMatch = 100;
            } elseif ($maidCity && $jobCity && $maidCity === $jobCity) {
                $locationMatch = 90;
            } elseif ($maidProvince && $jobProvince && $maidProvince === $jobProvince) {
                $locationMatch = 75;
            } else {
                $locationMatch = 0;
            }
        }

        // Calculate weighted score
        $weights = [
            'skillMatch' => 0.35,
            'languageMatch' => 0.15,
            'accommodationMatch' => 0.15,
            'salaryMatch' => 0.1,
            'locationMatch' => 0.25,
        ];

        $overallPercentage =
            $skillMatch * $weights['skillMatch'] +
            $languageMatch * $weights['languageMatch'] +
            $accommodationMatch * $weights['accommodationMatch'] +
            $salaryMatch * $weights['salaryMatch'] +
            $locationMatch * $weights['locationMatch'];

        // Add experience bonus (up to 10%)
        $experienceBonus = 0;
        if ($maid->years_experience >= 5) {
            $experienceBonus = 10;
        } elseif ($maid->years_experience >= 3) {
            $experienceBonus = 5;
        }

        $overallPercentage = min(100, $overallPercentage + $experienceBonus);

        // Special case - if no skills match, cap at 60%
        if ($skillMatch === 0) {
            $overallPercentage = min($overallPercentage, 60);
        }

        // Log all factors for debugging
        Log::debug('Match calculation results', [
            'maid_id' => $maid->id,
            'job_id' => $jobPosting->id,
            'factors' => [
                'skillMatch' => $skillMatch,
                'languageMatch' => $languageMatch,
                'accommodationMatch' => $accommodationMatch,
                'salaryMatch' => $salaryMatch,
                'locationMatch' => $locationMatch,
            ],
            'experienceBonus' => $experienceBonus,
            'rawScore' => $overallPercentage,
            'finalScore' => round($overallPercentage)
        ]);

        return round($overallPercentage);
    }
}
