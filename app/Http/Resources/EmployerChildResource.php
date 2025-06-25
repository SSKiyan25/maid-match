<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployerChildResource extends JsonResource
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
            'age' => $this->age,
            'photo_url' => $this->photo_url,
            'is_archived' => $this->is_archived,

            // Computed attributes from the model
            'age_group' => $this->age_group,
            'display_name' => $this->display_name,

            // Relationships
            'employer' => new EmployerResource($this->whenLoaded('employer')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
