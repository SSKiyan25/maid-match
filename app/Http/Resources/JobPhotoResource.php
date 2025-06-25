<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobPhotoResource extends JsonResource
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
            'url' => $this->url,
            'caption' => $this->caption,
            'type' => $this->type,
            'sort_order' => $this->sort_order,
            'is_primary' => $this->is_primary,
            'is_archived' => $this->is_archived,

            // Computed attributes from the model
            'type_label' => $this->type_label,
            'file_name' => $this->file_name,
            'file_extension' => $this->file_extension,
            'file_size' => $this->file_size,
            'file_size_human' => $this->file_size_human,
            'full_url' => $this->full_url,
            'thumbnail_url' => $this->thumbnail_url,
            'display_caption' => $this->display_caption,
            'is_valid' => $this->is_valid,

            // Helper methods
            'exists' => $this->exists(),

            // Relationships
            'job_posting' => new JobPostingResource($this->whenLoaded('jobPosting')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}