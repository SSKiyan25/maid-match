<?php

namespace App\Http\Resources\Agency;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class AgencyCreditResource extends JsonResource
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
            'amount' => $this->amount,
            'type' => $this->type,
            'description' => $this->description,
            'friendly_description' => $this->friendly_description ?? $this->description,
            'links' => $this->links ?? null,
            'expires_at' => $this->formatDate($this->expires_at),
            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),
        ];
    }

    private function formatDate($value)
    {
        if (!$value) {
            return null;
        }
        $date = $value instanceof \Carbon\Carbon ? $value : \Carbon\Carbon::parse($value);
        return $date->toISOString();
    }
}
