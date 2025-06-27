<?php

namespace App\Models\Employer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class EmployerChild extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id',
        'birth_date',
        'name',
        'photo_url',
        'is_archived',
    ];

    protected $casts = [
        'is_archived' => 'boolean',
        'birth_date' => 'date',
    ];

    /**
     * Relationships
     */
    public function employer(): BelongsTo
    {
        return $this->belongsTo(Employer::class);
    }

    /**
     * Scopes
     */
    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeByAgeRange($query, $minAge = null, $maxAge = null)
    {
        if ($minAge !== null) {
            $maxBirthDate = Carbon::now()->subYears($minAge)->format('Y-m-d');
            $query->where('birth_date', '<=', $maxBirthDate);
        }

        if ($maxAge !== null) {
            $minBirthDate = Carbon::now()->subYears($maxAge + 1)->addDay()->format('Y-m-d');
            $query->where('birth_date', '>=', $minBirthDate);
        }

        return $query;
    }

    /**
     * Accessors
     */
    public function getAgeAttribute()
    {
        if (!$this->birth_date) {
            return null;
        }

        return $this->birth_date->diffInYears(Carbon::now());
    }

    public function getAgeGroupAttribute()
    {
        $age = $this->age;

        if ($age === null) {
            return 'unknown';
        }

        return match (true) {
            $age <= 3 => 'toddler',
            $age <= 5 => 'preschooler',
            $age <= 12 => 'school_age',
            $age <= 17 => 'teenager',
            default => 'adult'
        };
    }

    public function getDisplayNameAttribute()
    {
        if ($this->name) {
            return $this->name;
        }

        $age = $this->age;
        return $age ? "Child ({$age} years old)" : "Child";
    }

    /**
     * Helper Methods
     */
    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    public function unarchive()
    {
        $this->update(['is_archived' => false]);
    }
}
