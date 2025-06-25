<?php

namespace App\Http\Resources\Agency;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\Maid\MaidResource;

class AgencyResource extends JsonResource
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
            'user_id' => $this->user_id,

            // Business Information
            'name' => $this->name,
            'license_number' => $this->license_number,
            'description' => $this->description,
            'contact_person' => $this->contact_person,
            'phone_number' => $this->phone_number,
            'business_email' => $this->business_email,

            // Location
            'address' => $this->address,
            'city' => $this->city,
            'province' => $this->province,

            // Business Model
            'placement_fee' => $this->placement_fee,
            'show_fee_publicly' => $this->show_fee_publicly,

            // Status & Verification
            'status' => $this->status,
            'is_verified' => $this->is_verified,
            'verified_at' => $this->verified_at?->toISOString(),

            // Computed attributes from the model
            'status_label' => $this->status_label,
            'formatted_placement_fee' => $this->formatted_placement_fee,
            'display_email' => $this->display_email,
            'full_address' => $this->full_address,

            // Business Metrics (only computed, no DB queries)
            'active_maids_count' => $this->when(
                $request->routeIs('agencies.show') || $request->has('include_stats'),
                fn() => $this->getActiveMaidsCount()
            ),
            'hired_maids_count' => $this->when(
                $request->routeIs('agencies.show') || $request->has('include_stats'),
                fn() => $this->getHiredMaidsCount()
            ),
            'pending_inquiries_count' => $this->when(
                $request->routeIs('agencies.show') || $request->has('include_stats'),
                fn() => $this->getPendingInquiriesCount()
            ),

            // Primary photo for listings
            'primary_photo_url' => $this->when(
                $this->relationLoaded('photos'),
                fn() => $this->primary_photo?->url
            ),

            // Relationships
            'user' => new UserResource($this->whenLoaded('user')),
            'maids' => MaidResource::collection($this->whenLoaded('maids')),
            'agency_maids' => AgencyMaidResource::collection($this->whenLoaded('agencyMaids')),
            'photos' => AgencyPhotoResource::collection($this->whenLoaded('photos')),
            'settings' => new AgencySettingResource($this->whenLoaded('settings')),
            'inquiries' => AgencyInquiryResource::collection($this->whenLoaded('inquiries')),

            // Timestamps
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
