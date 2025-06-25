<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaidDocumentResource extends JsonResource
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
            'type' => $this->type,
            'title' => $this->title,
            'url' => $this->url,
            'description' => $this->description,
            'is_archived' => $this->is_archived,

            // Computed attributes from the model
            'type_label' => $this->type_label,
            'file_name' => $this->file_name,
            'file_extension' => $this->file_extension,
            'file_size' => $this->file_size,
            'file_size_human' => $this->file_size_human,
            'is_image' => $this->is_image,
            'is_pdf' => $this->is_pdf,
            'is_required' => $this->is_required,
            'download_url' => $this->download_url,
            'view_url' => $this->view_url,

            // Helper methods
            'is_viewable' => $this->isViewable(),
            'is_valid' => $this->isValid(),
            'exists' => $this->exists(),

            // Relationships
            'maid' => new MaidResource($this->whenLoaded('maid')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}