<?php

namespace App\Models\JobPosting;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Maid\Maid;

class JobApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_posting_id',
        'maid_id',
        'status',
        'ranking_position',
        'employer_notes',
        'description',
        'proposed_salary',
        'applied_at',
        'reviewed_at',
        'is_archived',
    ];

    protected $casts = [
        'proposed_salary' => 'decimal:2',
        'applied_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'ranking_position' => 'integer',
        'is_archived' => 'boolean',
    ];

    /**
     * Application statuses
     */
    const STATUSES = [
        'pending' => 'Pending Review',
        'reviewed' => 'Reviewed',
        'shortlisted' => 'Shortlisted',
        'rejected' => 'Rejected',
        'accepted' => 'Accepted',
        'withdrawn' => 'Withdrawn',
    ];

    /**
     * Relationships
     */
    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class, 'job_posting_id');
    }

    public function maid(): BelongsTo
    {
        return $this->belongsTo(Maid::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(JobInterviewSchedule::class, 'job_application_id');
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
        return $query->whereNotIn('status', ['rejected', 'withdrawn']);
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute()
    {
        return self::STATUSES[$this->status] ?? ucfirst($this->status);
    }

    public function getFormattedProposedSalaryAttribute()
    {
        if (!$this->proposed_salary) return 'Not specified';
        return '₱' . number_format($this->proposed_salary, 2);
    }
}
