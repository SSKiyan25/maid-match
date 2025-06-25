<?php

namespace App\Models\Maid;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaidCharacterReference extends Model
{
    use HasFactory;

    protected $fillable = [
        'maid_id',
        'name',
        'contact_number',
        'social_media_url',
        'verify_status',
        'relationship',
        'notes',
        'verified_at',
        'is_archived',
    ];

    protected $casts = [
        'social_media_url' => 'array',
        'verified_at' => 'datetime',
        'is_archived' => 'boolean',
    ];

    const VERIFY_STATUSES = [
        'pending' => 'Pending Verification',
        'verified' => 'Verified',
        'failed' => 'Verification Failed',
        'not_contacted' => 'Not Contacted',
    ];

    const RELATIONSHIP_TYPES = [
        'former_employer' => 'Former Employer',
        'family_friend' => 'Family Friend',
        'neighbor' => 'Neighbor',
        'colleague' => 'Colleague',
        'community_leader' => 'Community Leader',
        'religious_leader' => 'Religious Leader',
        'teacher' => 'Teacher/Instructor',
        'relative' => 'Relative',
        'other' => 'Other',
    ];

    /**
     * Relationships
     */
    public function maid(): BelongsTo
    {
        return $this->belongsTo(Maid::class);
    }

    /**
     * Scopes
     */
    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeVerified($query)
    {
        return $query->where('verify_status', 'verified');
    }

    /**
     * Accessors
     */
    public function getVerifyStatusLabelAttribute()
    {
        return self::VERIFY_STATUSES[$this->verify_status] ?? ucfirst($this->verify_status);
    }

    public function getRelationshipLabelAttribute()
    {
        return self::RELATIONSHIP_TYPES[$this->relationship] ?? ucfirst(str_replace('_', ' ', $this->relationship));
    }
}
