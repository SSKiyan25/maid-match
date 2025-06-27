<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'full_name' => $this->full_name, // Uses the accessor from the model
            'phone_number' => $this->when(
                !$this->is_phone_private,
                $this->phone_number
            ),
            'is_phone_private' => $this->is_phone_private,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'address' => $this->when(
                !$this->is_address_private,
                $this->address
            ),
            'formatted_address' => $this->when(
                !$this->is_address_private,
                $this->formatted_address
            ),
            'is_address_private' => $this->is_address_private,
            'preferred_contact_methods' => $this->preferred_contact_methods,
            'preferred_language' => $this->preferred_language,
            'is_archived' => $this->is_archived,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            // Relationships
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }

    /**
     * Check if this is the user's own profile (for privacy settings)
     */
    private function isOwnProfile(Request $request): bool
    {
        return $request->user() && $request->user()->id === $this->user_id;
    }
}
