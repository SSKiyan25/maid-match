<?php

namespace App\Http\Controllers\Browse;

use App\Http\Controllers\Controller;
use App\Services\MaidQueryService;
use App\Services\MaidMatchingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\JobPosting\JobPosting;
use Inertia\Inertia;

class ViewAllController extends Controller
{
    protected $queryService;
    protected $matchingService;

    public function __construct(MaidQueryService $queryService, MaidMatchingService $matchingService)
    {
        $this->queryService = $queryService;
        $this->matchingService = $matchingService;
    }

    /**
     * Display all best matches
     */
    public function bestMatches(Request $request)
    {
        $employer = Auth::user()->employer;

        if (!$employer) {
            return redirect()->route('browse.maids.index');
        }

        $jobPostings = JobPosting::where('employer_id', $employer->id)
            ->where('status', 'active')
            ->with('location')
            ->get();

        if ($jobPostings->isEmpty()) {
            return redirect()->route('browse.maids.index')
                ->with('message', 'You need to create a job posting first to see matches.');
        }

        // Get job posting if selected
        $selectedJobId = $request->input('job_posting_id');
        $selectedJob = null;
        $jobTitle = null;

        if ($selectedJobId) {
            $selectedJob = $jobPostings->firstWhere('id', $selectedJobId);
            if ($selectedJob) {
                $jobTitle = $selectedJob->title;
            }
        }

        // Get all maids with best match data
        $maids = $this->queryService->getAllMatchedMaids($jobPostings, $selectedJob, 30);

        // Handle pagination
        $page = $request->input('page', 1);
        $perPage = 20;
        $total = count($maids);
        $lastPage = ceil($total / $perPage);

        // Simple manual pagination
        $paginatedMaids = array_slice($maids, ($page - 1) * $perPage, $perPage);

        $pagination = [
            'current_page' => (int) $page,
            'last_page' => $lastPage,
            'per_page' => $perPage,
            'total' => $total,
        ];

        return Inertia::render('Browse/Maids/ViewAll', [
            'maids' => $paginatedMaids,
            'pagination' => $pagination,
            'collectionType' => 'best-matches',
            'selectedJobId' => $selectedJobId,
            'jobTitle' => $jobTitle
        ]);
    }

    /**
     * Display all nearby maids
     */
    public function nearby(Request $request)
    {
        $employer = Auth::user()->employer;

        if (!$employer) {
            return redirect()->route('browse.maids.index');
        }

        $jobPostings = JobPosting::where('employer_id', $employer->id)
            ->where('status', 'active')
            ->with('location')
            ->get();

        if ($jobPostings->isEmpty() || !$jobPostings[0]->location) {
            return redirect()->route('browse.maids.index')
                ->with('message', 'No location information available to find nearby maids.');
        }

        // Get all nearby maids (extended limit for pagination)
        $nearbyMaids = $this->queryService->getNearbyMaids(
            $jobPostings[0]->location->toArray(),
            50 // Increased limit for pagination
        );

        // Handle pagination
        $page = $request->input('page', 1);
        $perPage = 20;
        $total = count($nearbyMaids);
        $lastPage = ceil($total / $perPage);

        // Simple manual pagination
        $paginatedMaids = array_slice($nearbyMaids, ($page - 1) * $perPage, $perPage);

        $pagination = [
            'current_page' => (int) $page,
            'last_page' => $lastPage,
            'per_page' => $perPage,
            'total' => $total,
        ];

        return Inertia::render('Browse/Maids/ViewAll', [
            'maids' => $paginatedMaids,
            'pagination' => $pagination,
            'collectionType' => 'nearby'
        ]);
    }
}
