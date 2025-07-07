<?php

namespace App\Models\Agency;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\User;
use App\Models\Maid\Maid;

class Agency extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'license_number',
        'license_photo_front',
        'license_photo_back',
        'description',
        'established_at',
        'business_email',
        'business_phone',
        'contact_person',
        'address',
        'website',
        'facebook_page',
        'placement_fee',
        'show_fee_publicly',
        'status',
        'is_premium',
        'premium_at',
        'premium_expires_at',
        'is_verified',
        'verified_at',
        'is_archived',
    ];

    protected $casts = [
        'address' => 'array',
        'placement_fee' => 'decimal:2',
        'show_fee_publicly' => 'boolean',
        'is_premium' => 'boolean',
        'premium_at' => 'datetime',
        'premium_expires_at' => 'datetime',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
        'is_archived' => 'boolean',
        'contact_person' => 'array',
        'established_at' => 'datetime',
    ];

    /**
     * Agency statuses
     */
    const STATUSES = [
        'active' => 'Active',
        'inactive' => 'Inactive',
        'suspended' => 'Suspended',
        'pending_verification' => 'Pending Verification',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function maids(): BelongsToMany
    {
        return $this->belongsToMany(Maid::class, 'agency_maids')
            ->withPivot(['status', 'is_premium', 'is_trained', 'agency_notes', 'agency_fee', 'assigned_at', 'status_changed_at'])
            ->withTimestamps()
            ->wherePivot('is_archived', false);
    }

    public function agencyMaids(): HasMany
    {
        return $this->hasMany(AgencyMaid::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(AgencyPhoto::class);
    }

    public function settings(): HasOne
    {
        return $this->hasOne(AgencySetting::class);
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(AgencyInquiry::class);
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopePendingVerification($query)
    {
        return $query->where('status', 'pending_verification');
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute()
    {
        return self::STATUSES[$this->status] ?? ucfirst($this->status);
    }

    public function getFormattedPlacementFeeAttribute()
    {
        if (!$this->placement_fee) return 'Contact for pricing';
        return '₱' . number_format($this->placement_fee, 2);
    }

    public function getDisplayEmailAttribute()
    {
        return $this->business_email ?: $this->user->email;
    }

    /**
     * Helper Methods
     */
    public function verify()
    {
        $this->update([
            'is_verified' => true,
            'verified_at' => now(),
            'status' => 'active',
        ]);
    }

    public function suspend()
    {
        $this->update(['status' => 'suspended']);
    }

    public function activate()
    {
        $this->update(['status' => 'active']);
    }

    public function deactivate()
    {
        $this->update(['status' => 'inactive']);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    public function getActiveMaidsCount()
    {
        return $this->agencyMaids()->where('status', 'active')->count();
    }

    public function getHiredMaidsCount()
    {
        return $this->agencyMaids()->where('status', 'hired')->count();
    }

    public function getPendingInquiriesCount()
    {
        return $this->inquiries()->where('status', 'pending')->count();
    }

    public function getFormattedAddressAttribute(): string
    {
        if (!$this->address) {
            return '';
        }

        $parts = array_filter([
            $this->address['street'] ?? '',
            $this->address['barangay'] ?? '',
            $this->address['city'] ?? '',
            $this->address['province'] ?? '',
        ]);

        return implode(', ', $parts);
    }
}
