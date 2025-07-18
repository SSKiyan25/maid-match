<?php

namespace App\Http\Resources\JobPosting;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Maid\MaidResource;

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
            'hired_at' => $this->reviewed_at?->toISOString(),
            'is_archived' => $this->is_archived,

            // Computed attributes from the model
            'status_label' => $this->status_label,
            'formatted_proposed_salary' => $this->formatted_proposed_salary,

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
