<?php

namespace App\Services;

use App\Models\Maid\Maid;
use App\Models\JobPosting\JobPosting;
use Illuminate\Support\Collection;
use App\Models\Employer\Employer;

class MaidQueryService
{
    protected $matchingService;

    public function __construct(MaidMatchingService $matchingService)
    {
        $this->matchingService = $matchingService;
    }

    /**
     * Get bookmarked maids for an employer
     */
    public function getBookmarkedMaids(Employer $employer, $limit = 8)
    {
        if (!$employer) {
            return collect([]);
        }

        $bookmarkedMaids = $employer->bookmarkedMaids()
            ->with(['user.profile', 'user.photos', 'agency'])
            ->wherePivot('is_archived', false)
            ->take($limit)
            ->get();

        return $bookmarkedMaids->map(function ($maid) {
            $maidArray = $maid->toArray();

            // Add agency name for easier access
            if ($maid->agency) {
                $maidArray['agency_name'] = $maid->agency->name;
            }

            return $maidArray;
        })->values()->all();
    }

    /**
     * Get filtered maids based on search criteria
     */
    public function getFilteredMaids(array $filters, ?JobPosting $selectedJob = null)
    {
        // Start with base query
        $query = Maid::with(['user.profile', 'user.photos', 'agency'])
            ->whereHas('user', function ($query) {
                $query->where('status', 'active');
            });

        // Apply search filter
        if (!empty($filters['search'])) {
            $searchTerm = $filters['search'];
            $query->where(function ($q) use ($searchTerm) {
                // Search by name through the user relationship
                $q->whereHas('user.profile', function ($query) use ($searchTerm) {
                    $query->where('first_name', 'like', "%{$searchTerm}%")
                        ->orWhere('last_name', 'like', "%{$searchTerm}%");
                });

                // Search by agency name
                $q->orWhereHas('agency', function ($query) use ($searchTerm) {
                    $query->where('name', 'like', "%{$searchTerm}%");
                });

                // Search by skills (if they're stored as JSON)
                $q->orWhereRaw("JSON_CONTAINS(skills, '\"$searchTerm\"', '$')");

                // Search by location through user's profile address
                $q->orWhereHas('user.profile', function ($query) use ($searchTerm) {
                    $query->whereRaw("JSON_EXTRACT(address, '$.city') LIKE ?", ["%{$searchTerm}%"])
                        ->orWhereRaw("JSON_EXTRACT(address, '$.province') LIKE ?", ["%{$searchTerm}%"]);
                });
            });
        }

        // Apply skills filter
        if (!empty($filters['skills'])) {
            $query->where(function ($q) use ($filters) {
                foreach ($filters['skills'] as $skill) {
                    $q->whereJsonContains('skills', $skill);
                }
            });
        }

        // Apply languages filter
        if (!empty($filters['languages'])) {
            $query->where(function ($q) use ($filters) {
                foreach ($filters['languages'] as $language) {
                    $q->whereJsonContains('languages', $language);
                }
            });
        }

        // Apply sorting
        switch ($filters['sort_by'] ?? 'match') {
            case 'recent':
                $query->orderBy('created_at', 'desc');
                break;
            case 'name':
                $query->orderByRaw("(SELECT CONCAT(p.first_name, ' ', p.last_name) FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.id = maids.user_id) ASC");
                break;
            case 'match':
            default:
                // Will sort by match after loading the data
                break;
        }

        // Get paginated results
        $perPage = 20;
        $page = $filters['page'] ?? 1;

        $paginatedResults = $query->paginate($perPage, ['*'], 'page', $page);

        // Transform results to include match data
        $data = $paginatedResults->items();

        // Add match data for each maid
        $data = collect($data)->map(function ($maid) use ($selectedJob) {
            $maidArray = $maid->toArray();

            // Add agency name for easier access
            if ($maid->agency) {
                $maidArray['agency_name'] = $maid->agency->name;
            }

            // Always calculate computed match when a job is selected
            if ($selectedJob) {
                $matchScore = $this->matchingService->calculateMatchScore($maid, $selectedJob);
                $maidArray['computed_match'] = [
                    'job_id' => $selectedJob->id,
                    'job_title' => $selectedJob->title,
                    'match_percentage' => $matchScore
                ];
            }

            return $maidArray;
        })->all();

        // Apply sorting by match if needed and a job is selected
        if (($filters['sort_by'] ?? 'match') === 'match' && $selectedJob) {
            usort($data, function ($a, $b) {
                $aScore = $a['computed_match']['match_percentage'] ?? 0;
                $bScore = $b['computed_match']['match_percentage'] ?? 0;
                return $bScore <=> $aScore;
            });
        }

        // Prepare pagination metadata
        $meta = [
            'current_page' => $paginatedResults->currentPage(),
            'last_page' => $paginatedResults->lastPage(),
            'per_page' => $paginatedResults->perPage(),
            'total' => $paginatedResults->total(),
        ];

        return [
            'data' => $data,
            'meta' => $meta,
        ];
    }

    /**
     * Get best matched maids across all job postings
     */
    public function getBestMatchedMaids(Collection $jobPostings)
    {
        if ($jobPostings->isEmpty()) {
            return collect([]);
        }

        $maids = Maid::with(['user.profile', 'user.photos', 'agency'])
            ->whereHas('user', function ($query) {
                $query->where('status', 'active');
            })
            ->take(8)
            ->get();

        return $maids->map(function ($maid) use ($jobPostings) {
            $maidArray = $maid->toArray();

            // Add agency name for easier access
            if ($maid->agency) {
                $maidArray['agency_name'] = $maid->agency->name;
            }

            // Find best match across all job postings
            $bestMatch = $this->matchingService->findBestMatch($maid, $jobPostings);
            $maidArray['best_match'] = $bestMatch;

            return $maidArray;
        })->sortByDesc(function ($maid) {
            return $maid['best_match']['match_percentage'] ?? 0;
        })->values()->all();
    }

    /**
     * Get nearby maids based on employer's location
     */
    public function getNearbyMaids(Employer $employer, $limit = 8)
    {
        // Check if employer exists and has a profile with address
        if (!$employer || !$employer->user || !$employer->user->profile || !$employer->user->profile->address) {
            return collect([]);
        }

        $employerProfile = $employer->user->profile;
        $cityToMatch = $employerProfile->getAddressComponent('city', '');
        $provinceToMatch = $employerProfile->getAddressComponent('province', '');

        // If no location data available, return empty collection
        if (empty($cityToMatch) && empty($provinceToMatch)) {
            return collect([]);
        }

        $maids = Maid::with(['user.profile', 'user.photos', 'agency'])
            ->whereHas('user', function ($query) {
                $query->where('status', 'active');
            })
            ->whereHas('user.profile', function ($query) use ($cityToMatch, $provinceToMatch) {
                // Match either city or province (prioritize city match if available)
                if (!empty($cityToMatch)) {
                    $query->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(address, '$.city')) = ?", [$cityToMatch]);
                }

                if (!empty($provinceToMatch)) {
                    $query->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(address, '$.province')) = ?", [$provinceToMatch]);
                }
            })
            ->take($limit)
            ->get();

        return $maids->map(function ($maid) use ($cityToMatch, $provinceToMatch) {
            $maidArray = $maid->toArray();

            // Add agency name for easier access
            if ($maid->agency) {
                $maidArray['agency_name'] = $maid->agency->name;
            }

            // Add a flag to identify exact city matches for sorting
            $maidProfile = $maid->user->profile;
            $maidCity = $maidProfile ? $maidProfile->getAddressComponent('city', '') : '';
            $maidArray['exact_city_match'] = !empty($cityToMatch) && $maidCity === $cityToMatch;

            // Add formatted location for display
            $maidArray['formatted_location'] = $maidProfile ? $maidProfile->getFormattedAddressAttribute() : '';

            return $maidArray;
        })
            // Sort to prioritize exact city matches
            ->sortByDesc('exact_city_match')
            ->values()
            ->all();
    }

    /**
     * Get recently added maids
     */
    public function getRecentMaids()
    {
        $maids = Maid::with(['user.profile', 'user.photos', 'agency'])
            ->whereHas('user', function ($query) {
                $query->where('status', 'active');
            })
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get();

        return $maids->map(function ($maid) {
            $maidArray = $maid->toArray();

            // Add agency name for easier access
            if ($maid->agency) {
                $maidArray['agency_name'] = $maid->agency->name;
            }

            return $maidArray;
        })->values()->all();
    }

    /**
     * Get all unique skills from maids
     */
    public function getAllSkills()
    {
        $skills = Maid::select('skills')
            ->get()
            ->pluck('skills')
            ->flatten()
            ->filter()
            ->unique()
            ->values()
            ->all();

        return $skills;
    }

    /**
     * Get all unique languages from maids
     */
    public function getAllLanguages()
    {
        $languages = Maid::select('languages')
            ->get()
            ->pluck('languages')
            ->flatten()
            ->filter()
            ->unique()
            ->values()
            ->all();

        return $languages;
    }

    /**
     * Get all maids with match percentages for all or a specific job posting
     */
    public function getAllMatchedMaids(Collection $jobPostings, ?JobPosting $selectedJob = null, $limit = 50)
    {
        $maids = Maid::with(['user.profile', 'user.photos', 'agency'])
            ->whereHas('user', function ($query) {
                $query->where('status', 'active');
            })
            ->take($limit)
            ->get();

        return $maids->map(function ($maid) use ($jobPostings, $selectedJob) {
            $maidArray = $maid->toArray();

            // Add agency name for easier access
            if ($maid->agency) {
                $maidArray['agency_name'] = $maid->agency->name;
            }

            if ($selectedJob) {
                // Calculate match for specific job posting
                $matchScore = $this->matchingService->calculateMatchScore($maid, $selectedJob);
                $maidArray['computed_match'] = [
                    'job_id' => $selectedJob->id,
                    'job_title' => $selectedJob->title,
                    'match_percentage' => $matchScore
                ];
            } else {
                // Find best match across all job postings
                $bestMatch = $this->matchingService->findBestMatch($maid, $jobPostings);
                $maidArray['best_match'] = $bestMatch;
            }

            return $maidArray;
        })->sortByDesc(function ($maid) use ($selectedJob) {
            // Sort by the appropriate match percentage
            if ($selectedJob) {
                return $maid['computed_match']['match_percentage'] ?? 0;
            } else {
                return $maid['best_match']['match_percentage'] ?? 0;
            }
        })->values()->all();
    }
}
