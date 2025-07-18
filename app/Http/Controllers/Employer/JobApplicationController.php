<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\JobPosting\JobPosting;
use App\Models\JobPosting\JobApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobApplicationController extends Controller
{
    public function index(Request $request)
    {
        $employer = $request->user()->employer;

        $jobPostings = JobPosting::with([
            'applications.maid.user.profile',
            'location'
        ])
            ->where('employer_id', $employer->id)
            ->get();

        $allApplicants = $jobPostings->flatMap(function ($job) {
            return $job->applications->map(function ($app) use ($job) {
                $agency = $app->maid->agency ?? null;
                return [
                    'job_posting_id' => $job->id,
                    'job_title' => $job->title,
                    'application' => $app,
                    'agency_id' => $agency ? $agency->id : null,
                    'agency_name' => $agency ? $agency->name : null,
                ];
            });
        });

        return Inertia::render('Employer/JobApplication/index', [
            'jobPostings' => $jobPostings,
            'allApplicants' => $allApplicants,
        ]);
    }

    public function updateStatus(Request $request, $applicationId)
    {
        $request->validate([
            'status' => 'required|string|in:pending,shortlisted,rejected,hired,withdrawn',
        ]);

        $application = JobApplication::findOrFail($applicationId);
        $newStatus = $request->input('status');

        // If status is being set to shortlisted, handle ranking
        if ($newStatus === 'shortlisted') {
            $jobPosting = $application->jobPosting;
            $maxRanking = $jobPosting->applications()
                ->where('status', 'shortlisted')
                ->max('ranking_position');
            $application->ranking_position = $maxRanking ? $maxRanking + 1 : 1;
        } else {
            $application->ranking_position = null;
        }

        // If status is being set to hired, set hired_at
        if ($newStatus === 'hired') {
            $application->hired_at = now();
        } else {
            $application->hired_at = null;
        }

        $application->status = $newStatus;
        $application->save();

        return back()->with('success', "Applicant status updated to {$newStatus}.");
    }
}
