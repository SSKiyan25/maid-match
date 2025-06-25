<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaidResource extends JsonResource
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
            'bio' => $this->bio,
            'skills' => $this->skills,
            'nationality' => $this->nationality,
            'languages' => $this->languages,
            'social_media_links' => $this->social_media_links,
            'marital_status' => $this->marital_status,
            'has_children' => $this->has_children,
            'expected_salary' => $this->expected_salary,
            'is_willing_to_relocate' => $this->is_willing_to_relocate,
            'preferred_accommodation' => $this->preferred_accommodation,
            'earliest_start_date' => $this->earliest_start_date?->toDateString(),
            'years_experience' => $this->years_experience,
            'status' => $this->status,
            'availability_schedule' => $this->availability_schedule,
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
            'verification_badges' => $this->verification_badges,
            'is_verified' => $this->is_verified,
            'is_archived' => $this->is_archived,

            // Computed attributes from the model
            'experience_level' => $this->experience_level,
            'is_available' => $this->is_available,
            'is_employed' => $this->is_employed,
            'verification_level' => $this->verification_level,
            'full_name' => $this->full_name,
            'skills_list' => $this->skills_list,
            'languages_list' => $this->languages_list,
            'is_available_for_immediate_start' => $this->is_available_for_immediate_start,

            // Relationships
            'user' => new UserResource($this->whenLoaded('user')),
            'documents' => MaidDocumentResource::collection($this->whenLoaded('documents')),
            'character_references' => MaidCharacterReferenceResource::collection($this->whenLoaded('characterReferences')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}