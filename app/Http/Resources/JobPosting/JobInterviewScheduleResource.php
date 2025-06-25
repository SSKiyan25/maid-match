<?php

namespace App\Http\Resources\JobPosting;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Maid\MaidResource;

class JobInterviewScheduleResource extends JsonResource
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
            'job_application_id' => $this->job_application_id,
            'title' => $this->title,
            'interview_date' => $this->interview_date?->toDateString(),
            'time_start' => $this->time_start?->toTimeString(),
            'time_end' => $this->time_end?->toTimeString(),
            'status' => $this->status,
            'description' => $this->description,
            'type' => $this->type,
            'location' => $this->location,
            'meeting_link' => $this->meeting_link,
            'employer_notes' => $this->employer_notes,
            'maid_notes' => $this->maid_notes,
            'employer_rating' => $this->employer_rating,
            'maid_rating' => $this->maid_rating,
            'confirmed_at' => $this->confirmed_at?->toISOString(),
            'is_archived' => $this->is_archived,

            // Simple computed attributes
            'status_label' => $this->status_label,
            'type_label' => $this->type_label,

            // Relationships
            'job_posting' => new JobPostingResource($this->whenLoaded('jobPosting')),
            'maid' => new MaidResource($this->whenLoaded('maid')),
            'job_application' => new JobApplicationResource($this->whenLoaded('jobApplication')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
