<?php

namespace App\Http\Controllers\Browse;

use App\Http\Controllers\Controller;
use App\Models\JobPosting\JobPosting;
use App\Services\JobPostingService;
use Illuminate\Http\Request;

class ForJobPostsController extends Controller
{
    protected $jobPostingService;

    public function __construct(JobPostingService $jobPostingService)
    {
        $this->jobPostingService = $jobPostingService;
    }

    public function index(Request $request)
    {
        $filters = $request->only([
            'search', 'work_types', 'min_salary', 'max_salary', 
            'location', 'sort_by', 'sort_direction'
        ]);
        
        // Get paginated job posts with filters
        $jobPosts = $this->jobPostingService->getPaginated($filters, 10);
        
        // Get recommended and nearby jobs for the index page
        $recommendedJobs = $this->jobPostingService->getRecommendedJobs([], 0);
        $nearbyJobs = $this->jobPostingService->getNearbyJobs([], 0);
        $featuredJobs = $this->jobPostingService->getFeaturedJobs(5);

        return inertia('Browse/JobPosts/index', [
            'jobPosts' => $jobPosts,
            'recommendedJobs' => $recommendedJobs,
            'nearbyJobs' => $nearbyJobs,
            'featuredJobs' => $featuredJobs,
            'filters' => $filters,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    public function nearYou(Request $request)
    {
        $filters = $request->only([
            'search', 'work_types', 'min_salary', 'max_salary', 
            'location', 'sort_by', 'sort_direction'
        ]);
        
        // Get nearby jobs with pagination
        $nearbyJobs = $this->jobPostingService->getNearbyJobs($filters, 12);

        return inertia('Browse/JobPosts/CategoryView', [
            'category' => 'near-you',
            'jobs' => $nearbyJobs,
            'filters' => $filters,
            'title' => 'Jobs Near You',
            'description' => 'Browse all available job opportunities in your area.'
        ]);
    }

    public function recommended(Request $request)
    {
        $filters = $request->only([
            'search', 'work_types', 'min_salary', 'max_salary', 
            'location', 'sort_by', 'sort_direction'
        ]);
        
        // Get recommended jobs with pagination
        $recommendedJobs = $this->jobPostingService->getRecommendedJobs($filters, 12);

        return inertia('Browse/JobPosts/CategoryView', [
            'category' => 'recommended',
            'jobs' => $recommendedJobs,
            'filters' => $filters,
            'title' => 'Recommended Jobs',
            'description' => 'Job opportunities matching your skills and preferences.'
        ]);
    }
    
    public function featured(Request $request)
    {
        $filters = $request->only([
            'search', 'work_types', 'min_salary', 'max_salary', 
            'location', 'sort_by', 'sort_direction'
        ]);
        
        // Get featured jobs with pagination 
        // For now this is the same as getAllActive but would be different in a real app
        $featuredJobs = $this->jobPostingService->getPaginated($filters, 12);

        return inertia('Browse/JobPosts/CategoryView', [
            'category' => 'featured',
            'jobs' => $featuredJobs,
            'filters' => $filters,
            'title' => 'Featured Job Opportunities',
            'description' => 'Highlighted job opportunities from our top employers.'
        ]);
    }
    
    public function search(Request $request)
    {
        $filters = $request->only([
            'search', 'work_types', 'min_salary', 'max_salary', 
            'location', 'sort_by', 'sort_direction'
        ]);
        
        // Get search results with pagination
        $searchResults = $this->jobPostingService->getPaginated($filters, 12);
        
        return inertia('Browse/JobPosts/SearchResults', [
            'jobs' => $searchResults,
            'filters' => $filters,
            'searchTerm' => $request->input('search', ''),
        ]);
    }
}