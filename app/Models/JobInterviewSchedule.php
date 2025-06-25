<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
     * Common interview titles
     */
    const COMMON_TITLES = [
        'Initial Interview',
        'Final Interview',
        'Meet & Greet',
        'Skills Assessment',
        'Home Tour',
        'Trial Day',
        'Follow-up Interview',
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

    public function scopeScheduled($query)
    {
        return $query->where('status', 'scheduled');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeUpcoming($query)
    {
        return $query->whereIn('status', ['scheduled', 'confirmed'])
            ->where('interview_date', '>=', now()->toDateString());
    }

    public function scopePast($query)
    {
        return $query->where('interview_date', '<', now()->toDateString());
    }

    public function scopeToday($query)
    {
        return $query->where('interview_date', now()->toDateString());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('interview_date', [
            now()->startOfWeek()->toDateString(),
            now()->endOfWeek()->toDateString()
        ]);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeVideoCall($query)
    {
        return $query->where('type', 'video_call');
    }

    public function scopeInPerson($query)
    {
        return $query->where('type', 'in_person');
    }

    public function scopeWithRatings($query)
    {
        return $query->whereNotNull('employer_rating')
            ->orWhereNotNull('maid_rating');
    }

    public function scopeNeedsConfirmation($query)
    {
        return $query->where('status', 'scheduled')
            ->whereNull('confirmed_at');
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

    public function getIsScheduledAttribute()
    {
        return $this->status === 'scheduled';
    }

    public function getIsConfirmedAttribute()
    {
        return $this->status === 'confirmed';
    }

    public function getIsCompletedAttribute()
    {
        return $this->status === 'completed';
    }

    public function getIsCancelledAttribute()
    {
        return $this->status === 'cancelled';
    }

    public function getIsUpcomingAttribute()
    {
        return in_array($this->status, ['scheduled', 'confirmed']) &&
            $this->interview_date >= now()->toDateString();
    }

    public function getIsPastAttribute()
    {
        return $this->interview_date < now()->toDateString();
    }

    public function getIsTodayAttribute()
    {
        return $this->interview_date == now()->toDateString();
    }

    public function getFormattedDateAttribute()
    {
        return $this->interview_date->format('M j, Y');
    }

    public function getFormattedTimeAttribute()
    {
        return $this->time_start->format('g:i A') . ' - ' . $this->time_end->format('g:i A');
    }

    public function getFormattedDateTimeAttribute()
    {
        return $this->formatted_date . ' at ' . $this->formatted_time;
    }

    public function getDurationMinutesAttribute()
    {
        return $this->time_start->diffInMinutes($this->time_end);
    }

    public function getDurationHoursAttribute()
    {
        return round($this->duration_minutes / 60, 1);
    }

    public function getDaysUntilInterviewAttribute()
    {
        if ($this->is_past) return 0;

        return now()->startOfDay()->diffInDays($this->interview_date);
    }

    public function getHoursUntilInterviewAttribute()
    {
        if ($this->is_past) return 0;

        $interviewDateTime = $this->interview_date->setTimeFrom($this->time_start);
        return now()->diffInHours($interviewDateTime);
    }

    public function getAverageRatingAttribute()
    {
        $ratings = array_filter([$this->employer_rating, $this->maid_rating]);

        return !empty($ratings) ? round(array_sum($ratings) / count($ratings), 1) : null;
    }

    public function getHasRatingsAttribute()
    {
        return !is_null($this->employer_rating) || !is_null($this->maid_rating);
    }

    public function getRequiresLocationAttribute()
    {
        return in_array($this->type, ['in_person', 'home_visit']);
    }

    public function getRequiresMeetingLinkAttribute()
    {
        return in_array($this->type, ['video_call']);
    }

    /**
     * Helper Methods
     */
    public function confirm()
    {
        $this->update([
            'status' => 'confirmed',
            'confirmed_at' => now(),
        ]);
    }

    public function complete($employerNotes = null, $employerRating = null)
    {
        $updateData = ['status' => 'completed'];

        if ($employerNotes) {
            $updateData['employer_notes'] = $employerNotes;
        }

        if ($employerRating) {
            $updateData['employer_rating'] = $employerRating;
        }

        $this->update($updateData);
    }

    public function cancel($reason = null)
    {
        $updateData = ['status' => 'cancelled'];

        if ($reason) {
            $updateData['employer_notes'] = $reason;
        }

        $this->update($updateData);
    }

    public function markNoShow($notes = null)
    {
        $updateData = ['status' => 'no_show'];

        if ($notes) {
            $updateData['employer_notes'] = $notes;
        }

        $this->update($updateData);
    }

    public function reschedule($newDate, $newTimeStart, $newTimeEnd, $reason = null)
    {
        // Mark current interview as rescheduled
        $this->update(['status' => 'rescheduled']);

        // Create new interview
        return self::create([
            'job_posting_id' => $this->job_posting_id,
            'maid_id' => $this->maid_id,
            'job_application_id' => $this->job_application_id,
            'title' => $this->title,
            'interview_date' => $newDate,
            'time_start' => $newTimeStart,
            'time_end' => $newTimeEnd,
            'type' => $this->type,
            'location' => $this->location,
            'meeting_link' => $this->meeting_link,
            'description' => $reason ? $this->description . "\n\nRescheduled: " . $reason : $this->description,
        ]);
    }

    public function addEmployerRating($rating, $notes = null)
    {
        $updateData = ['employer_rating' => $rating];

        if ($notes) {
            $updateData['employer_notes'] = $notes;
        }

        $this->update($updateData);
    }

    public function addMaidRating($rating, $notes = null)
    {
        $updateData = ['maid_rating' => $rating];

        if ($notes) {
            $updateData['maid_notes'] = $notes;
        }

        $this->update($updateData);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    public function unarchive()
    {
        $this->update(['is_archived' => false]);
    }

    public function canCancel()
    {
        return in_array($this->status, ['scheduled', 'confirmed']) &&
            $this->interview_date >= now()->toDateString();
    }

    public function canReschedule()
    {
        return $this->canCancel();
    }

    public function canComplete()
    {
        return in_array($this->status, ['scheduled', 'confirmed']) &&
            $this->interview_date <= now()->toDateString();
    }

    // Not yet implemented
    public function generateMeetingLink()
    {
        // This would integrate with video calling services
        // For now, return a placeholder
        return "https://meet.example.com/interview-" . $this->id;
    }

    /**
     * Static Methods
     */
    public static function getStatuses()
    {
        return self::STATUSES;
    }

    public static function getTypes()
    {
        return self::TYPES;
    }

    public static function getCommonTitles()
    {
        return self::COMMON_TITLES;
    }

    public static function getInterviewStats($entity, $entityType = 'job')
    {
        $query = $entityType === 'job'
            ? self::where('job_posting_id', $entity->id)
            : self::where('maid_id', $entity->id);

        $interviews = $query->notArchived();

        return [
            'total' => $interviews->count(),
            'scheduled' => $interviews->scheduled()->count(),
            'confirmed' => $interviews->confirmed()->count(),
            'completed' => $interviews->completed()->count(),
            'cancelled' => $interviews->cancelled()->count(),
            'no_shows' => $interviews->where('status', 'no_show')->count(),
            'average_rating' => $interviews->whereNotNull('employer_rating')->avg('employer_rating'),
            'upcoming' => $interviews->upcoming()->count(),
        ];
    }

    public static function getTodaysInterviews()
    {
        return self::today()
            ->whereIn('status', ['scheduled', 'confirmed'])
            ->orderBy('time_start')
            ->get();
    }

    public static function getUpcomingInterviews($limit = 10)
    {
        return self::upcoming()
            ->orderBy('interview_date')
            ->orderBy('time_start')
            ->limit($limit)
            ->get();
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        // Generate meeting link for video calls
        static::created(function ($interview) {
            if ($interview->type === 'video_call' && !$interview->meeting_link) {
                $interview->update(['meeting_link' => $interview->generateMeetingLink()]);
            }
        });

        // Auto-complete past interviews that are still scheduled/confirmed
        static::updating(function ($interview) {
            if (
                $interview->is_past &&
                in_array($interview->status, ['scheduled', 'confirmed'])
            ) {
                $interview->status = 'completed';
            }
        });
    }
}