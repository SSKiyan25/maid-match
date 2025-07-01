<?php

namespace App\Http\Controllers\Employer\JobPosting;

use App\Http\Controllers\Controller;
use App\Http\Requests\JobPosting\JobBonusRequest;
use App\Http\Resources\JobPosting\JobBonusResource;
use App\Models\JobPosting\JobBonus;
use Illuminate\Http\Request;

class BonusController extends Controller
{
    // List all bonuses for a job posting
    public function index(Request $request)
    {
        $jobPostingId = $request->query('job_posting_id');
        $bonuses = JobBonus::where('job_posting_id', $jobPostingId)
            ->notArchived()
            ->latest()
            ->get();

        return JobBonusResource::collection($bonuses);
    }

    public function store(JobBonusRequest $request)
    {
        $bonus = JobBonus::create($request->validated());

        return new JobBonusResource($bonus);
    }

    // Show a single bonus
    public function show(JobBonus $bonus)
    {
        $this->authorize('view', $bonus);
        return new JobBonusResource($bonus);
    }

    public function update(JobBonusRequest $request, JobBonus $bonus)
    {
        $this->authorize('update', $bonus);
        $bonus->update($request->validated());

        return new JobBonusResource($bonus);
    }

    // Archive (soft-delete) a bonus
    public function archive(JobBonus $bonus)
    {
        $this->authorize('update', $bonus);
        $bonus->update(['is_archived' => true]);

        return response()->json(['message' => 'Bonus archived.']);
    }

    // List archived bonuses for a job posting
    public function archived(Request $request)
    {
        $jobPostingId = $request->query('job_posting_id');
        $bonuses = JobBonus::where('job_posting_id', $jobPostingId)
            ->where('is_archived', true)
            ->latest()
            ->get();

        return JobBonusResource::collection($bonuses);
    }
}
