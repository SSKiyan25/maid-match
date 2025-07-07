<?php

namespace App\Http\Requests\Agency;

use Illuminate\Foundation\Http\FormRequest;

class AgencyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() &&
            (auth()->user()->hasRole('agency') || auth()->user()->hasRole('admin'));
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'user_id' => ['required', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'license_number' => ['nullable', 'string', 'max:255', 'unique:agencies,license_number,' . $this->route('agency')],
            'license_photo_front' => ['nullable', 'image', 'max:5120'], // 5MB max
            'license_photo_back' => ['nullable', 'image', 'max:5120'], // 5MB max
            'description' => ['nullable', 'string'],
            'established_at' => ['nullable', 'date'],
            'business_email' => ['nullable', 'email', 'max:255'],
            'business_phone' => ['nullable', 'string', 'max:255'],
            'contact_person' => ['nullable', 'array'],
            'website' => ['nullable', 'string', 'max:255'],
            'facebook_page' => ['nullable', 'string', 'max:255'],
            'placement_fee' => ['nullable', 'numeric', 'min:0'],
            'show_fee_publicly' => ['boolean'],
            'status' => ['required', 'in:active,inactive,suspended,pending_verification'],
            'is_premium' => ['boolean'],
            'premium_at' => ['nullable', 'date'],
            'premium_expires_at' => ['nullable', 'date'],
            'is_verified' => ['boolean'],
            'verified_at' => ['nullable', 'date'],
            'is_archived' => ['boolean'],
        ];

        // For updates, make license_number unique except for current agency
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['license_number'] = [
                'required',
                'string',
                'max:255',
                'unique:agencies,license_number,' . $this->route('agency'),
            ];
        }

        return $rules;
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'User is required.',
            'user_id.exists' => 'User does not exist.',
            'name.required' => 'Agency name is required.',
            'license_number.required' => 'License number is required.',
            'license_number.unique' => 'This license number is already registered.',
            'license_photo.image' => 'License photo must be an image file.',
            'license_photo.max' => 'License photo must not be larger than 5MB.',
            'business_email.email' => 'Business email must be a valid email address.',
            'placement_fee.numeric' => 'Placement fee must be a number.',
            'status.in' => 'Invalid status.',
        ];
    }

    /**
     * Get validated data with user_id automatically set if not present.
     */
    public function validatedWithUser(): array
    {
        $validated = $this->validated();

        if (!isset($validated['user_id']) && auth()->user()->hasRole('agency')) {
            $validated['user_id'] = auth()->id();
        }

        return $validated;
    }
}
