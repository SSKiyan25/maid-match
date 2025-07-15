<?php

namespace App\Http\Controllers\Browse;

use App\Http\Controllers\Controller;
use App\Models\JobPosting\JobPosting;

class ForJobPostsController extends Controller
{
    public function index()
    {
        $jobPosts = JobPosting::with([
            'photos',
            'location',
            'bonuses',
            'employer',
            'employer.user.profile'
        ])
            ->active()
            ->notArchived()
            ->get();

        return inertia('Browse/JobPosts/index', [
            'jobPosts' => $jobPosts
        ]);
    }


    public function nearYou()
    {
        $jobPosts = JobPosting::with([
            'photos',
            'location',
            'bonuses',
            'employer',
            'employer.user.profile'
        ])
            ->active()
            ->notArchived()
            ->get();

        // Logic Not Addded Yet

        return inertia('Browse/JobPosts/CategoryView', [
            'category' => 'near-you',
            'jobs' => $jobPosts,
            'title' => 'Jobs Near You',
            'description' => 'Browse all available job opportunities in your area.'
        ]);
    }

    public function recommended()
    {
        $jobPosts = JobPosting::with([
            'photos',
            'location',
            'bonuses',
            'employer',
            'employer.user.profile'
        ])
            ->active()
            ->notArchived()
            ->get();

        // Logic not added Yet
        $recommendedJobs = $jobPosts->filter(function ($job, $index) {
            return $index % 2 === 0;
        })->values();

        return inertia('Browse/JobPosts/CategoryView', [
            'category' => 'recommended',
            'jobs' => $recommendedJobs,
            'title' => 'Recommended Jobs',
            'description' => 'Job opportunities matching your skills and preferences.'
        ]);
    }
}
