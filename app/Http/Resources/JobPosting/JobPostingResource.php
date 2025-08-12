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
            'description' => $this->description,
            'work_types' => $this->work_types,
            'provides_toiletries' => $this->provides_toiletries,
            'provides_food' => $this->provides_food,
            'accommodation_type' => $this->accommodation_type,
            'min_salary' => $this->min_salary,
            'max_salary' => $this->max_salary,
            'day_off_preference' => $this->day_off_preference,
            'day_off_type' => $this->day_off_type,
            'language_preferences' => $this->language_preferences,
            'status' => $this->status,
            'is_archived' => $this->is_archived,

            // Computed attributes from your model
            'work_types_list' => $this->work_types_list,
            'languages_list' => $this->when(method_exists($this, 'getLanguagesListAttribute'), $this->languages_list),
            'salary_range' => $this->salary_range,
            'is_active' => $this->is_active,

            // Only include these if they exist as accessors on the model
            'is_filled' => $this->when(method_exists($this, 'getIsFilledAttribute'), $this->is_filled),
            'is_expired' => $this->when(method_exists($this, 'getIsExpiredAttribute'), $this->is_expired),
            'is_draft' => $this->when(method_exists($this, 'getIsDraftAttribute'), $this->is_draft),

            // Only include when available through withCount() or similar
            'applications_count' => $this->when(isset($this->applications_count), $this->applications_count),
            'pending_applications_count' => $this->when(isset($this->pending_applications_count), $this->pending_applications_count),
            'accepted_applications_count' => $this->when(isset($this->accepted_applications_count), $this->accepted_applications_count),

            // Relationships with conditional loading
            'employer' => new EmployerResource($this->whenLoaded('employer')),

            'location' => $this->when($this->relationLoaded('location'), function () {
                return new JobLocationResource($this->location);
            }),

            'photos' => $this->when($this->relationLoaded('photos'), function () {
                return JobPhotoResource::collection($this->photos);
            }),

            'bonuses' => $this->when($this->relationLoaded('bonuses'), function () {
                return JobBonusResource::collection($this->bonuses);
            }),

            'applications' => $this->when($this->relationLoaded('applications'), function () {
                return JobApplicationResource::collection($this->applications);
            }),

            'interviews' => $this->when($this->relationLoaded('interviews'), function () {
                return JobInterviewScheduleResource::collection($this->interviews);
            }),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
