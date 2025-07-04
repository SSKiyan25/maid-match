<?php

namespace App\Http\Resources\Maid;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaidCharacterReferenceResource extends JsonResource
{
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

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
