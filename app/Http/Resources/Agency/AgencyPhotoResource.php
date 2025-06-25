<?php

namespace App\Http\Resources\Agency;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgencyPhotoResource extends JsonResource
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
            'agency_id' => $this->agency_id,

            // Photo data
            'url' => $this->url,
            'caption' => $this->caption,
            'type' => $this->type,
            'sort_order' => $this->sort_order,
            'is_primary' => $this->is_primary,

            // Computed attributes from the model
            'type_label' => $this->type_label,
            'display_caption' => $this->display_caption,

            // Relationships
            'agency' => new AgencyResource($this->whenLoaded('agency')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
