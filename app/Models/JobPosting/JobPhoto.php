<?php

namespace App\Models\JobPosting;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_posting_id',
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
    const PHOTO_TYPES = [
        'interior'  => 'Interior',
        'exterior'  => 'Exterior',
        'room'      => 'Room/Workspace',
        'kitchen'   => 'Kitchen',
        'bathroom'  => 'Bathroom',
        'garden'    => 'Garden/Outdoor',
        'general'   => 'General',
    ];

    /**
     * Relationships
     */
    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class, 'job_posting_id');
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

    public function scopeOrdered($query)
    {
        return $query->orderBy('is_primary', 'desc')
            ->orderBy('sort_order', 'asc');
    }

    /**
     * Accessor
     */
    public function getTypeLabelAttribute()
    {
        return self::PHOTO_TYPES[$this->type] ?? ucfirst($this->type);
    }
}
