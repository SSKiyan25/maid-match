<?php

namespace App\Models\Employer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use App\Models\User;
use App\Models\Maid\Maid;
use App\Models\JobPosting\JobPosting;
use App\Models\JobPosting\JobApplication;
use App\Models\JobPosting\JobInterviewSchedule;

class Employer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'household_description',
        'family_size',
        'has_children',
        'has_pets',
        'status',
        'maid_preferences',
        'is_verified',
        'is_archived',
    ];

    protected $casts = [
        'has_children' => 'boolean',
        'has_pets' => 'boolean',
        'maid_preferences' => 'array',
        'is_verified' => 'boolean',
        'is_archived' => 'boolean',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function children(): HasMany
    {
        return $this->hasMany(EmployerChild::class);
    }

    public function pets(): HasMany
    {
        return $this->hasMany(EmployerPet::class);
    }

    public function bookmarkedMaids(): BelongsToMany
    {
        return $this->belongsToMany(Maid::class, 'employer_bookmarked_maids')
            ->withPivot(['description'])
            ->withTimestamps()
            ->wherePivot('is_archived', false);
    }

    public function jobPostings(): HasMany
    {
        return $this->hasMany(JobPosting::class);
    }

    public function jobApplications(): HasManyThrough
    {
        return $this->hasManyThrough(JobApplication::class, JobPosting::class, 'employer_id', 'job_posting_id');
    }

    public function interviews(): HasManyThrough
    {
        return $this->hasManyThrough(JobInterviewSchedule::class, JobPosting::class, 'employer_id', 'job_posting_id');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeLooking($query)
    {
        return $query->where('status', 'looking');
    }

    public function scopeWithChildren($query)
    {
        return $query->where('has_children', true);
    }

    public function scopeWithPets($query)
    {
        return $query->where('has_pets', true);
    }

    /**
     * Accessors & Mutators
     */
    public function getIsLookingAttribute()
    {
        return $this->status === 'looking';
    }

    public function getIsActiveAttribute()
    {
        return $this->status === 'active';
    }

    /**
     * Helper Methods
     */
    public function markAsLooking()
    {
        $this->update(['status' => 'looking']);
    }

    public function markAsFulfilled()
    {
        $this->update(['status' => 'fulfilled']);
    }

    public function verify()
    {
        $this->update(['is_verified' => true]);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    /**
     * Efficient methods using database fields
     */
    public function hasChildren()
    {
        return $this->has_children;
    }

    public function hasPets()
    {
        return $this->has_pets;
    }

    /**
     * Update flags when children/pets are added/removed
     */
    public function updateChildrenFlag()
    {
        $this->update(['has_children' => $this->children()->notArchived()->exists()]);
    }

    public function updatePetsFlag()
    {
        $this->update(['has_pets' => $this->pets()->notArchived()->exists()]);
    }

    public function getActiveJobPostingsCount()
    {
        return $this->jobPostings()->where('status', 'active')->count();
    }
}
