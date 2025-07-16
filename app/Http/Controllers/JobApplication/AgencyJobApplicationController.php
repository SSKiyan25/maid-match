<?php

namespace App\Http\Controllers\JobApplication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobPosting\JobPosting;
use App\Models\Agency\Agency;
use App\Models\JobPosting\JobApplication;
use App\Models\Agency\AgencyCredit;
use App\Http\Requests\JobPosting\JobApplicationRequest;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\JsonResponse;

class AgencyJobApplicationController extends Controller
{
    public function show(Request $request, $jobPostId)
    {
        $jobPost = JobPosting::with([
            'photos',
            'location',
            'bonuses',
            'employer.user.profile',
            'applications'
        ])->findOrFail($jobPostId);

        // Find agency by user_id
        $agency = Agency::where('user_id', auth()->id())->first();

        // If agency not found, handle error or return empty
        if (!$agency) {
            return Inertia::render('Browse/JobPosts/Show', [
                'jobPost' => $jobPost,
                'agencyMaids' => [],
                'agencyCredits' => 0,
                'agencyApplications' => [],
            ]);
        }

        // Fetch agency maids with maid, user, and profile
        $agencyMaids = $agency->agencyMaids()
            ->with(['maid.user.profile'])
            ->active()
            ->where('is_archived', false)
            ->get();

        // Calculate total available credits
        $agencyCredits = $agency->credits()->sum('amount');

        $agencyApplicants = $jobPost->applications
            ? $jobPost->applications->whereIn('maid_id', $agencyMaids->pluck('maid_id'))->values()
            : collect();

        return Inertia::render('Browse/JobPosts/Show', [
            'jobPost' => $jobPost,
            'agencyMaids' => $agencyMaids,
            'agencyCredits' => $agencyCredits,
            'agencyApplications' => $agencyApplicants,
        ]);
    }

    public function apply(JobApplicationRequest $request, $jobPostId)
    {
        $agency = Agency::where('user_id', auth()->id())->firstOrFail();

        $maidIds = $request->input('maid_ids', []);
        $description = $request->input('description', null);

        // Validate credits
        $credits = $agency->credits()->sum('amount');
        if (count($maidIds) > $credits) {
            return redirect()->back()->withErrors([
                'message' => 'Not enough credits to apply with all selected maids.'
            ]);
        }

        DB::transaction(function () use ($agency, $maidIds, $jobPostId, $description, $request) {
            foreach ($maidIds as $maidId) {
                $maid = $agency->maids()->where('id', $maidId)->firstOrFail();
                $data = $request->validatedWithDefaults();
                $data['maid_id'] = $maidId;
                $data['job_posting_id'] = $jobPostId;
                $data['status'] = 'pending';
                $data['applied_at'] = now();
                $data['description'] = $description;

                $maid->jobApplications()->create($data);

                $agency->credits()->create([
                    'amount' => -1,
                    'type' => 'used',
                    'description' => 'Applied maid ID ' . $maidId . ' to job post ID ' . $jobPostId,
                ]);
            }
        });

        // Redirect with a flash message
        return redirect()->route('browse.job-posts.index')
            ->with('success', 'Applications submitted successfully!');
    }
}
