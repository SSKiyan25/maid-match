<?php

namespace App\Http\Resources\JobPosting;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobLocationResource extends JsonResource
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
            'brgy' => $this->brgy,
            'city' => $this->city,
            'province' => $this->province,
            'postal_code' => $this->postal_code,
            'landmark' => $this->landmark,
            'directions' => $this->directions,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'is_hidden' => $this->is_hidden,
            'is_archived' => $this->is_archived,

            // Simple computed attributes
            'full_address' => $this->full_address,
            'display_address' => $this->display_address,

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
