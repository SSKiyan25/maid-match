<?php

namespace App\Http\Controllers\Employer\JobPosting;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobPosting\JobPhotoRequest;
use App\Http\Resources\JobPosting\JobPhotoResource;
use App\Models\JobPosting\JobPhoto;
use Illuminate\Http\Request;

class PhotoController extends Controller
{
    // List all photos for a job posting
    public function index(Request $request)
    {
        $jobPostingId = $request->query('job_posting_id');
        $photos = JobPhoto::where('job_posting_id', $jobPostingId)
            ->notArchived()
            ->ordered()
            ->get();

        return JobPhotoResource::collection($photos);
    }

    // Store a new photo (with file upload or URL)
    public function store(JobPhotoRequest $request)
    {
        $validated = $request->validatedWithFileUpload();

        $photo = JobPhoto::create($validated);

        return new JobPhotoResource($photo);
    }

    // Show a single photo
    public function show(JobPhoto $photo)
    {
        $this->authorize('view', $photo);
        return new JobPhotoResource($photo);
    }

    // Update a photo (with file upload or URL)
    public function update(JobPhotoRequest $request, JobPhoto $photo)
    {
        $this->authorize('update', $photo);

        $validated = $request->validatedWithFileUpload();
        $photo->update($validated);

        return new JobPhotoResource($photo);
    }

    // Archive (soft-delete) a photo
    public function archive(JobPhoto $photo)
    {
        $this->authorize('update', $photo);
        $photo->update(['is_archived' => true]);

        return response()->json(['message' => 'Photo archived.']);
    }

    // List archived photos for a job posting
    public function archived(Request $request)
    {
        $jobPostingId = $request->query('job_posting_id');
        $photos = JobPhoto::where('job_posting_id', $jobPostingId)
            ->where('is_archived', true)
            ->ordered()
            ->get();

        return JobPhotoResource::collection($photos);
    }
}
