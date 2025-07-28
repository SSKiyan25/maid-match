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
            'website' => $this->website,
            'facebook_page' => $this->facebook_page,
            'placement_fee' => $this->placement_fee,
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
        ];
    }
}
