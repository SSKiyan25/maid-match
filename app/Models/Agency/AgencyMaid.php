<?php

namespace App\Models\Agency;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Maid\Maid;

class AgencyMaid extends Model
{
    use HasFactory;

    protected $fillable = [
        'agency_id',
        'maid_id',
        'status',
        'is_premium',
        'is_trained',
        'agency_notes',
        'agency_fee',
        'assigned_at',
        'status_changed_at',
        'is_archived',
    ];

    protected $casts = [
        'is_premium' => 'boolean',
        'is_trained' => 'boolean',
        'agency_fee' => 'decimal:2',
        'assigned_at' => 'datetime',
        'status_changed_at' => 'datetime',
        'is_archived' => 'boolean',
    ];

    /**
     * Agency maid statuses
     */
    const STATUSES = [
        'active' => 'Active',
        'inactive' => 'Inactive',
        'hired' => 'Hired',
        'not_available' => 'Not Available',
    ];

    /**
     * Relationships
     */
    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function maid(): BelongsTo
    {
        return $this->belongsTo(Maid::class, 'maid_id');
    }

    /**
     * Scopes
     */
    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeAvailable($query)
    {
        return $query->whereIn('status', ['active', 'inactive']);
    }

    public function scopePremium($query)
    {
        return $query->where('is_premium', true);
    }

    public function scopeTrained($query)
    {
        return $query->where('is_trained', true);
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute()
    {
        return self::STATUSES[$this->status] ?? ucfirst($this->status);
    }

    public function getFormattedAgencyFeeAttribute()
    {
        if (!$this->agency_fee) return 'Standard rate';
        return '₱' . number_format($this->agency_fee, 2);
    }

    public function getBadgesAttribute()
    {
        $badges = [];

        if ($this->is_premium) {
            $badges[] = 'Premium';
        }

        if ($this->is_trained) {
            $badges[] = 'Trained';
        }

        return $badges;
    }

    /**
     * Helper Methods
     */
    public function markAsHired()
    {
        $this->update([
            'status' => 'hired',
            'status_changed_at' => now(),
        ]);
    }

    public function markAsActive()
    {
        $this->update([
            'status' => 'active',
            'status_changed_at' => now(),
        ]);
    }

    public function markAsNotAvailable()
    {
        $this->update([
            'status' => 'not_available',
            'status_changed_at' => now(),
        ]);
    }

    public function markAsPremium()
    {
        $this->update(['is_premium' => true]);
    }

    public function markAsTrained()
    {
        $this->update(['is_trained' => true]);
    }

    public function updateAgencyFee($fee)
    {
        $this->update([
            'agency_fee' => $fee,
            'status_changed_at' => now(),
        ]);
    }

    public function addNotes($notes)
    {
        $this->update(['agency_notes' => $notes]);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    public function unarchive()
    {
        $this->update(['is_archived' => false]);
    }
}
