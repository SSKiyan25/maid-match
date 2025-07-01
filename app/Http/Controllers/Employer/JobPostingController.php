<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobPosting\JobPostingRequest;
use App\Models\JobPosting\JobPosting;

class JobPostingController extends Controller
{
    // List all job postings (for index page)
    public function index()
    {
        $jobPostings = JobPosting::withCount(['applications', 'interviews'])
            ->where('employer_id', auth()->id())
            ->latest()
            ->get();

        return inertia('Employer/JobPosting/index', [
            'jobPostings' => $jobPostings,
        ]);
    }

    // Show create form
    public function create()
    {
        return inertia('Employer/JobPosting/Create');
    }

    // Store new job posting
    public function store(JobPostingRequest $request)
    {
        $validated = $request->validatedWithEmployer();
        $jobPosting = JobPosting::create($validated);

        // Handle related models if present
        if ($request->has('location')) {
            $locationData = $request->input('location');
            $locationData['is_hidden'] = filter_var($locationData['is_hidden'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            $locationData['is_archived'] = filter_var($locationData['is_archived'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            $jobPosting->location()->create($locationData);
        }
        if ($request->has('bonuses')) {
            foreach ($request->input('bonuses') as $bonus) {
                $jobPosting->bonuses()->create($bonus);
            }
        }
        if ($request->has('photos')) {
            $photos = $request->file('photos', []);
            foreach ($photos as $index => $fileData) {
                $photoData = $request->input("photos.$index", []);
                if (isset($fileData['file']) && $fileData['file'] instanceof \Illuminate\Http\UploadedFile) {
                    $file = $fileData['file'];
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $photoData['url'] = $file->storeAs("job-photos/{$jobPosting->id}", $filename, 'public');
                }
                unset($photoData['file']);
                $jobPosting->photos()->create($photoData);
            }
        }

        return redirect()->route('employer.job-postings.index')->with('success', 'Job posting created!');
    }

    // Show edit form
    public function edit(JobPosting $jobPosting)
    {
        $this->authorize('update', $jobPosting);

        // Load related models if needed
        $jobPosting->load(['location', 'photos', 'bonuses']);

        return inertia('Employer/JobPosting/Edit', [
            'jobPosting' => $jobPosting,
        ]);
    }

    // Update job posting
    public function update(JobPostingRequest $request, JobPosting $jobPosting)
    {
        $this->authorize('update', $jobPosting);

        $validated = $request->validatedWithEmployer();
        $jobPosting->update($validated);

        // Optionally, update related models here

        return redirect()->route('employer.job-postings.index')->with('success', 'Job posting updated!');
    }

    // Archive (soft-delete) a job posting
    public function archive(JobPosting $jobPosting)
    {
        $this->authorize('update', $jobPosting);
        $jobPosting->update(['is_archived' => true]);
        return redirect()->route('employer.job-postings.index')->with('success', 'Job posting archived!');
    }

    // List archived job postings
    public function archived()
    {
        $archived = JobPosting::withCount(['applications', 'interviews'])
            ->where('employer_id', auth()->id())
            ->where('is_archived', true)
            ->latest()
            ->get();

        return inertia('Employer/JobPosting/Archived', [
            'jobPostings' => $archived,
        ]);
    }
}
