<?php

namespace App\Http\Resources\Maid;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaidDocumentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'url' => $this->url,
            'description' => $this->description,
            'is_archived' => $this->is_archived,

            // Simple computed attributes
            'type_label' => $this->type_label,

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
