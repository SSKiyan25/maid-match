<?php

namespace App\Services;

use App\Models\Agency\Agency;
use App\Http\Resources\Agency\AgencyResource;

class AgencyQueryService
{
    /**
     * Get filtered agencies based on search criteria
     */
    public function getFilteredAgencies(array $filters)
    {
        // Start with base query
        $query = Agency::with(['user', 'photos'])
            ->withCount('maids')
            ->whereIn('status', ['active', 'pending_verification'])
            ->where('is_archived', false);

        // Apply search filter
        if (!empty($filters['search'])) {
            $searchTerm = $filters['search'];
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%")
                    ->orWhere('business_email', 'like', "%{$searchTerm}%");
            });
        }

        // Apply sorting
        switch ($filters['sort_by'] ?? 'featured') {
            case 'name':
                $query->orderBy('name', 'asc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'most_maids':
                $query->withCount('maids')
                    ->orderBy('maids_count', 'desc');
                break;
            case 'featured':
            default:
                $query->orderBy('is_premium', 'desc')
                    ->orderBy('is_verified', 'desc')
                    ->orderBy('created_at', 'desc');
                break;
        }

        // Get paginated results
        $perPage = 16;
        $page = $filters['page'] ?? 1;

        $paginatedResults = $query->paginate($perPage, ['*'], 'page', $page);

        // Transform results
        $data = AgencyResource::collection($paginatedResults)->toArray(request());

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
     * Get featured (premium) agencies
     */
    public function getFeaturedAgencies($limit = 8)
    {
        $agencies = Agency::with(['user', 'photos'])
            ->withCount('maids')
            ->whereIn('status', ['active', 'pending_verification'])
            ->where('is_archived', false)
            ->where('is_premium', true)
            ->orderBy('premium_at', 'desc')
            ->take($limit)
            ->get();

        return AgencyResource::collection($agencies)->toArray(request());
    }

    /**
     * Get verified agencies
     */
    public function getVerifiedAgencies($limit = 8)
    {
        $agencies = Agency::with(['user', 'photos'])
            ->withCount('maids')
            ->whereIn('status', ['active', 'pending_verification'])
            ->where('is_archived', false)
            ->where('is_verified', true)
            ->orderBy('verified_at', 'desc')
            ->take($limit)
            ->get();

        return AgencyResource::collection($agencies)->toArray(request());
    }

    /**
     * Get recently added agencies
     */
    public function getRecentAgencies($limit = 8)
    {
        $agencies = Agency::with(['user', 'photos'])
            ->withCount('maids')
            ->whereIn('status', ['active', 'pending_verification'])
            ->where('is_archived', false)
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();

        return AgencyResource::collection($agencies)->toArray(request());
    }

    /**
     * Get popular agencies (based on number of maids)
     */
    public function getPopularAgencies($limit = 8)
    {
        $agencies = Agency::with(['user', 'photos'])
            ->withCount('maids')
            ->whereIn('status', ['active', 'pending_verification'])
            ->where('is_archived', false)
            ->withCount('maids')
            ->orderBy('maids_count', 'desc')
            ->take($limit)
            ->get();

        return AgencyResource::collection($agencies)->toArray(request());
    }

    /**
     * Get agencies nearby based on location
     */
    public function getNearbyAgencies(array $location, $limit = 8)
    {
        if (empty($location)) {
            return collect([]);
        }

        $cityToMatch = $location['city'] ?? '';
        $provinceToMatch = $location['province'] ?? '';

        $agencies = Agency::with(['user', 'photos'])
            ->withCount('maids')
            ->whereIn('status', ['active', 'pending_verification'])
            ->where('is_archived', false)
            ->where(function ($query) use ($cityToMatch, $provinceToMatch) {
                if (!empty($cityToMatch)) {
                    $query->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(address, '$.city')) = ?", [$cityToMatch]);
                }

                if (!empty($provinceToMatch)) {
                    $query->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(address, '$.province')) = ?", [$provinceToMatch]);
                }
            })
            ->take($limit)
            ->get();

        return AgencyResource::collection($agencies)->toArray(request());
    }

    /**
     * Get highly rated agencies
     */
    public function getHighlyRatedAgencies($limit = 8)
    {
        // Once you implement a rating system, this can be updated
        $agencies = Agency::with(['user', 'photos'])
            ->withCount('maids')
            ->whereIn('status', ['active', 'pending_verification'])
            ->where('is_archived', false)
            ->where('is_verified', true)
            ->inRandomOrder()
            ->take($limit)
            ->get();

        return AgencyResource::collection($agencies)->toArray(request());
    }
}
