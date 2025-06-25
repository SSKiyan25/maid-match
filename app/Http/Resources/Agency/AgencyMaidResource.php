<?php

namespace App\Http\Resources\Agency;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Maid\MaidResource;

class AgencyMaidResource extends JsonResource
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
            'maid_id' => $this->maid_id,

            // Agency-specific maid data
            'status' => $this->status,
            'is_premium' => $this->is_premium,
            'is_trained' => $this->is_trained,
            'agency_notes' => $this->agency_notes,
            'agency_fee' => $this->agency_fee,

            // Timestamps
            'assigned_at' => $this->assigned_at?->toISOString(),
            'status_changed_at' => $this->status_changed_at?->toISOString(),

            // Computed attributes from the model
            'status_label' => $this->status_label,
            'formatted_agency_fee' => $this->formatted_agency_fee,
            'badges' => $this->badges,

            // Relationships
            'agency' => new AgencyResource($this->whenLoaded('agency')),
            'maid' => new MaidResource($this->whenLoaded('maid')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
