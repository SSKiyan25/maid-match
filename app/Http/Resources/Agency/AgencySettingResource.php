<?php

namespace App\Http\Resources\Agency;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AgencySettingResource extends JsonResource
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

            // Fee Display Settings
            'show_fees_publicly' => $this->show_fees_publicly,
            'allow_fee_negotiation' => $this->allow_fee_negotiation,

            // Branding Settings
            'brand_color' => $this->brand_color,
            'brand_tagline' => $this->brand_tagline,
            'show_agency_branding_on_maids' => $this->show_agency_branding_on_maids,

            // Business Preferences
            'preferred_work_types' => $this->preferred_work_types,
            'service_areas' => $this->service_areas,
            'accept_direct_inquiries' => $this->accept_direct_inquiries,

            // Notification Preferences
            'notify_new_job_postings' => $this->notify_new_job_postings,
            'notify_maid_applications' => $this->notify_maid_applications,
            'notify_employer_inquiries' => $this->notify_employer_inquiries,

            // Training & Certification
            'training_programs' => $this->training_programs,
            'certifications' => $this->certifications,
            'highlight_training' => $this->highlight_training,

            // Replacement Policy
            'replacement_guarantee_days' => $this->replacement_guarantee_days,
            'replacement_policy' => $this->replacement_policy,

            // Computed attributes from the model
            'preferred_work_types_labels' => $this->preferred_work_types_labels,
            'service_areas_labels' => $this->service_areas_labels,
            'replacement_guarantee_label' => $this->replacement_guarantee_label,

            // Relationships
            'agency' => new AgencyResource($this->whenLoaded('agency')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
