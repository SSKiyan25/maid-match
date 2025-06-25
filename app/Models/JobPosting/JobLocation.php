<?php

namespace App\Models\JobPosting;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobLocation extends Model
{
    use HasFactory;

    protected $table = 'job_location';

    protected $fillable = [
        'job_posting_id',
        'brgy',
        'city',
        'province',
        'postal_code',
        'landmark',
        'directions',
        'latitude',
        'longitude',
        'is_hidden',
        'is_archived',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_hidden' => 'boolean',
        'is_archived' => 'boolean',
    ];

    /**
     * Relationships
     */
    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class, 'job_posting_id');
    }

    /**
     * Basic Scopes
     */
    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeNotHidden($query)
    {
        return $query->where('is_hidden', false);
    }

    /**
     * Simple Accessors
     */
    public function getFullAddressAttribute()
    {
        $parts = array_filter([
            $this->brgy ? "Brgy. {$this->brgy}" : null,
            $this->city,
            $this->province,
        ]);

        return implode(', ', $parts);
    }

    public function getDisplayAddressAttribute()
    {
        if ($this->is_hidden) {
            return "{$this->city}" . ($this->province ? ", {$this->province}" : "");
        }

        return $this->full_address;
    }
}
