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
        'monetary'      => 'Monetary Bonus',
        '13th_month'    => '13th Month Pay',
        'performance'   => 'Performance Bonus',
        'holiday'       => 'Holiday Bonus',
        'loyalty'       => 'Loyalty Bonus',
        'completion'    => 'Task Completion Bonus',
        'referral'      => 'Referral Bonus',
        'overtime'      => 'Overtime Pay',
        'other'         => 'Other',
    ];

    /**
     * Bonus frequencies
     */
    const FREQUENCIES = [
        'one_time' => 'One Time',
        'weekly' => 'Weekly',
        'monthly' => 'Monthly',
        'quarterly' => 'Quarterly',
        'yearly' => 'Yearly',
        'upon_completion' => 'Upon Completion',
        'performance_based' => 'Performance Based',
    ];

    /**
     * Bonus statuses
     */
    const STATUSES = [
        'active' => 'Active',
        'pending' => 'Pending',
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
