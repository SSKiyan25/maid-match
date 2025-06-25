<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function scopeFilled($query)
    {
        return $query->where('status', 'filled');
    }

    public function scopeExpired($query)
    {
        return $query->where('status', 'expired');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeWithWorkTypes($query, array $workTypes)
    {
        return $query->where(function ($q) use ($workTypes) {
            foreach ($workTypes as $workType) {
                $q->orWhereJsonContains('work_types', $workType);
            }
        });
    }

    public function scopeWithLanguages($query, array $languages)
    {
        return $query->where(function ($q) use ($languages) {
            foreach ($languages as $language) {
                $q->orWhereJsonContains('language_preferences', $language);
            }
        });
    }

    public function scopeBySalaryRange($query, $minSalary = null, $maxSalary = null)
    {
        if ($minSalary !== null) {
            $query->where('max_salary', '>=', $minSalary);
        }

        if ($maxSalary !== null) {
            $query->where('min_salary', '<=', $maxSalary);
        }

        return $query;
    }

    public function scopeByAccommodationType($query, $type)
    {
        return $query->where('accommodation_type', $type);
    }

    public function scopeLiveIn($query)
    {
        return $query->whereIn('accommodation_type', ['live_in', 'flexible']);
    }

    public function scopeLiveOut($query)
    {
        return $query->whereIn('accommodation_type', ['live_out', 'flexible']);
    }

    public function scopeWithBenefits($query)
    {
        return $query->where(function ($q) {
            $q->where('provides_toiletries', true)
                ->orWhere('provides_food', true)
                ->orWhereHas('bonuses');
        });
    }

    public function scopeRecent($query, $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
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

    public function getLanguagesListAttribute()
    {
        return $this->language_preferences ?? [];
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

    public function getIsFilledAttribute()
    {
        return $this->status === 'filled';
    }

    public function getIsExpiredAttribute()
    {
        return $this->status === 'expired';
    }

    public function getIsDraftAttribute()
    {
        return $this->status === 'draft';
    }

    public function getBenefitsListAttribute()
    {
        $benefits = [];

        if ($this->provides_food) {
            $benefits[] = 'Food provided';
        }

        if ($this->provides_toiletries) {
            $benefits[] = 'Toiletries provided';
        }

        if ($this->accommodation_type === 'live_in') {
            $benefits[] = 'Live-in accommodation';
        }

        // Add bonuses
        foreach ($this->bonuses as $bonus) {
            $benefits[] = $bonus->title;
        }

        return $benefits;
    }

    public function getApplicationsCountAttribute()
    {
        return $this->applications()->count();
    }

    public function getPendingApplicationsCountAttribute()
    {
        return $this->applications()->where('status', 'pending')->count();
    }

    public function getAcceptedApplicationsCountAttribute()
    {
        return $this->applications()->where('status', 'accepted')->count();
    }

    public function getDaysActiveAttribute()
    {
        return $this->created_at->diffInDays(now());
    }

    /**
     * Helper Methods
     */
    public function markAsFilled()
    {
        $this->update(['status' => 'filled']);
    }

    public function markAsExpired()
    {
        $this->update(['status' => 'expired']);
    }

    public function markAsActive()
    {
        $this->update(['status' => 'active']);
    }

    public function markAsInactive()
    {
        $this->update(['status' => 'inactive']);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    public function unarchive()
    {
        $this->update(['is_archived' => false]);
    }

    public function hasWorkType($workType)
    {
        return in_array($workType, $this->work_types ?? []);
    }

    public function requiresLanguage($language)
    {
        return in_array($language, $this->language_preferences ?? []);
    }

    public function salaryMatches($expectedSalary)
    {
        if (!$expectedSalary) return true;

        $minAcceptable = $this->min_salary ?? 0;
        $maxAcceptable = $this->max_salary ?? PHP_INT_MAX;

        return $expectedSalary >= $minAcceptable && $expectedSalary <= $maxAcceptable;
    }

    public function getMatchingMaids($limit = 20)
    {
        $query = Maid::available()->verified()->notArchived();

        // Filter by work types
        if (!empty($this->work_types)) {
            $query->withSkills($this->work_types);
        }

        // Filter by languages
        if (!empty($this->language_preferences)) {
            $query->withLanguages($this->language_preferences);
        }

        // Filter by salary range
        if ($this->min_salary || $this->max_salary) {
            $query->bySalaryRange($this->min_salary, $this->max_salary);
        }

        return $query->limit($limit)->get()->map(function ($maid) {
            $maid->match_score = $this->calculateMatchScore($maid);
            return $maid;
        })->sortByDesc('match_score');
    }

    public function calculateMatchScore(Maid $maid)
    {
        $score = 0;
        $maxScore = 100;

        // Work types matching (40 points)
        if (!empty($this->work_types)) {
            $matchingSkills = array_intersect($maid->skills ?? [], $this->work_types);
            $score += (count($matchingSkills) / count($this->work_types)) * 40;
        }

        // Language matching (20 points)
        if (!empty($this->language_preferences)) {
            $matchingLanguages = array_intersect($maid->languages ?? [], $this->language_preferences);
            $score += (count($matchingLanguages) / count($this->language_preferences)) * 20;
        }

        // Salary matching (20 points)
        if ($this->salaryMatches($maid->expected_salary)) {
            $score += 20;
        }

        // Experience bonus (10 points)
        if ($maid->years_experience >= 2) {
            $score += 10;
        } elseif ($maid->years_experience >= 1) {
            $score += 5;
        }

        // Verification bonus (10 points)
        if ($maid->is_verified) {
            $score += 10;
        }

        return min($score, $maxScore);
    }

    /**
     * Static Methods
     */
    public static function getWorkTypes()
    {
        return self::WORK_TYPES;
    }

    public static function getAccommodationTypes()
    {
        return [
            'live_in' => 'Live-in',
            'live_out' => 'Live-out',
            'flexible' => 'Flexible',
        ];
    }

    public static function getDayOffTypes()
    {
        return [
            'weekly' => 'Weekly',
            'monthly' => 'Monthly',
            'flexible' => 'Flexible',
            'none' => 'None',
        ];
    }

    public static function getStatuses()
    {
        return [
            'draft' => 'Draft',
            'active' => 'Active',
            'inactive' => 'Inactive',
            'filled' => 'Filled',
            'expired' => 'Expired',
        ];
    }
}