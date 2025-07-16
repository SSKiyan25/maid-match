<?php

namespace App\Models\Agency;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgencyCredit extends Model
{
    protected $table = 'agency_credits';

    protected $fillable = [
        'agency_id',
        'amount',
        'type',
        'description',
        'expires_at',
    ];

    protected $dates = [
        'expires_at',
    ];

    // Relationship to Agency
    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }
}
