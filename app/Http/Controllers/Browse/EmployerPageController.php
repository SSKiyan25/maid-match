<?php

namespace App\Http\Controllers\Browse;

use App\Http\Controllers\Controller;
use App\Http\Resources\Employer\EmployerResource;
use App\Http\Resources\JobPosting\JobPostingResource;
use App\Models\Employer\Employer;
use Inertia\Inertia;

class EmployerPageController extends Controller
{
    /**
     * Display the employer's profile page
     * 
     * @param int $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        // Find the employer with related data
        $employer = Employer::with([
            'user.profile',
            'user.photos',
            'children',
            'pets',
            'jobPostings' => function ($query) {
                $query->active()
                    ->notArchived()
                    ->with(['location', 'photos'])
                    ->latest();
            }
        ])->findOrFail($id);

        // Calculate employer stats
        $stats = [
            'active_job_postings' => $employer->getActiveJobPostingsCount(),
            'total_job_postings' => $employer->jobPostings()->count(),
            'family_size' => $employer->family_size,
        ];

        return Inertia::render('Browse/Employers/Employer', [
            'employer' => (new EmployerResource($employer))->additional([
                'stats' => $stats
            ]),
            'jobPostings' => JobPostingResource::collection($employer->jobPostings),
        ]);
    }
}
