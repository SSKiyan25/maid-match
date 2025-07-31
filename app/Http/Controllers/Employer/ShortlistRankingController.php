<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\JobPosting\JobPosting;
use App\Models\JobPosting\JobApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShortlistRankingController extends Controller
{
    public function index(Request $request)
    {
        $employer = $request->user()->employer;

        // Fetch job postings with shortlisted applications, ordered by ranking
        $jobPostings = JobPosting::with([
            'applications' => function ($query) {
                $query->where('status', 'shortlisted')
                    ->orderBy('ranking_position');
            },
            'applications.maid.user.profile',
            'location'
        ])
            ->where('employer_id', $employer->id)
            ->get();

        // Flatten applicants for easier frontend use
        $shortlistedApplicants = $jobPostings->flatMap(function ($job) {
            return $job->applications->map(function ($app) use ($job) {
                $agency = $app->maid->agency ?? null;
                return [
                    'job_posting_id' => $job->id,
                    'job_title' => $job->title,
                    'application' => $app,
                    'ranking_position' => $app->ranking_position,
                    'agency_id' => $agency ? $agency->id : null,
                    'agency_name' => $agency ? $agency->name : null,
                    'agency_user' => $agency ? $agency->user : null,
                ];
            });
        });

        return Inertia::render('Employer/JobApplication/ShortlistRanking', [
            'jobPostings' => $jobPostings,
            'shortlistedApplicants' => $shortlistedApplicants,
        ]);
    }

    public function updateRankings(Request $request)
    {
        $request->validate([
            'job_id' => 'required|integer|exists:job_postings,id',
            'rankings' => 'required|array',
            'rankings.*.application_id' => 'required|integer|exists:job_applications,id',
            'rankings.*.position' => 'required|integer|min:1',
        ]);

        $employer = $request->user()->employer;
        $jobId = $request->input('job_id');

        // Verify the job belongs to this employer
        $job = JobPosting::where('id', $jobId)
            ->where('employer_id', $employer->id)
            ->firstOrFail();

        // Update rankings
        foreach ($request->input('rankings') as $ranking) {
            JobApplication::where('id', $ranking['application_id'])
                ->where('job_posting_id', $jobId)
                ->where('status', 'shortlisted')
                ->update(['ranking_position' => $ranking['position']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Rankings updated successfully',
        ]);
    }
}
