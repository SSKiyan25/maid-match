<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobApplicationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_posting_id' => $this->job_posting_id,
            'maid_id' => $this->maid_id,
            'status' => $this->status,
            'ranking_position' => $this->ranking_position,
            'employer_notes' => $this->employer_notes,
            'description' => $this->description,
            'proposed_salary' => $this->proposed_salary,
            'applied_at' => $this->applied_at?->toISOString(),
            'reviewed_at' => $this->reviewed_at?->toISOString(),
            'is_archived' => $this->is_archived,

            // Computed attributes from the model
            'status_label' => $this->status_label,
            'is_pending' => $this->is_pending,
            'is_reviewed' => $this->is_reviewed,
            'is_shortlisted' => $this->is_shortlisted,
            'is_rejected' => $this->is_rejected,
            'is_accepted' => $this->is_accepted,
            'is_withdrawn' => $this->is_withdrawn,
            'is_active' => $this->is_active,
            'formatted_proposed_salary' => $this->formatted_proposed_salary,
            'days_ago_applied' => $this->days_ago_applied,
            'days_ago_reviewed' => $this->days_ago_reviewed,
            'response_time' => $this->response_time,
            'has_interviews' => $this->has_interviews,
            'can_withdraw' => $this->can_withdraw,
            'can_advance_status' => $this->can_advance_status,
            'next_status' => $this->next_status,
            'salary_match_percentage' => $this->salary_match_percentage,

            // Related data (when loaded)
            'upcoming_interview' => new JobInterviewScheduleResource($this->whenLoaded('upcomingInterview')),
            'latest_interview' => new JobInterviewScheduleResource($this->whenLoaded('latestInterview')),

            // Relationships
            'job_posting' => new JobPostingResource($this->whenLoaded('jobPosting')),
            'maid' => new MaidResource($this->whenLoaded('maid')),
            'interviews' => JobInterviewScheduleResource::collection($this->whenLoaded('interviews')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}