<?php

namespace App\Models\JobPosting;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Maid\Maid;

class JobInterviewSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_posting_id',
        'maid_id',
        'job_application_id',
        'title',
        'interview_date',
        'time_start',
        'time_end',
        'status',
        'description',
        'type',
        'location',
        'meeting_link',
        'employer_notes',
        'maid_notes',
        'employer_rating',
        'maid_rating',
        'confirmed_at',
        'is_archived',
    ];

    protected $casts = [
        'interview_date' => 'date',
        'time_start' => 'datetime',
        'time_end' => 'datetime',
        'employer_rating' => 'integer',
        'maid_rating' => 'integer',
        'confirmed_at' => 'datetime',
        'is_archived' => 'boolean',
    ];

    /**
     * Interview statuses
     */
    const STATUSES = [
        'scheduled' => 'Scheduled',
        'confirmed' => 'Confirmed',
        'completed' => 'Completed',
        'cancelled' => 'Cancelled',
        'rescheduled' => 'Rescheduled',
        'no_show' => 'No Show',
    ];

    /**
     * Interview types
     */
    const TYPES = [
        'video_call' => 'Video Call',
        'phone_call' => 'Phone Call',
        'in_person' => 'In Person',
        'home_visit' => 'Home Visit',
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

    public function jobApplication(): BelongsTo
    {
        return $this->belongsTo(JobApplication::class, 'job_application_id');
    }

    /**
     * Scopes
     */
    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeUpcoming($query)
    {
        return $query->whereIn('status', ['scheduled', 'confirmed'])
            ->where('interview_date', '>=', now()->toDateString());
    }

    /**
     * Accessors
     */
    public function getStatusLabelAttribute()
    {
        return self::STATUSES[$this->status] ?? ucfirst($this->status);
    }

    public function getTypeLabelAttribute()
    {
        return self::TYPES[$this->type] ?? ucfirst(str_replace('_', ' ', $this->type));
    }
}
