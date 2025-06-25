<?php

namespace App\Models\JobPosting;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobBonus extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_posting_id',
        'title',
        'amount',
        'status',
        'description',
        'type',
        'frequency',
        'conditions',
        'is_archived',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_archived' => 'boolean',
    ];

    /**
     * Common bonus types
     */
    const BONUS_TYPES = [
        'monetary' => 'Monetary Bonus',
        'benefit' => 'Benefit/Perk',
        'allowance' => 'Allowance',
    ];

    /**
     * Bonus frequencies
     */
    const FREQUENCIES = [
        'one_time' => 'One Time',
        'monthly' => 'Monthly',
        'quarterly' => 'Quarterly',
        'yearly' => 'Yearly',
        'performance_based' => 'Performance Based',
    ];

    /**
     * Bonus statuses
     */
    const STATUSES = [
        'active' => 'Active',
        'inactive' => 'Inactive',
        'conditional' => 'Conditional',
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

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Simple Accessors
     */
    public function getTypeLabelAttribute()
    {
        return self::BONUS_TYPES[$this->type] ?? ucfirst($this->type);
    }

    public function getFrequencyLabelAttribute()
    {
        return self::FREQUENCIES[$this->frequency] ?? ucfirst(str_replace('_', ' ', $this->frequency));
    }

    public function getStatusLabelAttribute()
    {
        return self::STATUSES[$this->status] ?? ucfirst($this->status);
    }

    public function getFormattedAmountAttribute()
    {
        if (!$this->amount) return 'N/A';
        return '₱' . number_format($this->amount, 2);
    }
}
