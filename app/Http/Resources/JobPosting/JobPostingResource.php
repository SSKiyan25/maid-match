<?php

namespace App\Http\Resources\JobPosting;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Employer\EmployerResource;

class JobPostingResource extends JsonResource
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
            'title' => $this->title,
            'work_types' => $this->work_types,
            'provides_toiletries' => $this->provides_toiletries,
            'provides_food' => $this->provides_food,
            'accommodation_type' => $this->accommodation_type,
            'min_salary' => $this->min_salary,
            'max_salary' => $this->max_salary,
            'day_off_preference' => $this->day_off_preference,
            'day_off_type' => $this->day_off_type,
            'language_preferences' => $this->language_preferences,
            'description' => $this->description,
            'status' => $this->status,
            'is_archived' => $this->is_archived,

            // Computed attributes from your model
            'work_types_list' => $this->work_types_list,
            'languages_list' => $this->languages_list,
            'salary_range' => $this->salary_range,
            'is_active' => $this->is_active,
            'is_filled' => $this->is_filled,
            'is_expired' => $this->is_expired,
            'is_draft' => $this->is_draft,
            'benefits_list' => $this->benefits_list,
            'applications_count' => $this->applications_count,
            'pending_applications_count' => $this->pending_applications_count,
            'accepted_applications_count' => $this->accepted_applications_count,
            'days_active' => $this->days_active,

            // Relationships
            'employer' => new EmployerResource($this->whenLoaded('employer')),
            'location' => new JobLocationResource($this->whenLoaded('location')),
            'photos' => JobPhotoResource::collection($this->whenLoaded('photos')),
            'bonuses' => JobBonusResource::collection($this->whenLoaded('bonuses')),
            'applications' => JobApplicationResource::collection($this->whenLoaded('applications')),
            'interviews' => JobInterviewScheduleResource::collection($this->whenLoaded('interviews')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
