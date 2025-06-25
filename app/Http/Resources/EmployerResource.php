<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployerResource extends JsonResource
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
            'user_id' => $this->user_id,
            'household_description' => $this->household_description,
            'family_size' => $this->family_size,
            'status' => $this->status,
            'maid_preferences' => $this->maid_preferences,
            'is_verified' => $this->is_verified,
            'is_archived' => $this->is_archived,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Computed attributes
            'is_looking' => $this->is_looking,
            'is_active' => $this->is_active,
            'has_children' => $this->when($this->relationLoaded('children'), fn() => $this->hasChildren()),
            'has_pets' => $this->when($this->relationLoaded('pets'), fn() => $this->hasPets()),
            'active_job_postings_count' => $this->when(
                $this->relationLoaded('jobPostings'),
                fn() => $this->getActiveJobPostingsCount()
            ),

            // Relationships
            'user' => new UserResource($this->whenLoaded('user')),
            'children' => EmployerChildResource::collection($this->whenLoaded('children')),
            'pets' => EmployerPetResource::collection($this->whenLoaded('pets')),
            'bookmarked_maids' => MaidResource::collection($this->whenLoaded('bookmarkedMaids')),
            'job_postings' => JobPostingResource::collection($this->whenLoaded('jobPostings')),
            'job_applications' => JobApplicationResource::collection($this->whenLoaded('jobApplications')),
            'interviews' => JobInterviewScheduleResource::collection($this->whenLoaded('interviews')),

            // Conditional data for different contexts
            'profile' => $this->when(
                $this->relationLoaded('user') && $this->user->relationLoaded('profile'),
                fn() => $this->user->profile
            ),

            // Statistics (only when specifically requested)
            'stats' => $this->when($request->get('include_stats'), [
                'total_job_postings' => $this->whenCounted('jobPostings'),
                'total_applications_received' => $this->whenCounted('jobApplications'),
                'total_interviews_scheduled' => $this->whenCounted('interviews'),
                'total_bookmarked_maids' => $this->whenCounted('bookmarkedMaids'),
            ]),
        ];
    }

    /**
     * Get additional data that should be returned with the resource array.
     *
     * @return array<string, mixed>
     */
    public function with(Request $request): array
    {
        return [
            'meta' => [
                'status_options' => ['active', 'inactive', 'looking', 'fulfilled'],
                'family_size_label' => $this->family_size === 1 ? 'person' : 'people',
            ],
        ];
    }
}