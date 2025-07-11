<?php

namespace App\Http\Resources\Maid;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\Agency\AgencyResource;

class MaidResource extends JsonResource
{
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

            'agency_id' => $this->agency_id,
            'registration_type' => $this->registration_type,
            'agency_assigned_at' => $this->agency_assigned_at?->toISOString(),

            // Computed attributes
            'experience_level' => $this->experience_level,
            'is_available' => $this->is_available,
            'verification_level' => $this->verification_level,
            'full_name' => $this->full_name,
            'is_managed_by_agency' => $this->is_managed_by_agency,
            'agency_name' => $this->agency_name,

            // Relationships
            'user' => new UserResource($this->whenLoaded('user')),
            'agency' => new AgencyResource($this->whenLoaded('agency')),
            'documents' => MaidDocumentResource::collection($this->whenLoaded('documents')),
            'character_references' => MaidCharacterReferenceResource::collection($this->whenLoaded('characterReferences')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
