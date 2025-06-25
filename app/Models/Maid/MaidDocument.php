<?php

namespace App\Models\Maid;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaidDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'maid_id',
        'type',
        'title',
        'url',
        'description',
        'is_archived',
    ];

    protected $casts = [
        'is_archived' => 'boolean',
    ];

    const DOCUMENT_TYPES = [
        'id' => 'National ID',
        'passport' => 'Passport',
        'certificate' => 'Certificate',
        'resume' => 'Resume/CV',
        'reference' => 'Reference Letter',
        'medical' => 'Medical Certificate',
        'other' => 'Other Document',
    ];

    const REQUIRED_DOCUMENTS = [
        'id' => 'Valid ID (National ID or Passport)',
        'resume' => 'Resume or CV',
        'medical' => 'Medical Certificate',
    ];

    /**
     * Relationships
     */
    public function maid(): BelongsTo
    {
        return $this->belongsTo(Maid::class);
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
    public function getTypeLabelAttribute()
    {
        return self::DOCUMENT_TYPES[$this->type] ?? ucfirst($this->type);
    }
}
