<?php

namespace App\Models\Maid;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Employer\Employer;
use App\Models\User;
use App\Models\JobPosting\JobApplication;
use App\Models\Agency\Agency;

class Maid extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'agency_id',
        'registration_type',
        'agency_assigned_at',
        'bio',
        'skills',
        'nationality',
        'languages',
        'marital_status',
        'has_children',
        'expected_salary',
        'is_willing_to_relocate',
        'earliest_start_date',
        'years_experience',
        'status',
        'is_verified',
        'is_archived',
    ];

    protected $casts = [
        'skills' => 'array',
        'languages' => 'array',
        'has_children' => 'boolean',
        'is_willing_to_relocate' => 'boolean',
        'expected_salary' => 'decimal:2',
        'earliest_start_date' => 'date',
        'years_experience' => 'integer',
        'is_verified' => 'boolean',
        'is_archived' => 'boolean',
        'agency_assigned_at' => 'datetime',
    ];

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

    const REGISTRATION_TYPES = [
        'individual' => 'Individual',
        'agency' => 'Agency',
        'none' => 'Not Set',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Add agency relationship
    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
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
            ->withTimestamps();
    }

    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
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

    public function scopeIndividual($query)
    {
        return $query->where('registration_type', 'individual');
    }

    public function scopeAgencyManaged($query)
    {
        return $query->where('registration_type', 'agency')->whereNotNull('agency_id');
    }

    public function scopeByAgency($query, $agencyId)
    {
        return $query->where('agency_id', $agencyId);
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

    public function getFullNameAttribute()
    {
        return $this->user?->profile?->full_name;
    }

    public function getVerificationLevelAttribute()
    {
        // Simple count of completed verification steps
        $level = 0;
        if ($this->is_verified) $level++;
        if ($this->documents()->exists()) $level++;
        if ($this->characterReferences()->exists()) $level++;
        return $level;
    }

    // Add agency-related accessors
    public function getRegistrationTypeLabelAttribute()
    {
        return self::REGISTRATION_TYPES[$this->registration_type] ?? ucfirst($this->registration_type);
    }

    public function getIsManagedByAgencyAttribute()
    {
        return $this->registration_type === 'agency' && $this->agency_id !== null;
    }

    public function getAgencyNameAttribute()
    {
        return $this->agency?->name;
    }

    /**
     * Helper Methods
     */
    public function assignToAgency($agencyId)
    {
        $this->update([
            'agency_id' => $agencyId,
            'registration_type' => 'agency',
            'agency_assigned_at' => now(),
        ]);
    }

    public function removeFromAgency()
    {
        $this->update([
            'agency_id' => null,
            'registration_type' => 'individual',
            'agency_assigned_at' => null,
        ]);
    }
}
