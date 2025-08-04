<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserReportResource extends JsonResource
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
            'reporter_id' => $this->reporter_id,
            'reporter' => new UserResource($this->whenLoaded('reporter')),
            'reported_user_id' => $this->reported_user_id,
            'reported_user' => new UserResource($this->whenLoaded('reportedUser')),
            'report_type' => $this->report_type,
            'description' => $this->description,
            'evidence_photo' => $this->evidence_photo,
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'handled_by' => $this->handled_by,
            'handler' => new UserResource($this->whenLoaded('handler')),
            'resolved_at' => $this->resolved_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
