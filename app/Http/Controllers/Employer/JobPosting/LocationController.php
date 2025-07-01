<?php

namespace App\Http\Controllers\Employer\JobPosting;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobPosting\JobLocationRequest;
use App\Http\Resources\JobPosting\JobLocationResource;
use App\Models\JobPosting\JobLocation;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    // List all locations for a job posting
    public function index(Request $request)
    {
        $jobPostingId = $request->query('job_posting_id');
        $locations = JobLocation::where('job_posting_id', $jobPostingId)
            ->notArchived()
            ->latest()
            ->get();

        return JobLocationResource::collection($locations);
    }

    public function store(JobLocationRequest $request)
    {
        $location = JobLocation::create($request->validated());

        return new JobLocationResource($location);
    }

    // Show a single location
    public function show(JobLocation $location)
    {
        $this->authorize('view', $location);
        return new JobLocationResource($location);
    }

    public function update(JobLocationRequest $request, JobLocation $location)
    {
        $this->authorize('update', $location);
        $location->update($request->validated());

        return new JobLocationResource($location);
    }

    // Archive (soft-delete) a location
    public function archive(JobLocation $location)
    {
        $this->authorize('update', $location);
        $location->update(['is_archived' => true]);

        return response()->json(['message' => 'Location archived.']);
    }

    // List archived locations for a job posting
    public function archived(Request $request)
    {
        $jobPostingId = $request->query('job_posting_id');
        $locations = JobLocation::where('job_posting_id', $jobPostingId)
            ->where('is_archived', true)
            ->latest()
            ->get();

        return JobLocationResource::collection($locations);
    }
}
