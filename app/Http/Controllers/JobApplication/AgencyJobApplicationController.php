<?php

namespace App\Http\Controllers\JobApplication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\JobPosting\JobPosting;
use App\Models\Agency\Agency;
use Inertia\Inertia;

class AgencyJobApplicationController extends Controller
{
    public function show(Request $request, $jobPostId)
    {
        $jobPost = JobPosting::with([
            'photos',
            'location',
            'bonuses',
            'employer.user.profile'
        ])->findOrFail($jobPostId);

        // Find agency by user_id
        $agency = Agency::where('user_id', auth()->id())->first();

        // If agency not found, handle error or return empty
        if (!$agency) {
            return Inertia::render('Browse/JobPosts/Show', [
                'jobPost' => $jobPost,
                'agencyMaids' => [],
            ]);
        }

        // Fetch agency maids with maid, user, and profile
        $agencyMaids = $agency->agencyMaids()
            ->with(['maid.user.profile'])
            ->active()
            ->where('is_archived', false)
            ->get();

        return Inertia::render('Browse/JobPosts/Show', [
            'jobPost' => $jobPost,
            'agencyMaids' => $agencyMaids,
        ]);
    }
}
