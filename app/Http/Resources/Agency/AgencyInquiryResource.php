<?php

namespace App\Http\Resources\Agency;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\Employer\EmployerResource;
use App\Http\Resources\Maid\MaidResource;
use App\Http\Resources\JobPosting\JobPostingResource;

class AgencyInquiryResource extends JsonResource
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
            'employer_id' => $this->employer_id,
            'job_posting_id' => $this->job_posting_id,
            'maid_id' => $this->maid_id,

            // Inquiry Details
            'type' => $this->type,
            'subject' => $this->subject,
            'message' => $this->message,
            'agency_response' => $this->agency_response,

            // Status & Tracking
            'status' => $this->status,
            'quoted_fee' => $this->quoted_fee,
            'pricing_details' => $this->pricing_details,

            // Communication
            'employer_contact_preference' => $this->employer_contact_preference,
            'urgent' => $this->urgent,
            'responded_at' => $this->responded_at?->toISOString(),
            'closed_at' => $this->closed_at?->toISOString(),

            // Computed attributes from the model
            'type_label' => $this->type_label,
            'status_label' => $this->status_label,
            'formatted_quoted_fee' => $this->formatted_quoted_fee,

            // Relationships
            'agency' => new AgencyResource($this->whenLoaded('agency')),
            'employer' => new EmployerResource($this->whenLoaded('employer')),
            'job_posting' => new JobPostingResource($this->whenLoaded('jobPosting')),
            'maid' => new MaidResource($this->whenLoaded('maid')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
