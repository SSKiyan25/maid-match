<?php

namespace App\Http\Controllers\Browse;

use App\Http\Controllers\Controller;
use App\Http\Resources\Maid\MaidResource;
use App\Http\Resources\Maid\MaidDocumentResource;
use App\Models\JobPosting\JobPosting;
use App\Services\MaidMatchingService;
use App\Services\MaidQueryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Maid\Maid;
use Inertia\Inertia;

class MaidPageController extends Controller
{
    protected $matchingService;
    protected $queryService;

    public function __construct(MaidMatchingService $matchingService, MaidQueryService $queryService)
    {
        $this->matchingService = $matchingService;
        $this->queryService = $queryService;
    }

    /**
     * Display the maid's profile page
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        // Find the maid with related data
        $maid = Maid::with([
            'user.profile',
            'user.photos',
            'agency',
            'documents',
            'characterReferences',
        ])->findOrFail($id);

        return Inertia::render('Browse/Maids/Maid', [
            'maid' => new MaidResource($maid),
            'documents' => MaidDocumentResource::collection($maid->documents),
        ]);
    }

    /**
     * Display a listing of maids with match percentages for employer's job postings
     */
    public function index(Request $request)
    {
        // Get the authenticated employer
        $employer = Auth::user()->employer;

        // Get the employer's active job postings
        $jobPostings = JobPosting::where('employer_id', $employer->id)
            ->where('status', 'active')
            ->with('location')
            ->get();

        // Get filter parameters
        $filters = [
            'search' => $request->input('search', ''),
            'skills' => $request->input('skills', []),
            'languages' => $request->input('languages', []),
            'sort_by' => $request->input('sort_by', 'match'),
        ];

        // Get job posting if selected
        $selectedJobId = $request->input('job_posting_id');
        $selectedJob = null;

        if ($selectedJobId) {
            $selectedJob = $jobPostings->firstWhere('id', $selectedJobId);
            $filters['job_posting_id'] = $selectedJobId;
        }

        // Get filtered maids (main grid)
        $filteredMaids = $this->queryService->getFilteredMaids($filters, $selectedJob);

        // Get all featured sections regardless of job selection
        $featuredSections = [
            'bestMatches' => $this->queryService->getBestMatchedMaids($jobPostings),
            'nearbyMaids' => $jobPostings->isNotEmpty()
                ? $this->queryService->getNearbyMaids($jobPostings[0]->location->toArray())
                : collect([]),
            'recentMaids' => $this->queryService->getRecentMaids(),
            'bookmarkedMaids' => $employer ? $this->queryService->getBookmarkedMaids($employer) : [],
        ];

        // Get filter options
        $filterOptions = [
            'skills' => $this->queryService->getAllSkills(),
            'languages' => $this->queryService->getAllLanguages(),
        ];

        return Inertia::render('Browse/Maids/index', [
            'maids' => $filteredMaids['data'],
            'pagination' => $filteredMaids['meta'],
            'job_postings' => $jobPostings,
            'featuredSections' => $featuredSections,
            'filterOptions' => $filterOptions,
            'activeFilters' => $filters,
        ]);
    }

    /**
     * Show detailed matching information for a specific maid and job posting
     */
    public function showMatchDetails($maidId, $jobId)
    {
        $maid = Maid::with(['user.profile', 'user.photos'])
            ->findOrFail($maidId);

        $jobPosting = JobPosting::with(['location'])
            ->findOrFail($jobId);

        $jobPostingArray = $jobPosting->toArray();
        if ($jobPosting->location) {
            $jobPostingArray['location'] = [
                'barangay' => $jobPosting->location->brgy,
                'city' => $jobPosting->location->city,
                'province' => $jobPosting->location->province,
            ];
        }

        return Inertia::render('Browse/Maids/MatchDetails', [
            'maid' => new MaidResource($maid),
            'jobPosting' => $jobPostingArray
        ]);
    }
}
