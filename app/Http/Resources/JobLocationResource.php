<?php

namespace App\Http\Resources;

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

            // Computed attributes from the model
            'full_address' => $this->full_address,
            'display_address' => $this->display_address,
            'short_address' => $this->short_address,
            'has_coordinates' => $this->has_coordinates,
            'has_landmark' => $this->has_landmark,
            'map_url' => $this->map_url,
            'directions_url' => $this->directions_url,

            // Relationships
            'job_posting' => new JobPostingResource($this->whenLoaded('jobPosting')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}