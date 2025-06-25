<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Maid extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bio',
        'skills',
        'nationality',
        'languages',
        'social_media_links',
        'marital_status',
        'has_children',
        'expected_salary',
        'is_willing_to_relocate',
        'preferred_accommodation',
        'earliest_start_date',
        'years_experience',
        'status',
        'availability_schedule',
        'emergency_contact_name',
        'emergency_contact_phone',
        'verification_badges',
        'is_verified',
        'is_archived',
    ];

    protected $casts = [
        'skills' => 'array',
        'languages' => 'array',
        'social_media_links' => 'array',
        'has_children' => 'boolean',
        'is_willing_to_relocate' => 'boolean',
        'expected_salary' => 'decimal:2',
        'earliest_start_date' => 'date',
        'years_experience' => 'integer',
        'availability_schedule' => 'array',
        'verification_badges' => 'array',
        'is_verified' => 'boolean',
        'is_archived' => 'boolean',
    ];

    /**
     * Common skills for maids
     */
    const COMMON_SKILLS = [
        'cleaning' => 'General Cleaning',
        'cooking' => 'Cooking',
        'childcare' => 'Childcare',
        'eldercare' => 'Elder Care',
        'pet_care' => 'Pet Care',
        'laundry' => 'Laundry',
        'ironing' => 'Ironing',
        'gardening' => 'Gardening',
        'driving' => 'Driving',
        'tutoring' => 'Tutoring',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(MaidDocument::class);
    }

    public function characterReferences(): HasMany
    {
        return $this->hasMany(MaidCharacterReference::class);
    }

    public function employerBookmarks(): BelongsToMany
    {
        return $this->belongsToMany(Employer::class, 'employer_bookmarked_maids')
            ->withPivot(['description'])
            ->withTimestamps();
    }

    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(JobInterviewSchedule::class);
    }

    /**
     * Scopes
     */
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeWillingToRelocate($query)
    {
        return $query->where('is_willing_to_relocate', true);
    }

    public function scopeByExperience($query, $minYears = null, $maxYears = null)
    {
        if ($minYears !== null) {
            $query->where('years_experience', '>=', $minYears);
        }

        if ($maxYears !== null) {
            $query->where('years_experience', '<=', $maxYears);
        }

        return $query;
    }

    public function scopeBySalaryRange($query, $minSalary = null, $maxSalary = null)
    {
        if ($minSalary !== null) {
            $query->where('expected_salary', '>=', $minSalary);
        }

        if ($maxSalary !== null) {
            $query->where('expected_salary', '<=', $maxSalary);
        }

        return $query;
    }

    public function scopeWithSkills($query, array $skills)
    {
        return $query->where(function ($q) use ($skills) {
            foreach ($skills as $skill) {
                $q->orWhereJsonContains('skills', $skill);
            }
        });
    }

    public function scopeWithLanguages($query, array $languages)
    {
        return $query->where(function ($q) use ($languages) {
            foreach ($languages as $language) {
                $q->orWhereJsonContains('languages', $language);
            }
        });
    }

    public function scopeByNationality($query, $nationality)
    {
        return $query->where('nationality', $nationality);
    }

    public function scopeAvailableFrom($query, $date)
    {
        return $query->where('earliest_start_date', '<=', $date);
    }

    /**
     * Accessors
     */
    public function getExperienceLevelAttribute()
    {
        return match (true) {
            $this->years_experience == 0 => 'beginner',
            $this->years_experience <= 2 => 'novice',
            $this->years_experience <= 5 => 'intermediate',
            $this->years_experience <= 10 => 'experienced',
            default => 'expert'
        };
    }

    public function getIsAvailableAttribute()
    {
        return $this->status === 'available';
    }

    public function getIsEmployedAttribute()
    {
        return $this->status === 'employed';
    }

    public function getVerificationLevelAttribute()
    {
        $badges = $this->verification_badges ?? [];
        return count($badges);
    }

    public function getFullNameAttribute()
    {
        return $this->user?->profile?->full_name;
    }

    public function getSkillsListAttribute()
    {
        return collect($this->skills ?? [])->map(function ($skill) {
            return self::COMMON_SKILLS[$skill] ?? ucfirst(str_replace('_', ' ', $skill));
        })->toArray();
    }

    public function getLanguagesListAttribute()
    {
        return $this->languages ?? [];
    }

    public function getIsAvailableForImmediateStartAttribute()
    {
        return $this->earliest_start_date <= now()->addDays(7);
    }

    /**
     * Helper Methods
     */
    public function markAsEmployed()
    {
        $this->update(['status' => 'employed']);
    }

    public function markAsAvailable()
    {
        $this->update(['status' => 'available']);
    }

    public function markAsUnavailable()
    {
        $this->update(['status' => 'unavailable']);
    }

    public function verify()
    {
        $this->update(['is_verified' => true]);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    public function addVerificationBadge($badge)
    {
        $badges = $this->verification_badges ?? [];
        if (!in_array($badge, $badges)) {
            $badges[] = $badge;
            $this->update(['verification_badges' => $badges]);
        }
    }

    public function removeVerificationBadge($badge)
    {
        $badges = $this->verification_badges ?? [];
        $badges = array_values(array_diff($badges, [$badge]));
        $this->update(['verification_badges' => $badges]);
    }

    public function hasSkill($skill)
    {
        return in_array($skill, $this->skills ?? []);
    }

    public function speaksLanguage($language)
    {
        return in_array($language, $this->languages ?? []);
    }

    public function hasVerificationBadge($badge)
    {
        return in_array($badge, $this->verification_badges ?? []);
    }

    public function getMatchScore(Employer $employer)
    {
        $score = 0;
        $maxScore = 100;

        // Skills matching (40 points)
        $employerPreferences = $employer->maid_preferences ?? [];
        $preferredSkills = $employerPreferences['skills'] ?? [];

        if (!empty($preferredSkills)) {
            $matchingSkills = array_intersect($this->skills ?? [], $preferredSkills);
            $score += (count($matchingSkills) / count($preferredSkills)) * 40;
        }

        // Language matching (20 points)
        $preferredLanguages = $employerPreferences['languages'] ?? [];
        if (!empty($preferredLanguages)) {
            $matchingLanguages = array_intersect($this->languages ?? [], $preferredLanguages);
            $score += (count($matchingLanguages) / count($preferredLanguages)) * 20;
        }

        // Experience matching (20 points)
        $preferredExperience = $employerPreferences['experience_years'] ?? null;
        if ($preferredExperience !== null) {
            if ($this->years_experience >= $preferredExperience) {
                $score += 20;
            } else {
                $score += ($this->years_experience / $preferredExperience) * 20;
            }
        }

        // Salary matching (10 points)
        $budgetRange = $employerPreferences['budget_range'] ?? [];
        if (!empty($budgetRange) && $this->expected_salary) {
            $minBudget = $budgetRange['min'] ?? 0;
            $maxBudget = $budgetRange['max'] ?? PHP_INT_MAX;

            if ($this->expected_salary >= $minBudget && $this->expected_salary <= $maxBudget) {
                $score += 10;
            }
        }

        // Verification bonus (10 points)
        if ($this->is_verified) {
            $score += 5;
        }

        $score += min($this->verification_level * 1, 5);

        return min($score, $maxScore);
    }

    /**
     * Static Methods
     */
    public static function getCommonSkills()
    {
        return self::COMMON_SKILLS;
    }

    public static function getAvailableStatuses()
    {
        return ['available', 'unavailable', 'employed', 'inactive'];
    }

    public static function getMaritalStatuses()
    {
        return ['single', 'married', 'divorced', 'widowed'];
    }
}