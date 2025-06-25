<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'time_start' => $this->time_start?->toISOString(),
            'time_end' => $this->time_end?->toISOString(),
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

            // Computed attributes from the model
            'status_label' => $this->status_label,
            'type_label' => $this->type_label,
            'is_scheduled' => $this->is_scheduled,
            'is_confirmed' => $this->is_confirmed,
            'is_completed' => $this->is_completed,
            'is_cancelled' => $this->is_cancelled,
            'is_upcoming' => $this->is_upcoming,
            'is_past' => $this->is_past,
            'is_today' => $this->is_today,
            'formatted_date' => $this->formatted_date,
            'formatted_time' => $this->formatted_time,
            'formatted_date_time' => $this->formatted_date_time,
            'duration_minutes' => $this->duration_minutes,
            'duration_hours' => $this->duration_hours,
            'days_until_interview' => $this->days_until_interview,
            'hours_until_interview' => $this->hours_until_interview,
            'average_rating' => $this->average_rating,
            'has_ratings' => $this->has_ratings,
            'requires_location' => $this->requires_location,
            'requires_meeting_link' => $this->requires_meeting_link,

            // Helper methods
            'can_cancel' => $this->canCancel(),
            'can_reschedule' => $this->canReschedule(),
            'can_complete' => $this->canComplete(),

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