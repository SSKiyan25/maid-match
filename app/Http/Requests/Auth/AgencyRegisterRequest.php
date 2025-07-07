<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class AgencyRegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Step 1.1: Email & Password (User)
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'avatar' => ['nullable', 'image', 'max:5120'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string'],

            // Step 1.2: Essential Business Information (Agency)
            'name' => ['required', 'string', 'max:255', 'unique:agencies,name'],
            'license_number' => ['nullable', 'string', 'max:255', 'unique:agencies,license_number'],
            'license_photo_front' => ['nullable', 'image', 'max:5120'],
            'license_photo_back' => ['nullable', 'image', 'max:5120'],
            'description' => ['nullable', 'string', 'max:1000'],
            'established_at' => ['nullable', 'date'],
            'business_email' => ['nullable', 'email', 'max:255', 'different:email'],
            'business_phone' => ['nullable', 'string', 'max:255'],
            'contact_person' => ['nullable', 'array'],
            'contact_person.name' => ['nullable', 'string', 'max:255'],
            'contact_person.phone' => ['nullable', 'string', 'max:255'],
            'contact_person.email' => ['nullable', 'email', 'max:255'],
            'contact_person.facebook' => ['nullable', 'string', 'max:255'],

            // Step 2: Address (Agency)
            'address' => ['required'], // Accept as string or array, will be normalized below

            // Step 3: Other Information (Agency)
            'website' => ['nullable', 'string', 'max:255'],
            'facebook_page' => ['nullable', 'string', 'max:255'],
            'placement_fee' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'show_fee_publicly' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            // User
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',

            // Agency
            'name.required' => 'Agency name is required.',
            'name.unique' => 'This agency name is already taken.',
            'license_number.unique' => 'This license number is already registered.',
            'license_photo.image' => 'License photo must be an image file.',
            'license_photo.max' => 'License photo must not be larger than 5MB.',
            'description.max' => 'Description cannot exceed 1000 characters.',
            'business_email.email' => 'Please enter a valid business email.',
            'business_email.different' => 'Business email must be different from login email.',
            'contact_person.array' => 'Contact person must be an array.',
            'contact_person.name.max' => 'Contact person name cannot exceed 255 characters.',
            'contact_person.phone.max' => 'Contact person phone cannot exceed 255 characters.',
            'contact_person.email.email' => 'Contact person email must be valid.',
            'placement_fee.numeric' => 'Placement fee must be a valid number.',
            'placement_fee.min' => 'Placement fee cannot be negative.',
            'placement_fee.max' => 'Placement fee cannot exceed ₱999,999.99.',

            // Address
            'address.required' => 'Business address is required.',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Set default values
        $this->merge([
            'show_fee_publicly' => $this->show_fee_publicly ?? false,
        ]);

        // Normalize address to array (like EmployerRegisterRequest)
        if (isset($this->address) && is_string($this->address)) {
            $decoded = json_decode($this->address, true);
            if (is_array($decoded)) {
                $this->merge(['address' => $decoded]);
            } else {
                $this->merge([
                    'address' => [
                        'street' => $this->address,
                        'barangay' => '',
                        'city' => '',
                        'province' => '',
                    ]
                ]);
            }
        }
    }

    /**
     * Get validated data for User model.
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

    /**
     * Get validated data for Profile model.
     */
    public function getProfileData(): array
    {
        $validated = $this->validated();

        return [
            'first_name' => $validated['contact_person']['name'] ?? null,
            'phone_number' => $validated['contact_person']['phone'] ?? null,
            'address' => $validated['address'],
            'is_phone_private' => false,
            'is_address_private' => false,
        ];
    }

    /**
     * Get validated data for Agency model.
     */
    public function getAgencyData(): array
    {
        $validated = $this->validated();

        return [
            'name' => $validated['name'],
            'license_number' => $validated['license_number'] ?? null,
            'license_photo_front' => $validated['license_photo_front'] ?? null,
            'license_photo_back' => $validated['license_photo_back'] ?? null,
            'description' => $validated['description'] ?? null,
            'established_at' => $validated['established_at'] ?? null,
            'business_email' => $validated['business_email'] ?? null,
            'business_phone' => $validated['business_phone'] ?? null,
            'contact_person' => $validated['contact_person'] ?? null,
            'address' => $validated['address'] ?? null,
            'website' => $validated['website'] ?? null,
            'facebook_page' => $validated['facebook_page'] ?? null,
            'placement_fee' => $validated['placement_fee'] ?? null,
            'show_fee_publicly' => $validated['show_fee_publicly'] ?? false,
            'status' => 'pending_verification',
            'is_verified' => false,
            'is_archived' => false,
        ];
    }
}
