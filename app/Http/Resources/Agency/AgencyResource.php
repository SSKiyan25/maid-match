<?php

namespace App\Http\Resources\Agency;

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'user' => $this->whenLoaded('user', function () {
                return new UserResource($this->user);
            }),
            'name' => $this->name,
            'license_number' => $this->license_number,
            'license_photo_front' => $this->license_photo_front,
            'license_photo_back' => $this->license_photo_back,
            'description' => $this->description,
            'established_at' => $this->established_at,
            'business_email' => $this->business_email,
            'business_phone' => $this->business_phone,
            'contact_person' => $this->contact_person,
            'address' => $this->address,
            'formatted_address' => $this->when($this->address, function () {
                $parts = [];
                if (!empty($this->address['barangay'])) $parts[] = $this->address['barangay'];
                if (!empty($this->address['city'])) $parts[] = $this->address['city'];
                if (!empty($this->address['province'])) $parts[] = $this->address['province'];
                return implode(', ', $parts);
            }),
            'website' => $this->website,
            'facebook_page' => $this->facebook_page,
            'placement_fee' => $this->when($this->show_fee_publicly, $this->placement_fee),
            'show_fee_publicly' => $this->show_fee_publicly,
            'status' => $this->status,
            'is_premium' => $this->is_premium,
            'premium_at' => $this->premium_at,
            'premium_expires_at' => $this->premium_expires_at,
            'is_verified' => $this->is_verified,
            'verified_at' => $this->verified_at,
            'is_archived' => $this->is_archived,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Include the main photo when photos are loaded
            'main_photo' => $this->whenLoaded('photos', function () {
                $primaryPhoto = $this->photos->firstWhere('is_primary', true)
                    ?? $this->photos->first();

                return $primaryPhoto ? "/storage/{$primaryPhoto->url}" : null;
            }),

            // Statistics when available
            'maids_count' => $this->when(isset($this->maids_count), function () {
                return $this->maids_count ?? 0;
            }),
        ];
    }
}
