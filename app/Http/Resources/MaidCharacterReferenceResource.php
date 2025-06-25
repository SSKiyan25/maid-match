<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaidCharacterReferenceResource extends JsonResource
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
            'name' => $this->name,
            'contact_number' => $this->contact_number,
            'social_media_url' => $this->social_media_url,
            'verify_status' => $this->verify_status,
            'relationship' => $this->relationship,
            'notes' => $this->notes,
            'verified_at' => $this->verified_at?->toISOString(),
            'is_archived' => $this->is_archived,

            // Computed attributes from the model
            'verify_status_label' => $this->verify_status_label,
            'relationship_label' => $this->relationship_label,
            'is_verified' => $this->is_verified,
            'is_pending' => $this->is_pending,
            'is_failed' => $this->is_failed,
            'is_not_contacted' => $this->is_not_contacted,
            'contact_methods' => $this->contact_methods,
            'formatted_contact_number' => $this->formatted_contact_number,
            'verified_days_ago' => $this->verified_days_ago,
            'display_name' => $this->display_name,

            // Helper methods
            'can_be_contacted' => $this->canBeContacted(),
            'is_recently_verified' => $this->isRecentlyVerified(),

            // Relationships
            'maid' => new MaidResource($this->whenLoaded('maid')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}