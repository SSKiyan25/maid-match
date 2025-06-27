<?php

namespace App\Http\Resources\Employer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\Maid\MaidResource;
use App\Http\Resources\JobPosting\JobPostingResource;

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
            'has_children' => $this->has_children,
            'has_pets' => $this->has_pets,
            'status' => $this->status,
            'maid_preferences' => $this->maid_preferences,
            'is_verified' => $this->is_verified,
            'is_archived' => $this->is_archived,

            // Computed attributes
            'is_looking' => $this->is_looking,
            'is_active' => $this->is_active,

            // Relationships
            'user' => new UserResource($this->whenLoaded('user')),
            'children' => EmployerChildResource::collection($this->whenLoaded('children')),
            'pets' => EmployerPetResource::collection($this->whenLoaded('pets')),
            'bookmarked_maids' => MaidResource::collection($this->whenLoaded('bookmarkedMaids')),
            'job_postings' => JobPostingResource::collection($this->whenLoaded('jobPostings')),

            // Timestamps
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
