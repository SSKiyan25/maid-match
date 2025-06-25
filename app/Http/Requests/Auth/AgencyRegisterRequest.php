<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AgencyRegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Open registration for agencies
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // User Account Fields
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string'],

            // Essential Business Information
            'name' => ['required', 'string', 'max:255', 'unique:agencies,name'],
            'license_number' => ['required', 'string', 'max:100', 'unique:agencies,license_number'],
            'description' => ['nullable', 'string', 'max:1000'],

            // Primary Contact Information
            'contact_person' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:20'],
            'business_email' => ['nullable', 'email', 'max:255', 'different:email'],

            // Business Location
            'address' => ['required', 'string', 'max:500'],
            'city' => ['required', 'string', 'max:100'],
            'province' => ['required', 'string', 'max:100'],

            // Business Model (Optional for registration)
            'placement_fee' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'show_fee_publicly' => ['nullable', 'boolean'],

            // Terms and Conditions
            'terms_accepted' => ['required', 'accepted'],
            'privacy_accepted' => ['required', 'accepted'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            // User Account Messages
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',

            // Business Information Messages
            'name.required' => 'Agency name is required.',
            'name.unique' => 'This agency name is already taken.',
            'license_number.required' => 'Business license number is required.',
            'license_number.unique' => 'This license number is already registered.',
            'description.max' => 'Description cannot exceed 1000 characters.',

            // Contact Information Messages
            'contact_person.required' => 'Contact person name is required.',
            'phone_number.required' => 'Phone number is required.',
            'business_email.email' => 'Please enter a valid business email.',
            'business_email.different' => 'Business email must be different from login email.',

            // Location Messages
            'address.required' => 'Business address is required.',
            'city.required' => 'City is required.',
            'province.required' => 'Province is required.',

            // Business Model Messages
            'placement_fee.numeric' => 'Placement fee must be a valid number.',
            'placement_fee.min' => 'Placement fee cannot be negative.',
            'placement_fee.max' => 'Placement fee cannot exceed ₱999,999.99.',

            // Terms Messages
            'terms_accepted.required' => 'You must accept the terms and conditions.',
            'terms_accepted.accepted' => 'You must accept the terms and conditions.',
            'privacy_accepted.required' => 'You must accept the privacy policy.',
            'privacy_accepted.accepted' => 'You must accept the privacy policy.',
        ];
    }

    /**
     * Get custom attribute names for validation messages.
     */
    public function attributes(): array
    {
        return [
            'name' => 'agency name',
            'license_number' => 'business license number',
            'contact_person' => 'contact person',
            'phone_number' => 'phone number',
            'business_email' => 'business email',
            'placement_fee' => 'placement fee',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Clean and format phone number
        if ($this->phone_number) {
            $this->merge([
                'phone_number' => preg_replace('/[^\d+]/', '', $this->phone_number),
            ]);
        }

        // Set default values
        $this->merge([
            'show_fee_publicly' => $this->show_fee_publicly ?? false,
        ]);
    }

    /**
     * Get validated data formatted for agency creation.
     */
    public function getAgencyData(): array
    {
        $validated = $this->validated();

        return [
            // Basic agency information
            'name' => $validated['name'],
            'license_number' => $validated['license_number'],
            'description' => $validated['description'] ?? null,
            'contact_person' => $validated['contact_person'],
            'phone_number' => $validated['phone_number'],
            'business_email' => $validated['business_email'] ?? null,
            'address' => $validated['address'],
            'city' => $validated['city'],
            'province' => $validated['province'],
            'placement_fee' => $validated['placement_fee'] ?? null,
            'show_fee_publicly' => $validated['show_fee_publicly'] ?? false,

            // Set initial status
            'status' => 'pending_verification',
            'is_verified' => false,
            'is_archived' => false,
        ];
    }

    /**
     * Get validated data formatted for user creation.
     */
    public function getUserData(): array
    {
        $validated = $this->validated();

        return [
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => 'agency',
            'status' => 'active',
        ];
    }
}
