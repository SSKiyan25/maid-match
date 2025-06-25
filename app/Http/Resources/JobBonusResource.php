<?php

namespace App\Http\Resources;

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
            'is_monetary' => $this->is_monetary,
            'is_benefit' => $this->is_benefit,
            'is_allowance' => $this->is_allowance,
            'is_active' => $this->is_active,
            'is_conditional' => $this->is_conditional,
            'is_recurring' => $this->is_recurring,
            'is_performance_based' => $this->is_performance_based,
            'has_conditions' => $this->has_conditions,
            'display_title' => $this->display_title,
            'yearly_value' => $this->yearly_value,

            // Helper methods
            'is_eligible' => $this->isEligible(),

            // Relationships
            'job_posting' => new JobPostingResource($this->whenLoaded('jobPosting')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}