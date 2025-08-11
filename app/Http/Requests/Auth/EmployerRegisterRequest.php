<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;

class EmployerRegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // User account fields
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required'],

            // Profile fields (Step 1) - Only fields that exist in Profile model
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'birth_date' => ['nullable', 'date', 'before:today'],


            // Employer fields (Step 2 & 3)
            'family_size' => ['required', 'integer', 'min:1', 'max:20'],
            'household_description' => ['nullable', 'string', 'max:1000'],
            'maid_preferences' => ['nullable', 'string'], // JSON string
            'address' => ['required', 'string', 'max:500'], // Will be converted to JSON

            // Children data (Step 4) - Optional
            'has_children' => ['boolean'],
            'children_data' => ['nullable', 'string'], // JSON string
            'children_photos.*' => ['nullable', 'image', 'max:5120'], // Child photo uploads

            // Pets data (Step 5) - Optional
            'has_pets' => ['boolean'],
            'pets_data' => ['nullable', 'string'], // JSON string
            'pets_photos.*' => ['nullable', 'image', 'max:5120'], // Pet photo uploads
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'birth_date.date' => 'Please enter a valid date of birth.',
            'birth_date.before' => 'Date of birth must be before today.',
            'address.required' => 'Address is required.',
            'family_size.required' => 'Family size is required.',
            'family_size.min' => 'Family size must be at least 1.',
            'family_size.max' => 'Family size cannot exceed 20.',
            'children_photos.*.image' => 'Child photos must be images.',
            'children_photos.*.max' => 'Child photos must not exceed 2MB.',
            'pets_photos.*.image' => 'Pet photos must be images.',
            'pets_photos.*.max' => 'Pet photos must not exceed 2MB.',
        ];
    }

    /**
     * Get registration data organized by table.
     */
    public function getOrganizedData(): array
    {
        $validated = $this->validated();

        // Handle child photo uploads
        $childPhotoUrls = [];
        if ($this->hasFile('children_photos')) {
            foreach ($this->file('children_photos') as $index => $photo) {
                if ($photo) {
                    $path = $photo->store('children_photos', 'public');
                    $childPhotoUrls[$index] = Storage::url($path);
                }
            }
        }

        // Handle pet photo uploads
        $petPhotoUrls = [];
        if ($this->hasFile('pets_photos')) {
            foreach ($this->file('pets_photos') as $index => $photo) {
                if ($photo) {
                    $path = $photo->store('pets_photos', 'public');
                    $petPhotoUrls[$index] = Storage::url($path);
                }
            }
        }

        // Parse children data if provided
        $children = [];
        if (!empty($validated['children_data'])) {
            $childrenData = json_decode($validated['children_data'], true) ?? [];
            foreach ($childrenData as $index => $child) {
                $children[] = [
                    'name' => $child['name'] ?? null,
                    'birth_date' => $child['birth_date'] ?? null,
                    'photo_url' => $childPhotoUrls[$index] ?? null,
                    'is_archived' => false,
                ];
            }
        }

        // Parse pets data if provided
        $pets = [];
        if (!empty($validated['pets_data'])) {
            $petsData = json_decode($validated['pets_data'], true) ?? [];
            foreach ($petsData as $index => $pet) {
                $pets[] = [
                    'type' => $pet['type'] ?? null,
                    'name' => $pet['name'] ?? null,
                    'photo_url' => $petPhotoUrls[$index] ?? null,
                    'is_archived' => false,
                ];
            }
        }

        // Convert address string to JSON format
        $addressJson = $this->convertAddressToJson($validated['address']);

        return [
            'user' => [
                'email' => $validated['email'],
                'password' => $validated['password'],
            ],
            'profile' => [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone_number' => $validated['phone_number'] ?? null,
                'birth_date' => $validated['birth_date'] ?? null,
                'address' => $addressJson,
                'is_phone_private' => false,
                'is_address_private' => false,
                'is_archived' => false,
                'preferred_contact_methods' => ['email'],
                'preferred_language' => 'en',
            ],
            'employer' => [
                'family_size' => $validated['family_size'],
                'household_description' => $validated['household_description'] ?? null,
                'maid_preferences' => $validated['maid_preferences'] ? json_decode($validated['maid_preferences'], true) : null,
                'has_children' => $validated['has_children'] ?? false,
                'has_pets' => $validated['has_pets'] ?? false,
                'status' => 'looking',
                'is_verified' => false,
                'is_archived' => false,
            ],
            'children' => $children,
            'pets' => $pets,
        ];
    }

    /**
     * Convert address string to JSON format for database storage
     */
    private function convertAddressToJson(string $address): array
    {
        $decoded = json_decode($address, true);
        if (is_array($decoded)) {
            return $decoded;
        }
        return [
            'street' => $address,
            'barangay' => '',
            'city' => '',
            'province' => '',
        ];
    }
}
