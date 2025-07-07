<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobPosting\JobPostingRequest;
use App\Models\JobPosting\JobPosting;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class JobPostingController extends Controller
{
    use AuthorizesRequests;

    // List all job postings (for index page)
    public function index()
    {
        $jobPostings = JobPosting::with([
            'location',
            'bonuses',
            'photos',
        ])
            ->withCount(['applications', 'interviews'])
            ->where('employer_id', auth()->user()->employer->id)
            ->latest()
            ->get();
        return inertia('Employer/JobPosting/index', [
            'jobPostings' => $jobPostings,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    public function create()
    {
        return inertia('Employer/JobPosting/Create');
    }

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
                // Ensure is_archived is always 0 or 1
                $bonus['is_archived'] = filter_var($bonus['is_archived'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
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
                // Ensure is_archived is always 0 or 1 for photos if present
                if (isset($photoData['is_archived'])) {
                    $photoData['is_archived'] = filter_var($photoData['is_archived'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
                }
                $jobPosting->photos()->create($photoData);
            }
        }

        return redirect()->route('employer.job-postings.index')->with('success', "Job posting \"{$jobPosting->title}\" created!");
    }

    public function edit(JobPosting $jobPosting)
    {
        $this->authorize('update', $jobPosting);

        // Load related models if needed
        $jobPosting->load(['location', 'photos', 'bonuses']);

        return inertia('Employer/JobPosting/Edit', [
            'jobPosting' => $jobPosting,
        ]);
    }

    public function update(JobPostingRequest $request, JobPosting $jobPosting)
    {
        $this->authorize('update', $jobPosting);

        $validated = $request->validatedWithEmployer();
        $jobPosting->update($validated);

        // Update or create location
        if ($request->has('location')) {
            $locationData = $request->input('location');
            $locationData['is_hidden'] = filter_var($locationData['is_hidden'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            $locationData['is_archived'] = filter_var($locationData['is_archived'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
            if ($jobPosting->location) {
                $jobPosting->location->update($locationData);
            } else {
                $jobPosting->location()->create($locationData);
            }
        }

        if ($request->has('bonuses')) {
            $jobPosting->bonuses()->delete();
            foreach ($request->input('bonuses') as $bonus) {
                $bonus['is_archived'] = filter_var($bonus['is_archived'] ?? false, FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
                $jobPosting->bonuses()->create($bonus);
            }
        }

        // Only delete photos that were removed, update existing, add new
        if ($request->has('photos')) {
            $submittedPhotos = $request->input('photos', []);
            $existingPhotoIds = collect($submittedPhotos)
                ->pluck('id')
                ->filter()
                ->all();

            // Delete photos that were removed in the form
            $jobPosting->photos()
                ->whereNotIn('id', $existingPhotoIds)
                ->delete();

            foreach ($submittedPhotos as $index => $photoData) {
                // If photo has an ID, update it; otherwise, create new
                if (isset($photoData['id'])) {
                    $photo = $jobPosting->photos()->find($photoData['id']);
                    if ($photo) {
                        // Optionally handle file update if new file uploaded
                        if ($request->hasFile("photos.$index.file")) {
                            $file = $request->file("photos.$index.file");
                            $filename = time() . '_' . $file->getClientOriginalName();
                            $photoData['url'] = $file->storeAs("job-photos/{$jobPosting->id}", $filename, 'public');
                        }
                        unset($photoData['file']);
                        if (isset($photoData['is_archived'])) {
                            $photoData['is_archived'] = filter_var($photoData['is_archived'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
                        }
                        $photo->update($photoData);
                    }
                } else {
                    // New photo
                    if ($request->hasFile("photos.$index.file")) {
                        $file = $request->file("photos.$index.file");
                        $filename = time() . '_' . $file->getClientOriginalName();
                        $photoData['url'] = $file->storeAs("job-photos/{$jobPosting->id}", $filename, 'public');
                    }
                    unset($photoData['file']);
                    if (isset($photoData['is_archived'])) {
                        $photoData['is_archived'] = filter_var($photoData['is_archived'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0;
                    }
                    $jobPosting->photos()->create($photoData);
                }
            }
        }

        return redirect()
            ->route('employer.job-postings.index')
            ->with('success', "Job posting \"{$jobPosting->title}\" updated!");
    }

    public function archive(JobPosting $jobPosting)
    {
        $this->authorize('update', $jobPosting);

        $jobPosting->update(['is_archived' => true]);

        // Archive related location
        if ($jobPosting->location) {
            $jobPosting->location->update(['is_archived' => true]);
        }

        // Archive related bonuses
        foreach ($jobPosting->bonuses as $bonus) {
            $bonus->update(['is_archived' => true]);
        }

        // Archive related photos
        foreach ($jobPosting->photos as $photo) {
            $photo->update(['is_archived' => true]);
        }

        return redirect()->route('employer.job-postings.index')->with('success', 'Job posting and related data archived!');
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
