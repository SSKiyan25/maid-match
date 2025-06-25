<?php

namespace App\Models\Agency;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgencyPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'agency_id',
        'url',
        'caption',
        'type',
        'sort_order',
        'is_primary',
        'is_archived',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_primary' => 'boolean',
        'is_archived' => 'boolean',
    ];

    /**
     * Photo types
     */
    const TYPES = [
        'logo' => 'Logo',
        'office' => 'Office Photo',
        'team' => 'Team Photo',
        'certificate' => 'Certificate',
        'other' => 'Other',
    ];

    /**
     * Relationships
     */
    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    /**
     * Scopes
     */
    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at');
    }

    /**
     * Accessors
     */
    public function getTypeLabelAttribute()
    {
        return self::TYPES[$this->type] ?? ucfirst($this->type);
    }

    public function getDisplayCaptionAttribute()
    {
        return $this->caption ?: $this->type_label;
    }

    /**
     * Helper Methods
     */
    public function markAsPrimary()
    {
        // Remove primary flag from other photos of same agency
        static::where('agency_id', $this->agency_id)
            ->where('id', '!=', $this->id)
            ->update(['is_primary' => false]);

        // Set this photo as primary
        $this->update(['is_primary' => true]);
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
