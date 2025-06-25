<?php

namespace App\Models\JobPosting;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\Employer\Employer;

class JobPosting extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id',
        'title',
        'work_types',
        'provides_toiletries',
        'provides_food',
        'accommodation_type',
        'min_salary',
        'max_salary',
        'day_off_preference',
        'day_off_type',
        'language_preferences',
        'description',
        'status',
        'is_archived',
    ];

    protected $casts = [
        'work_types' => 'array',
        'provides_toiletries' => 'boolean',
        'provides_food' => 'boolean',
        'min_salary' => 'decimal:2',
        'max_salary' => 'decimal:2',
        'language_preferences' => 'array',
        'is_archived' => 'boolean',
    ];

    /**
     * Common work types
     */
    const WORK_TYPES = [
        'cleaning' => 'General Cleaning',
        'cooking' => 'Cooking',
        'childcare' => 'Childcare',
        'eldercare' => 'Elder Care',
        'pet_care' => 'Pet Care',
        'laundry' => 'Laundry',
        'ironing' => 'Ironing',
        'gardening' => 'Gardening',
        'tutoring' => 'Tutoring',
        'driving' => 'Driving',
        'shopping' => 'Shopping/Errands',
        'housekeeping' => 'General Housekeeping',
    ];

    /**
     * Relationships
     */
    public function employer(): BelongsTo
    {
        return $this->belongsTo(Employer::class);
    }

    public function location(): HasOne
    {
        return $this->hasOne(JobLocation::class, 'job_posting_id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(JobPhoto::class, 'job_posting_id');
    }

    public function bonuses(): HasMany
    {
        return $this->hasMany(JobBonus::class, 'job_posting_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class, 'job_posting_id');
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(JobInterviewSchedule::class, 'job_posting_id');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    /**
     * Accessors
     */
    public function getWorkTypesListAttribute()
    {
        return collect($this->work_types ?? [])->map(function ($workType) {
            return self::WORK_TYPES[$workType] ?? ucfirst(str_replace('_', ' ', $workType));
        })->toArray();
    }

    public function getSalaryRangeAttribute()
    {
        if ($this->min_salary && $this->max_salary) {
            return "₱" . number_format($this->min_salary) . " - ₱" . number_format($this->max_salary);
        } elseif ($this->min_salary) {
            return "From ₱" . number_format($this->min_salary);
        } elseif ($this->max_salary) {
            return "Up to ₱" . number_format($this->max_salary);
        }
        return "Negotiable";
    }

    public function getIsActiveAttribute()
    {
        return $this->status === 'active';
    }
}
