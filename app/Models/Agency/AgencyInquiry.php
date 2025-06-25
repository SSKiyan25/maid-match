<?php

namespace App\Models\Agency;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Employer\Employer;
use App\Models\Maid\Maid;
use App\Models\JobPosting\JobPosting;

class AgencyInquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'agency_id',
        'employer_id',
        'job_posting_id',
        'maid_id',
        'type',
        'subject',
        'message',
        'agency_response',
        'status',
        'quoted_fee',
        'pricing_details',
        'employer_contact_preference',
        'urgent',
        'responded_at',
        'closed_at',
        'is_archived',
    ];

    protected $casts = [
        'quoted_fee' => 'decimal:2',
        'urgent' => 'boolean',
        'responded_at' => 'datetime',
        'closed_at' => 'datetime',
        'is_archived' => 'boolean',
    ];

    /**
     * Inquiry types
     */
    const TYPES = [
        'general' => 'General Inquiry',
        'specific_maid' => 'Specific Maid',
        'specific_job' => 'Specific Job',
        'pricing' => 'Pricing Request',
        'replacement' => 'Replacement Request',
    ];

    /**
     * Inquiry statuses
     */
    const STATUSES = [
        'pending' => 'Pending',
        'responded' => 'Responded',
        'closed' => 'Closed',
        'archived' => 'Archived',
    ];

    /**
     * Relationships
     */
    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function employer(): BelongsTo
    {
        return $this->belongsTo(Employer::class);
    }

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class, 'job_posting_id');
    }

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

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeUrgent($query)
    {
        return $query->where('urgent', true);
    }

    /**
     * Accessors
     */
    public function getTypeLabelAttribute()
    {
        return self::TYPES[$this->type] ?? ucfirst($this->type);
    }

    public function getStatusLabelAttribute()
    {
        return self::STATUSES[$this->status] ?? ucfirst($this->status);
    }

    public function getFormattedQuotedFeeAttribute()
    {
        if (!$this->quoted_fee) return 'Not specified';
        return '₱' . number_format($this->quoted_fee, 2);
    }

    /**
     * Helper Methods
     */
    public function markAsResponded()
    {
        $this->update([
            'status' => 'responded',
            'responded_at' => now(),
        ]);
    }

    public function close()
    {
        $this->update([
            'status' => 'closed',
            'closed_at' => now(),
        ]);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }
}
