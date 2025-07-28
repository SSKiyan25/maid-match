<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Log::info('Profile:', ['profile' => $this->profile]);
        return [
            'id' => $this->id,
            'email' => $this->email,
            'role' => $this->role,
            'status' => $this->status,
            'avatar' => $this->avatar,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'employer' => $this->whenLoaded('employer'),
            'maid' => $this->whenLoaded('maid'),
            'full_name' => $this->full_name,
            'name' => $this->profile?->full_name ?? '', // This will be "First Last"
            'profile' => $this->profile ? new \App\Http\Resources\ProfileResource($this->profile) : null,
            'test_field' => 'test_value',
        ];
    }
}
