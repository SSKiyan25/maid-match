<?php

namespace App\Http\Controllers\Browse;

use App\Http\Controllers\Controller;
use App\Http\Resources\Agency\AgencyResource;
use App\Http\Resources\Agency\AgencyMaidResource;
use App\Http\Resources\Agency\AgencyPhotoResource;
use App\Models\Agency\Agency;
use App\Services\AgencyQueryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgencyPageController extends Controller
{
    protected $agencyQueryService;

    public function __construct(AgencyQueryService $agencyQueryService)
    {
        $this->agencyQueryService = $agencyQueryService;
    }

    /**
     * Display a listing of agencies with various sections
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Get the authenticated employer
        $employer = Auth::user()->employer;

        // Get employer's address from profile
        $employerAddress = null;
        if ($employer && $employer->user && $employer->user->profile) {
            $employerAddress = $employer->user->profile->address;
        }

        // Get filter parameters
        $filters = [
            'search' => $request->input('search', ''),
            'sort_by' => $request->input('sort_by', 'featured'),
            'page' => $request->input('page', 1),
        ];

        // Get filtered agencies (main grid)
        $filteredAgencies = $this->agencyQueryService->getFilteredAgencies($filters);

        // Get featured sections
        $featuredSections = [
            'featuredAgencies' => $this->agencyQueryService->getFeaturedAgencies(),
            'verifiedAgencies' => $this->agencyQueryService->getVerifiedAgencies(),
            'recentAgencies' => $this->agencyQueryService->getRecentAgencies(),
            'popularAgencies' => $this->agencyQueryService->getPopularAgencies(),
            'nearbyAgencies' => $employerAddress ? $this->agencyQueryService->getNearbyAgencies($employerAddress) : [],
        ];

        // Return Inertia view with data
        return Inertia::render('Browse/Agencies/index', [
            'agencies' => $filteredAgencies['data'],
            'pagination' => $filteredAgencies['meta'],
            'featuredSections' => $featuredSections,
            'activeFilters' => $filters,
        ]);
    }

    /**
     * Display the agency's profile page
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        // Find the agency with related data
        $agency = Agency::with([
            'user',
            'agencyMaids' => function ($query) {
                $query->with(['maid.user.profile', 'maid.documents']);
            },
            'photos'
        ])->findOrFail($id);

        // Calculate agency stats
        $stats = [
            'total_maids' => $agency->maids()->count(),
            'total_photos' => $agency->photos()->count(),
            // Will add more in the future
        ];

        // Return Inertia view with data
        return Inertia::render('Browse/Agencies/Agency', [
            'agency' => (new AgencyResource($agency))->additional([
                'stats' => $stats
            ]),
            'maids' => AgencyMaidResource::collection($agency->agencyMaids),
            'photos' => AgencyPhotoResource::collection($agency->photos),
        ]);
    }
}
