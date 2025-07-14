<?php

namespace App\Http\Requests\Agency;

use Illuminate\Foundation\Http\FormRequest;

class AgencySettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->agency;
    }

    public function rules(): array
    {
        return [
            'show_fees_publicly' => ['boolean'],
            'allow_fee_negotiation' => ['boolean'],
            'brand_color' => ['nullable', 'string', 'max:32'],
            'brand_tagline' => ['nullable', 'string', 'max:255'],
            'show_agency_branding_on_maids' => ['boolean'],
            'preferred_work_types' => ['nullable', 'array'],
            'preferred_work_types.*' => ['string'],
            'service_areas' => ['nullable', 'array'],
            'service_areas.*' => ['string'],
            'accept_direct_inquiries' => ['boolean'],
            'notify_new_job_postings' => ['boolean'],
            'notify_maid_applications' => ['boolean'],
            'notify_employer_inquiries' => ['boolean'],
            'training_programs' => ['nullable', 'array'],
            'training_programs.*' => ['string'],
            'certifications' => ['nullable', 'array'],
            'certifications.*' => ['string'],
            'highlight_training' => ['boolean'],
            'replacement_guarantee_days' => ['nullable', 'integer', 'min:0'],
            'replacement_policy' => ['nullable', 'string', 'max:1000'],
            'is_archived' => ['boolean'],
        ];
    }
}
