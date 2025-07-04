<?php

namespace App\Http\Resources\JobPosting;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobBonusResource extends JsonResource
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
            'title' => $this->title,
            'amount' => $this->amount,
            'status' => $this->status,
            'description' => $this->description,
            'type' => $this->type,
            'frequency' => $this->frequency,
            'conditions' => $this->conditions,
            'is_archived' => $this->is_archived,

            // Computed attributes from the model
            'type_label' => $this->type_label,
            'frequency_label' => $this->frequency_label,
            'status_label' => $this->status_label,
            'formatted_amount' => $this->formatted_amount,

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
