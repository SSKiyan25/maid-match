<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'is_phone_private' => ['boolean'],
            'birth_date' => ['nullable', 'date'],
            'address' => ['nullable', 'array'],
            'address.street' => ['nullable', 'string', 'max:255'],
            'address.barangay' => ['nullable', 'string', 'max:255'],
            'address.city' => ['nullable', 'string', 'max:255'],
            'address.province' => ['nullable', 'string', 'max:255'],
            'is_address_private' => ['boolean'],
            'is_archived' => ['boolean'],
            'preferred_contact_methods' => ['nullable', 'array'],
            'preferred_contact_methods.*' => ['string'],
            'preferred_language' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'first_name.max' => 'First name cannot exceed 255 characters.',
            'last_name.required' => 'Last name is required.',
            'last_name.max' => 'Last name cannot exceed 255 characters.',
            'phone_number.max' => 'Phone number cannot exceed 20 characters.',
            'birth_date.date' => 'Birth date must be a valid date.',
            'address.array' => 'Address must be an array.',
            'address.street.max' => 'Street cannot exceed 255 characters.',
            'address.barangay.max' => 'Barangay cannot exceed 255 characters.',
            'address.city.max' => 'City cannot exceed 255 characters.',
            'address.province.max' => 'Province cannot exceed 255 characters.',
            'preferred_contact_methods.array' => 'Preferred contact methods must be an array.',
            'preferred_contact_methods.*.string' => 'Each contact method must be a string.',
            'preferred_language.max' => 'Preferred language cannot exceed 255 characters.',
        ];
    }
}
