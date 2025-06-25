<?php

namespace App\Models;

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

    public function scopeToddlers($query)
    {
        return $query->where('age', '<=', 3);
    }

    public function scopePreschoolers($query)
    {
        return $query->whereBetween('age', [4, 5]);
    }

    public function scopeSchoolAge($query)
    {
        return $query->whereBetween('age', [6, 12]);
    }

    public function scopeTeenagers($query)
    {
        return $query->whereBetween('age', [13, 17]);
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

    public function isToddler()
    {
        return $this->age <= 3;
    }

    public function isPreschooler()
    {
        return $this->age >= 4 && $this->age <= 5;
    }

    public function isSchoolAge()
    {
        return $this->age >= 6 && $this->age <= 12;
    }

    public function isTeenager()
    {
        return $this->age >= 13 && $this->age <= 17;
    }

    public function needsChildcare()
    {
        return $this->age < 18;
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        // Automatically set age constraints
        static::saving(function ($child) {
            if ($child->age < 0) {
                $child->age = 0;
            }
            if ($child->age > 25) {
                $child->age = 25;
            }
        });
    }
}
