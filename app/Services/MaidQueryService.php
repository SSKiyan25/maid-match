<?php

namespace App\Services;

use App\Models\Maid\Maid;
use App\Models\JobPosting\JobPosting;
use Illuminate\Support\Collection;
use App\Models\Employer\Employer;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Builder;

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
                $q->where('full_name', 'like', "%{$searchTerm}%")
                    ->orWhereHas('agency', function ($q) use ($searchTerm) {
                        $q->where('name', 'like', "%{$searchTerm}%");
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
                $query->orderBy('full_name', 'asc');
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
     * Get nearby maids based on location
     */
    public function getNearbyMaids(array $location, $limit = 8)
    {
        if (empty($location)) {
            return collect([]);
        }

        $cityToMatch = $location['city'] ?? '';
        $provinceToMatch = $location['province'] ?? '';

        $maids = Maid::with(['user.profile', 'user.photos', 'agency'])
            ->whereHas('user', function ($query) {
                $query->where('status', 'active');
            })
            ->whereHas('user.profile', function ($query) use ($cityToMatch, $provinceToMatch) {
                // Use JSON column queries instead of relationship queries
                if (!empty($cityToMatch)) {
                    $query->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(address, '$.city')) = ?", [$cityToMatch]);
                }

                if (!empty($provinceToMatch)) {
                    $query->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(address, '$.province')) = ?", [$provinceToMatch]);
                }
            })
            ->take($limit)
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
