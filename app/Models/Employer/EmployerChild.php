<?php

namespace App\Models\Employer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployerChild extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id',
        'age',
        'name',
        'photo_url',
        'is_archived',
    ];

    protected $casts = [
        'is_archived' => 'boolean',
        'age' => 'integer',
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
            $query->where('age', '>=', $minAge);
        }

        if ($maxAge !== null) {
            $query->where('age', '<=', $maxAge);
        }

        return $query;
    }

    /**
     * Accessors
     */
    public function getAgeGroupAttribute()
    {
        return match (true) {
            $this->age <= 3 => 'toddler',
            $this->age <= 5 => 'preschooler',
            $this->age <= 12 => 'school_age',
            $this->age <= 17 => 'teenager',
            default => 'adult'
        };
    }

    public function getDisplayNameAttribute()
    {
        return $this->name ?: "Child ({$this->age} years old)";
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
