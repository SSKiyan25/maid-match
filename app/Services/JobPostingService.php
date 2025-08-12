<?php

namespace App\Services;

use App\Models\JobPosting\JobPosting;
use App\Models\JobPosting\JobLocation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class JobPostingService
{
    /**
     * Get all active and non-archived job postings with eager loading
     * 
     * @return Collection
     */
    public function getAllActive(): Collection
    {
        $jobs = JobPosting::with([
            'photos',
            'location',
            'bonuses',
            'employer',
            'employer.user.profile'
        ])
            ->active()
            ->notArchived()
            ->orderBy('created_at', 'desc')
            ->get();

        // We're returning a collection directly as specified in the method signature
        return $jobs;
    }

    /**
     * Get paginated job postings with filters
     * 
     * @param array $filters
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginated(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = JobPosting::with([
            'photos',
            'location',
            'bonuses',
            'employer',
            'employer.user.profile'
        ])
            ->active()
            ->notArchived();

        // Apply search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhereHas('location', function ($q) use ($search) {
                        $q->where('city', 'like', "%{$search}%")
                            ->orWhere('province', 'like', "%{$search}%");
                    });
            });
        }

        // Apply work type filter
        if (!empty($filters['work_types']) && is_array($filters['work_types'])) {
            $query->where(function ($q) use ($filters) {
                foreach ($filters['work_types'] as $workType) {
                    $q->orWhereJsonContains('work_types', $workType);
                }
            });
        }

        // Apply salary filter
        if (!empty($filters['min_salary'])) {
            $query->where('max_salary', '>=', $filters['min_salary']);
        }

        if (!empty($filters['max_salary'])) {
            $query->where('min_salary', '<=', $filters['max_salary']);
        }

        // Apply location filter
        if (!empty($filters['location'])) {
            $query->whereHas('location', function ($q) use ($filters) {
                $q->where('city', $filters['location'])
                    ->orWhere('province', $filters['location']);
            });
        }

        // Apply sorting
        $sortField = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';

        $allowedSortFields = ['created_at', 'min_salary', 'max_salary', 'title'];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        // Return the paginator directly as specified in the method signature
        return $query->paginate($perPage);
    }

    /**
     * Get job postings near the user's location with better proximity prioritization
     * 
     * @param array $filters
     * @param int $perPage
     * @return Collection|LengthAwarePaginator
     */
    public function getNearbyJobs(array $filters = [], int $perPage = 0)
    {
        // Get user's location
        $user = Auth::user();
        $userLocation = null;

        if ($user && $user->profile && isset($user->profile->address)) {
            $userLocation = [
                'brgy' => $user->profile->address['barangay'] ?? null,
                'city' => $user->profile->address['city'] ?? null,
                'province' => $user->profile->address['province'] ?? null,
            ];
        } elseif ($user && $user->agency && isset($user->agency->address)) {
            // If it's an agency user, use agency address
            $userLocation = [
                'brgy' => $user->agency->address['barangay'] ?? null,
                'city' => $user->agency->address['city'] ?? null,
                'province' => $user->agency->address['province'] ?? null,
            ];
        }

        // Base query for active job postings
        $query = JobPosting::with([
            'photos',
            'location',
            'bonuses',
            'employer',
            'employer.user.profile'
        ])
            ->active()
            ->select('job_postings.*'); // Start with selecting all columns from job_postings

        // If we have user location data, prioritize by proximity
        if ($userLocation) {
            // Build a query that prioritizes by location proximity (brgy > city > province)
            $query->leftJoin('job_location', 'job_postings.id', '=', 'job_location.job_posting_id');

            // Add a calculated priority field based on location match level
            $query->addSelect(DB::raw('
                CASE 
                    WHEN job_location.brgy = "' . ($userLocation['brgy'] ?? '') . '" AND job_location.city = "' . ($userLocation['city'] ?? '') . '" THEN 1
                    WHEN job_location.city = "' . ($userLocation['city'] ?? '') . '" THEN 2
                    WHEN job_location.province = "' . ($userLocation['province'] ?? '') . '" THEN 3
                    ELSE 4
                END as proximity_level
            '));

            // We need a valid province at minimum
            if (!empty($userLocation['province'])) {
                $query->where(function ($q) use ($userLocation) {
                    // Match by exact barangay in same city (highest priority)
                    if (!empty($userLocation['brgy']) && !empty($userLocation['city'])) {
                        $q->orWhere(function ($sq) use ($userLocation) {
                            $sq->where('job_location.brgy', $userLocation['brgy'])
                                ->where('job_location.city', $userLocation['city']);
                        });
                    }

                    // Match by city (second priority)
                    if (!empty($userLocation['city'])) {
                        $q->orWhere('job_location.city', $userLocation['city']);
                    }

                    // Match by province (third priority)
                    $q->orWhere('job_location.province', $userLocation['province']);
                });

                // Order by our calculated proximity level (1=closest, 4=furthest)
                $query->orderBy('proximity_level', 'asc');
            } else {
                // Fallback: No valid location data, use recency
                $query->orderBy('job_postings.created_at', 'desc');
            }
        } else {
            // No user location, just sort by recency
            $query->orderBy('job_postings.created_at', 'desc');
        }

        // Add where clauses with table name prefixes to avoid ambiguity
        $query->where('job_postings.status', 'active')
            ->where('job_postings.is_archived', 0);

        // Apply secondary sorting by created_at to ensure consistent ordering
        $query->orderBy('job_postings.created_at', 'desc');

        // Apply any additional filters from the filters array
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('job_postings.title', 'like', "%{$search}%")
                    ->orWhere('job_postings.description', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['work_types']) && is_array($filters['work_types'])) {
            $query->where(function ($q) use ($filters) {
                foreach ($filters['work_types'] as $workType) {
                    $q->orWhereJsonContains('job_postings.work_types', $workType);
                }
            });
        }

        if ($perPage > 0) {
            return $query->paginate($perPage);
        }

        return $query->limit(10)->get();
    }
    /**
     * Get recommended job postings for the current user
     * 
     * @param array $filters
     * @param int $perPage
     * @return Collection|LengthAwarePaginator
     */
    public function getRecommendedJobs(array $filters = [], int $perPage = 0)
    {
        $user = Auth::user();

        // Base query for active job postings
        $query = JobPosting::with([
            'photos',
            'location',
            'bonuses',
            'employer',
            'employer.user.profile'
        ])
            ->active()
            ->notArchived();

        // If user is logged in and has a maid profile
        if ($user && $user->hasRole('maid') && isset($user->maid)) {
            $maid = $user->maid;

            // 1. Match by skills/work types
            if (!empty($maid->skills)) {
                $query->where(function ($q) use ($maid) {
                    // Convert maid skills to lowercase for matching with job work types
                    $skills = array_map('strtolower', $maid->skills);

                    foreach ($skills as $skill) {
                        // Try to match skills with job work types
                        $q->orWhereJsonContains('work_types', $skill);
                    }
                });
            }

            // 2. Match by preferred location if the maid has specified locations
            if (isset($maid->location)) {
                $query->whereHas('location', function ($q) use ($maid) {
                    if (!empty($maid->location['city'])) {
                        $q->where('city', $maid->location['city']);
                    } elseif (!empty($maid->location['province'])) {
                        $q->where('province', $maid->location['province']);
                    }
                });
            }

            // 3. Match by expected salary if the maid has specified
            if (!empty($maid->expected_salary)) {
                $expectedSalary = (float) $maid->expected_salary;
                // Find jobs that have a max salary at least the maid's expected salary
                $query->where('max_salary', '>=', $expectedSalary);
            }
        } else {
            // If no user or not a maid, just return the most popular/newest jobs
            $query->orderBy('created_at', 'desc');
        }

        // Apply any additional filters
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($perPage > 0) {
            return $query->paginate($perPage);
        }

        return $query->limit(10)->get();
    }

    /**
     * Get featured job postings
     * 
     * @param int $limit
     * @return Collection
     */
    public function getFeaturedJobs(int $limit = 5): Collection
    {
        // In a real app, this might be jobs that have been boosted or promoted
        // For now, we'll just get the most recently posted jobs
        return JobPosting::with([
            'photos',
            'location',
            'bonuses',
            'employer',
            'employer.user.profile'
        ])
            ->active()
            ->notArchived()
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
