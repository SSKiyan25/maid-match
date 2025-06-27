<?php

namespace App\Http\Resources\Employer;

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
            'employer_id' => $this->employer_id,
            'name' => $this->name,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'age' => $this->age, // Calculated from birth_date
            'photo_url' => $this->photo_url,
            'is_archived' => $this->is_archived,

            // Computed attributes from the model
            'age_group' => $this->age_group,
            'display_name' => $this->display_name,

            // Timestamps
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),

            // Relationships
            'employer' => $this->whenLoaded('employer'),
        ];
    }
}
