<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\JobPosting\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HiredApplicantsController extends Controller
{
    public function index(Request $request)
    {
        $employer = $request->user()->employer;

        // Fetch job postings with hired applications
        $jobPostings = JobPosting::with([
            'applications' => function ($query) {
                $query->where('status', 'hired')
                    ->orderBy('hired_at', 'desc');
            },
            'applications.maid.user.profile',
            'applications.maid.agency.user',
            'location'
        ])
            ->where('employer_id', $employer->id)
            ->get();

        // Flatten hired applicants for easier frontend use
        $hiredApplicants = $jobPostings->flatMap(function ($job) {
            return $job->applications->map(function ($app) use ($job) {
                $agency = $app->maid->agency ?? null;
                return [
                    'job_posting_id' => $job->id,
                    'job_title' => $job->title,
                    'application' => $app,
                    'hired_at' => $app->hired_at,
                    'agency_id' => $agency ? $agency->id : null,
                    'agency_name' => $agency ? $agency->name : null,
                    'agency_user' => $agency ? $agency->user : null,
                ];
            });
        });

        return Inertia::render('Employer/JobApplication/HiredApplicants', [
            'jobPostings' => $jobPostings,
            'hiredApplicants' => $hiredApplicants,
        ]);
    }
}
