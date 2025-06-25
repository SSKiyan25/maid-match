<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
     * Status progression order
     */
    const STATUS_PROGRESSION = [
        'pending',
        'reviewed',
        'shortlisted',
        'accepted',
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

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeReviewed($query)
    {
        return $query->where('status', 'reviewed');
    }

    public function scopeShortlisted($query)
    {
        return $query->where('status', 'shortlisted');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeWithdrawn($query)
    {
        return $query->where('status', 'withdrawn');
    }

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', ['rejected', 'withdrawn']);
    }

    public function scopeRecentFirst($query)
    {
        return $query->orderBy('applied_at', 'desc');
    }

    public function scopeByRanking($query)
    {
        return $query->orderBy('ranking_position', 'asc');
    }

    public function scopeForJob($query, $jobPostingId)
    {
        return $query->where('job_posting_id', $jobPostingId);
    }

    public function scopeForMaid($query, $maidId)
    {
        return $query->where('maid_id', $maidId);
    }

    public function scopeAwaitingReview($query)
    {
        return $query->where('status', 'pending')
            ->whereNull('reviewed_at');
    }

    public function scopeRecentlyApplied($query, $days = 7)
    {
        return $query->where('applied_at', '>=', now()->subDays($days));
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute()
    {
        return self::STATUSES[$this->status] ?? ucfirst($this->status);
    }

    public function getIsPendingAttribute()
    {
        return $this->status === 'pending';
    }

    public function getIsReviewedAttribute()
    {
        return $this->status === 'reviewed';
    }

    public function getIsShortlistedAttribute()
    {
        return $this->status === 'shortlisted';
    }

    public function getIsRejectedAttribute()
    {
        return $this->status === 'rejected';
    }

    public function getIsAcceptedAttribute()
    {
        return $this->status === 'accepted';
    }

    public function getIsWithdrawnAttribute()
    {
        return $this->status === 'withdrawn';
    }

    public function getIsActiveAttribute()
    {
        return !in_array($this->status, ['rejected', 'withdrawn']);
    }

    public function getFormattedProposedSalaryAttribute()
    {
        if (!$this->proposed_salary) return 'Not specified';

        return '₱' . number_format($this->proposed_salary, 2);
    }

    public function getDaysAgoAppliedAttribute()
    {
        return $this->applied_at->diffInDays(now());
    }

    public function getDaysAgoReviewedAttribute()
    {
        if (!$this->reviewed_at) return null;

        return $this->reviewed_at->diffInDays(now());
    }

    public function getResponseTimeAttribute()
    {
        if (!$this->reviewed_at) return null;

        return $this->applied_at->diffInDays($this->reviewed_at);
    }

    public function getHasInterviewsAttribute()
    {
        return $this->interviews()->exists();
    }

    public function getUpcomingInterviewAttribute()
    {
        return $this->interviews()
            ->where('scheduled_at', '>', now())
            ->orderBy('scheduled_at', 'asc')
            ->first();
    }

    public function getLatestInterviewAttribute()
    {
        return $this->interviews()
            ->orderBy('scheduled_at', 'desc')
            ->first();
    }

    public function getCanWithdrawAttribute()
    {
        return in_array($this->status, ['pending', 'reviewed', 'shortlisted']);
    }

    public function getCanAdvanceStatusAttribute()
    {
        $currentIndex = array_search($this->status, self::STATUS_PROGRESSION);
        return $currentIndex !== false && $currentIndex < count(self::STATUS_PROGRESSION) - 1;
    }

    public function getNextStatusAttribute()
    {
        $currentIndex = array_search($this->status, self::STATUS_PROGRESSION);
        if ($currentIndex !== false && $currentIndex < count(self::STATUS_PROGRESSION) - 1) {
            return self::STATUS_PROGRESSION[$currentIndex + 1];
        }
        return null;
    }

    public function getSalaryMatchPercentageAttribute()
    {
        $jobSalary = $this->jobPosting->max_salary ?? $this->jobPosting->min_salary;
        if (!$jobSalary || !$this->proposed_salary) return null;

        return round(($this->proposed_salary / $jobSalary) * 100, 1);
    }

    /**
     * Helper Methods
     */
    public function markAsReviewed($notes = null)
    {
        $this->update([
            'status' => 'reviewed',
            'reviewed_at' => now(),
            'employer_notes' => $notes ?? $this->employer_notes,
        ]);
    }

    public function shortlist($notes = null)
    {
        $this->update([
            'status' => 'shortlisted',
            'reviewed_at' => $this->reviewed_at ?? now(),
            'employer_notes' => $notes ?? $this->employer_notes,
        ]);
    }

    public function reject($notes = null)
    {
        $this->update([
            'status' => 'rejected',
            'reviewed_at' => $this->reviewed_at ?? now(),
            'employer_notes' => $notes ?? $this->employer_notes,
        ]);
    }

    public function accept($notes = null)
    {
        // Mark this application as accepted
        $this->update([
            'status' => 'accepted',
            'reviewed_at' => $this->reviewed_at ?? now(),
            'employer_notes' => $notes ?? $this->employer_notes,
        ]);

        // Auto-reject other applications for the same job
        $this->jobPosting->applications()
            ->where('id', '!=', $this->id)
            ->whereNotIn('status', ['rejected', 'withdrawn'])
            ->update([
                'status' => 'rejected',
                'employer_notes' => 'Position filled by another candidate',
                'reviewed_at' => now(),
            ]);

        // Mark job as filled
        $this->jobPosting->markAsFilled();
    }

    public function withdraw()
    {
        $this->update(['status' => 'withdrawn']);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    public function unarchive()
    {
        $this->update(['is_archived' => false]);
    }

    public function setRanking($position)
    {
        $this->update(['ranking_position' => $position]);
    }

    public function addEmployerNotes($notes)
    {
        $existingNotes = $this->employer_notes;
        $timestamp = now()->format('Y-m-d H:i');

        $newNotes = $existingNotes
            ? $existingNotes . "\n\n[{$timestamp}] " . $notes
            : "[{$timestamp}] " . $notes;

        $this->update(['employer_notes' => $newNotes]);
    }

    public function scheduleInterview($scheduledAt, $notes = null, $location = null)
    {
        return $this->interviews()->create([
            'job_posting_id' => $this->job_posting_id,
            'maid_id' => $this->maid_id,
            'scheduled_at' => $scheduledAt,
            'notes' => $notes,
            'location' => $location,
            'status' => 'scheduled',
        ]);
    }

    /**
     * Static Methods
     */
    public static function getStatuses()
    {
        return self::STATUSES;
    }

    public static function getActiveStatuses()
    {
        return ['pending', 'reviewed', 'shortlisted', 'accepted'];
    }

    public static function getApplicationStats(JobPosting $jobPosting)
    {
        $applications = $jobPosting->applications()->notArchived();

        return [
            'total' => $applications->count(),
            'pending' => $applications->pending()->count(),
            'reviewed' => $applications->reviewed()->count(),
            'shortlisted' => $applications->shortlisted()->count(),
            'rejected' => $applications->rejected()->count(),
            'accepted' => $applications->accepted()->count(),
            'withdrawn' => $applications->withdrawn()->count(),
            'awaiting_review' => $applications->awaitingReview()->count(),
        ];
    }

    public static function getMaidApplicationStats(Maid $maid)
    {
        $applications = $maid->jobApplications()->notArchived();

        return [
            'total' => $applications->count(),
            'pending' => $applications->pending()->count(),
            'shortlisted' => $applications->shortlisted()->count(),
            'accepted' => $applications->accepted()->count(),
            'rejected' => $applications->rejected()->count(),
            'success_rate' => $applications->count() > 0
                ? round(($applications->accepted()->count() / $applications->count()) * 100, 1)
                : 0,
        ];
    }

    public static function reorderApplications(JobPosting $jobPosting, array $applicationIds)
    {
        foreach ($applicationIds as $index => $applicationId) {
            $jobPosting->applications()
                ->where('id', $applicationId)
                ->update(['ranking_position' => $index + 1]);
        }
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        // Set applied_at timestamp when creating
        static::creating(function ($application) {
            if (!$application->applied_at) {
                $application->applied_at = now();
            }
        });

        // Auto-set reviewed_at when status changes from pending
        static::updating(function ($application) {
            if (
                $application->isDirty('status') &&
                $application->getOriginal('status') === 'pending' &&
                $application->status !== 'pending' &&
                !$application->reviewed_at
            ) {
                $application->reviewed_at = now();
            }
        });
    }
}