<?php

namespace App\Models\Employer;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployerPet extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id',
        'type',
        'name',
        'photo_url',
        'is_archived',
    ];

    protected $casts = [
        'is_archived' => 'boolean',
    ];

    /**
     * Common pet types
     */
    const PET_TYPES = [
        'dog' => 'Dog',
        'cat' => 'Cat',
        'bird' => 'Bird',
        'fish' => 'Fish',
        'rabbit' => 'Rabbit',
        'hamster' => 'Hamster',
        'guinea_pig' => 'Guinea Pig',
        'turtle' => 'Turtle',
        'snake' => 'Snake',
        'lizard' => 'Lizard',
        'other' => 'Other',
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

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Accessors
     */
    public function getDisplayNameAttribute()
    {
        if ($this->name) {
            return "{$this->name} ({$this->type_label})";
        }

        return $this->type_label;
    }

    public function getTypeLabelAttribute()
    {
        return self::PET_TYPES[$this->type] ?? ucfirst($this->type);
    }

    public function getCareComplexityAttribute()
    {
        return match ($this->type) {
            'dog' => 'high',
            'cat' => 'medium',
            'bird' => 'medium',
            'rabbit', 'hamster', 'guinea_pig' => 'medium',
            'fish', 'turtle' => 'low',
            'snake', 'lizard' => 'specialized',
            default => 'unknown'
        };
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
