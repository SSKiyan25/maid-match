<?php

namespace App\Models;

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

    /**
     * Verification statuses
     */
    const VERIFY_STATUSES = [
        'pending' => 'Pending Verification',
        'verified' => 'Verified',
        'failed' => 'Verification Failed',
        'not_contacted' => 'Not Contacted',
    ];

    /**
     * Common relationship types
     */
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

    public function scopePending($query)
    {
        return $query->where('verify_status', 'pending');
    }

    public function scopeFailed($query)
    {
        return $query->where('verify_status', 'failed');
    }

    public function scopeNotContacted($query)
    {
        return $query->where('verify_status', 'not_contacted');
    }

    public function scopeByRelationship($query, $relationship)
    {
        return $query->where('relationship', $relationship);
    }

    public function scopeFormerEmployers($query)
    {
        return $query->where('relationship', 'former_employer');
    }

    public function scopeRecentlyVerified($query, $days = 30)
    {
        return $query->where('verified_at', '>=', now()->subDays($days));
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

    public function getIsVerifiedAttribute()
    {
        return $this->verify_status === 'verified';
    }

    public function getIsPendingAttribute()
    {
        return $this->verify_status === 'pending';
    }

    public function getIsFailedAttribute()
    {
        return $this->verify_status === 'failed';
    }

    public function getIsNotContactedAttribute()
    {
        return $this->verify_status === 'not_contacted';
    }

    public function getContactMethodsAttribute()
    {
        $methods = [];

        if ($this->contact_number) {
            $methods[] = 'phone';
        }

        if (!empty($this->social_media_url)) {
            foreach ($this->social_media_url as $platform => $url) {
                if (!empty($url)) {
                    $methods[] = $platform;
                }
            }
        }

        return $methods;
    }

    public function getFormattedContactNumberAttribute()
    {
        // Format Philippine mobile numbers
        $number = preg_replace('/[^0-9]/', '', $this->contact_number);

        if (strlen($number) === 11 && str_starts_with($number, '09')) {
            return substr($number, 0, 4) . '-' . substr($number, 4, 3) . '-' . substr($number, 7);
        }

        return $this->contact_number;
    }

    public function getVerifiedDaysAgoAttribute()
    {
        if (!$this->verified_at) return null;

        return $this->verified_at->diffInDays(now());
    }

    public function getDisplayNameAttribute()
    {
        $display = $this->name;

        if ($this->relationship) {
            $display .= " ({$this->relationship_label})";
        }

        return $display;
    }

    /**
     * Helper Methods
     */
    public function markAsVerified($notes = null)
    {
        $this->update([
            'verify_status' => 'verified',
            'verified_at' => now(),
            'notes' => $notes ?? $this->notes,
        ]);
    }

    public function markAsFailed($notes = null)
    {
        $this->update([
            'verify_status' => 'failed',
            'notes' => $notes ?? $this->notes,
        ]);
    }

    public function markAsNotContacted($notes = null)
    {
        $this->update([
            'verify_status' => 'not_contacted',
            'notes' => $notes ?? $this->notes,
        ]);
    }

    public function resetToPending()
    {
        $this->update([
            'verify_status' => 'pending',
            'verified_at' => null,
        ]);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    public function unarchive()
    {
        $this->update(['is_archived' => false]);
    }

    public function hasContactMethod($method)
    {
        return in_array($method, $this->contact_methods);
    }

    public function getSocialMediaUrl($platform)
    {
        return $this->social_media_url[$platform] ?? null;
    }

    public function setSocialMediaUrl($platform, $url)
    {
        $socialMedia = $this->social_media_url ?? [];
        $socialMedia[$platform] = $url;
        $this->update(['social_media_url' => $socialMedia]);
    }

    public function canBeContacted()
    {
        return !empty($this->contact_number) || !empty($this->social_media_url);
    }

    public function isRecentlyVerified($days = 30)
    {
        return $this->verified_at && $this->verified_at >= now()->subDays($days);
    }

    /**
     * Static Methods
     */
    public static function getVerifyStatuses()
    {
        return self::VERIFY_STATUSES;
    }

    public static function getRelationshipTypes()
    {
        return self::RELATIONSHIP_TYPES;
    }

    public static function getVerificationStats(Maid $maid)
    {
        $references = $maid->characterReferences()->notArchived();

        return [
            'total' => $references->count(),
            'verified' => $references->verified()->count(),
            'pending' => $references->pending()->count(),
            'failed' => $references->failed()->count(),
            'not_contacted' => $references->notContacted()->count(),
            'verification_rate' => $references->count() > 0
                ? round(($references->verified()->count() / $references->count()) * 100, 1)
                : 0,
        ];
    }

    public static function getRecommendedMinimumReferences()
    {
        return 2; // Minimum recommended character references
    }

    public static function hasMinimumReferences(Maid $maid)
    {
        return $maid->characterReferences()
            ->notArchived()
            ->verified()
            ->count() >= self::getRecommendedMinimumReferences();
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        // Auto-format contact numbers
        static::saving(function ($reference) {
            if ($reference->contact_number) {
                // Remove any non-numeric characters except +
                $reference->contact_number = preg_replace('/[^0-9+]/', '', $reference->contact_number);
            }
        });
    }
}