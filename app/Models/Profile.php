<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'phone_number',
        'is_phone_private',
        'birth_date',
        'address',
        'is_address_private',
        'is_archived',
        'preferred_contact_methods',
        'preferred_language',
    ];

    protected $casts = [
        'is_phone_private' => 'boolean',
        'is_address_private' => 'boolean',
        'is_archived' => 'boolean',
        'birth_date' => 'date',
        'address' => 'array',
        'preferred_contact_methods' => 'array',
    ];

    /**
     * Relationships
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Accessors
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get formatted address as string
     */
    public function getFormattedAddressAttribute(): string
    {
        if (!$this->address) {
            return '';
        }

        $parts = array_filter([
            $this->address['street'] ?? '',
            $this->address['barangay'] ?? '',
            $this->address['city'] ?? '',
            $this->address['province'] ?? '',
        ]);

        return implode(', ', $parts);
    }
}
