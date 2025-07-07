<?php

namespace App\Models\Agency;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgencySetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'agency_id',
        'show_fees_publicly',
        'allow_fee_negotiation',
        'brand_color',
        'brand_tagline',
        'show_agency_branding_on_maids',
        'preferred_work_types',
        'service_areas',
        'accept_direct_inquiries',
        'notify_new_job_postings',
        'notify_maid_applications',
        'notify_employer_inquiries',
        'training_programs',
        'certifications',
        'highlight_training',
        'replacement_guarantee_days',
        'replacement_policy',
        'is_archived',
    ];

    protected $casts = [
        'show_fees_publicly' => 'boolean',
        'allow_fee_negotiation' => 'boolean',
        'show_agency_branding_on_maids' => 'boolean',
        'preferred_work_types' => 'array',
        'service_areas' => 'array',
        'accept_direct_inquiries' => 'boolean',
        'notify_new_job_postings' => 'boolean',
        'notify_maid_applications' => 'boolean',
        'notify_employer_inquiries' => 'boolean',
        'highlight_training' => 'boolean',
        'replacement_guarantee_days' => 'integer',
        'is_archived' => 'boolean',
    ];

    /**
     * Common work types
     */
    const WORK_TYPES = [
        'cleaning' => 'General Cleaning',
        'cooking' => 'Cooking',
        'childcare' => 'Childcare',
        'eldercare' => 'Elder Care',
        'pet_care' => 'Pet Care',
        'laundry' => 'Laundry',
        'ironing' => 'Ironing',
        'gardening' => 'Gardening',
        'tutoring' => 'Tutoring',
        'driving' => 'Driving',
        'shopping' => 'Shopping/Errands',
        'housekeeping' => 'General Housekeeping',
    ];

    /**
     * Relationships
     */
    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    /**
     * Scopes
     */
    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeAcceptingInquiries($query)
    {
        return $query->where('accept_direct_inquiries', true);
    }

    /**
     * Accessors
     */
    public function getPreferredWorkTypesLabelsAttribute()
    {
        if (!$this->preferred_work_types) return [];

        return collect($this->preferred_work_types)
            ->map(fn($type) => self::WORK_TYPES[$type] ?? ucfirst(str_replace('_', ' ', $type)))
            ->toArray();
    }

    public function getReplacementGuaranteeLabelAttribute()
    {
        if (!$this->replacement_guarantee_days) return 'No guarantee';

        $days = $this->replacement_guarantee_days;
        return $days === 1 ? '1 day guarantee' : "{$days} days guarantee";
    }

    /**
     * Helper Methods
     */
    public function enablePublicFees()
    {
        $this->update(['show_fees_publicly' => true]);
    }

    public function disablePublicFees()
    {
        $this->update(['show_fees_publicly' => false]);
    }

    public function enableDirectInquiries()
    {
        $this->update(['accept_direct_inquiries' => true]);
    }

    public function disableDirectInquiries()
    {
        $this->update(['accept_direct_inquiries' => false]);
    }

    public function updateWorkTypes(array $workTypes)
    {
        $this->update(['preferred_work_types' => $workTypes]);
    }

    public function updateServiceAreas(array $areas)
    {
        $this->update(['service_areas' => $areas]);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }
}
