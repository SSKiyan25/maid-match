<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MaidRegisterRequest extends FormRequest
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

            // Profile fields (required for maid registration)
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'is_phone_private' => ['boolean'],
            'address' => ['nullable', 'string', 'max:500'],
            'is_address_private' => ['boolean'],

            // Basic maid info from the maids table
            'bio' => ['nullable', 'string', 'max:1000'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'marital_status' => ['nullable', 'string', Rule::in(['single', 'married', 'divorced', 'widowed'])],
            'has_children' => ['nullable', 'boolean'],
            'expected_salary' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'is_willing_to_relocate' => ['nullable', 'boolean'],
            'preferred_accommodation' => ['nullable', 'string', 'max:255'],
            'earliest_start_date' => ['nullable', 'date', 'after_or_equal:today'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:50'],

            // Skills and languages (JSON fields)
            'skills' => ['nullable', 'array', 'max:20'],
            'skills.*' => ['string', 'max:100'],
            'languages' => ['nullable', 'array', 'max:10'],
            'languages.*' => ['string', 'max:50'],

            // Availability schedule (JSON field)
            'availability_schedule' => ['nullable', 'array'],

            // Emergency contact
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],

            // Social media (JSON field)
            'social_media_links' => ['nullable', 'array'],
            'social_media_links.facebook' => ['nullable', 'url', 'max:255'],
            'social_media_links.instagram' => ['nullable', 'url', 'max:255'],
            'social_media_links.linkedin' => ['nullable', 'url', 'max:255'],

            // Character references (only if you have this table)
            'character_references' => ['nullable', 'array', 'max:5'],
            'character_references.*.name' => ['required_with:character_references', 'string', 'max:255'],
            'character_references.*.contact_number' => ['nullable', 'string', 'max:20'],
            'character_references.*.relationship' => ['required_with:character_references', 'string', 'max:100'],
            'character_references.*.notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            // User account messages
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password_confirmation.required' => 'Please confirm your password.',

            // Profile messages
            'first_name.required' => 'First name is required.',
            'first_name.max' => 'First name cannot exceed 255 characters.',
            'last_name.required' => 'Last name is required.',
            'last_name.max' => 'Last name cannot exceed 255 characters.',
            'phone_number.max' => 'Phone number cannot exceed 20 characters.',
            'address.max' => 'Address cannot exceed 500 characters.',

            // Maid info messages
            'bio.max' => 'Bio cannot exceed 1000 characters.',
            'nationality.max' => 'Nationality cannot exceed 100 characters.',
            'marital_status.in' => 'Please select a valid marital status.',
            'years_experience.min' => 'Years of experience cannot be negative.',
            'years_experience.max' => 'Years of experience cannot exceed 50.',
            'expected_salary.numeric' => 'Expected salary must be a valid number.',
            'expected_salary.min' => 'Expected salary cannot be negative.',
            'expected_salary.max' => 'Expected salary cannot exceed ₱999,999.99.',
            'earliest_start_date.after_or_equal' => 'Start date cannot be in the past.',

            // Skills and languages messages
            'skills.max' => 'You cannot select more than 20 skills.',
            'languages.max' => 'You cannot add more than 10 languages.',
            'languages.*.max' => 'Language name cannot exceed 50 characters.',

            // Emergency contact messages
            'emergency_contact_name.max' => 'Emergency contact name cannot exceed 255 characters.',
            'emergency_contact_phone.max' => 'Emergency contact phone cannot exceed 20 characters.',

            // Social media messages
            'social_media_links.facebook.url' => 'Facebook URL must be a valid URL.',
            'social_media_links.instagram.url' => 'Instagram URL must be a valid URL.',
            'social_media_links.linkedin.url' => 'LinkedIn URL must be a valid URL.',

            // Character reference messages
            'character_references.max' => 'You cannot add more than 5 character references.',
            'character_references.*.name.required_with' => 'Reference name is required.',
            'character_references.*.name.max' => 'Reference name cannot exceed 255 characters.',
            'character_references.*.contact_number.max' => 'Contact number cannot exceed 20 characters.',
            'character_references.*.relationship.required_with' => 'Relationship type is required.',
            'character_references.*.notes.max' => 'Notes cannot exceed 500 characters.',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'email' => 'email address',
            'password' => 'password',
            'password_confirmation' => 'password confirmation',
            'first_name' => 'first name',
            'last_name' => 'last name',
            'phone_number' => 'phone number',
            'is_phone_private' => 'phone privacy setting',
            'address' => 'address',
            'is_address_private' => 'address privacy setting',
            'bio' => 'bio',
            'nationality' => 'nationality',
            'marital_status' => 'marital status',
            'expected_salary' => 'expected salary',
            'years_experience' => 'years of experience',
            'skills' => 'skills',
            'languages' => 'languages',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        // Clean user account fields
        if ($this->has('email')) {
            $data['email'] = strtolower(trim($this->email));
        }

        // Clean profile fields
        if ($this->has('first_name')) {
            $data['first_name'] = trim($this->first_name);
        }

        if ($this->has('last_name')) {
            $data['last_name'] = trim($this->last_name);
        }

        if ($this->has('phone_number')) {
            $cleanPhone = preg_replace('/[^\d+\-\s]/', '', $this->phone_number);
            $data['phone_number'] = trim($cleanPhone) ?: null;
        }

        if ($this->has('address')) {
            $data['address'] = trim($this->address) ?: null;
        }

        // Convert boolean values for profile
        foreach (['is_phone_private', 'is_address_private'] as $field) {
            if ($this->has($field)) {
                $data[$field] = filter_var($this->$field, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
            }
        }

        // Clean maid profile fields
        if ($this->has('bio')) {
            $data['bio'] = trim($this->bio) ?: null;
        }

        if ($this->has('nationality')) {
            $data['nationality'] = trim($this->nationality) ?: null;
        }

        if ($this->has('marital_status')) {
            $data['marital_status'] = strtolower(trim($this->marital_status));
        }

        // Convert boolean values for maid
        foreach (['has_children', 'is_willing_to_relocate'] as $field) {
            if ($this->has($field)) {
                $data[$field] = filter_var($this->$field, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            }
        }

        // Convert numeric values
        if ($this->has('years_experience')) {
            $data['years_experience'] = is_numeric($this->years_experience) ? (int) $this->years_experience : null;
        }

        if ($this->has('expected_salary')) {
            $data['expected_salary'] = is_numeric($this->expected_salary) ? (float) $this->expected_salary : null;
        }

        // Clean emergency contact
        if ($this->has('emergency_contact_name')) {
            $data['emergency_contact_name'] = trim($this->emergency_contact_name) ?: null;
        }

        if ($this->has('emergency_contact_phone')) {
            $cleanPhone = preg_replace('/[^\d+]/', '', $this->emergency_contact_phone);
            $data['emergency_contact_phone'] = $cleanPhone ?: null;
        }

        // Clean arrays
        if ($this->has('skills')) {
            $data['skills'] = is_array($this->skills) ? array_filter($this->skills) : [];
        }

        if ($this->has('languages')) {
            $data['languages'] = is_array($this->languages) ? array_filter($this->languages) : [];
        }

        // Clean social media links
        if ($this->has('social_media_links')) {
            $socialLinks = [];
            foreach ($this->social_media_links as $platform => $url) {
                $cleanUrl = trim($url);
                if ($cleanUrl) {
                    $socialLinks[$platform] = $cleanUrl;
                }
            }
            $data['social_media_links'] = !empty($socialLinks) ? $socialLinks : null;
        }

        // Clean character references
        if ($this->has('character_references') && is_array($this->character_references)) {
            $references = [];
            foreach ($this->character_references as $reference) {
                if (!empty($reference['name'])) {
                    $cleanPhone = isset($reference['contact_number']) ?
                        preg_replace('/[^\d+]/', '', $reference['contact_number']) : null;

                    $references[] = [
                        'name' => trim($reference['name']),
                        'contact_number' => $cleanPhone ?: null,
                        'relationship' => trim($reference['relationship'] ?? ''),
                        'notes' => trim($reference['notes'] ?? '') ?: null,
                    ];
                }
            }
            $data['character_references'] = $references;
        }

        $this->merge($data);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validate phone numbers format (Philippine mobile)
            $phoneFields = ['phone_number', 'emergency_contact_phone'];
            foreach ($phoneFields as $field) {
                if ($this->$field) {
                    $number = preg_replace('/[^\d+]/', '', $this->$field);
                    if (!preg_match('/^(09\d{9}|\+639\d{9}|63\d{10})$/', $number)) {
                        $validator->errors()->add($field, 'Please provide a valid Philippine mobile number (09xxxxxxxxx or +639xxxxxxxxx).');
                    }
                }
            }

            // Validate text fields are not just spaces
            $textFields = ['first_name', 'last_name'];
            foreach ($textFields as $field) {
                if ($this->has($field) && !trim($this->$field)) {
                    $validator->errors()->add($field, ucfirst(str_replace('_', ' ', $field)) . ' cannot be empty or just spaces.');
                }
            }

            // Validate character references
            if ($this->character_references) {
                foreach ($this->character_references as $index => $reference) {
                    if (!empty($reference['name']) && !trim($reference['name'])) {
                        $validator->errors()->add("character_references.{$index}.name", 'Reference name cannot be empty or just spaces.');
                    }
                    if (!empty($reference['relationship']) && !trim($reference['relationship'])) {
                        $validator->errors()->add("character_references.{$index}.relationship", 'Relationship cannot be empty or just spaces.');
                    }
                }
            }
        });
    }

    /**
     * Get registration data organized by table.
     */
    public function getOrganizedData(): array
    {
        $validated = $this->validated();

        return [
            'user' => [
                'email' => $validated['email'],
                'password' => $validated['password'],
            ],
            'profile' => [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone_number' => $validated['phone_number'] ?? null,
                'is_phone_private' => $validated['is_phone_private'] ?? false,
                'address' => $validated['address'] ?? null,
                'is_address_private' => $validated['is_address_private'] ?? false,
                'is_archived' => false,
            ],
            'maid' => [
                'bio' => $validated['bio'] ?? null,
                'skills' => $validated['skills'] ?? [],
                'nationality' => $validated['nationality'] ?? null,
                'languages' => $validated['languages'] ?? [],
                'social_media_links' => $validated['social_media_links'] ?? null,
                'marital_status' => $validated['marital_status'] ?? null,
                'has_children' => $validated['has_children'] ?? false,
                'expected_salary' => $validated['expected_salary'] ?? null,
                'is_willing_to_relocate' => $validated['is_willing_to_relocate'] ?? false,
                'preferred_accommodation' => $validated['preferred_accommodation'] ?? null,
                'earliest_start_date' => $validated['earliest_start_date'] ?? null,
                'years_experience' => $validated['years_experience'] ?? 0,
                'status' => 'available',
                'availability_schedule' => $validated['availability_schedule'] ?? null,
                'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
                'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
                'is_verified' => false,
                'is_archived' => false,
            ],
            'character_references' => $validated['character_references'] ?? [],
        ];
    }

    /**
     * Get available options for frontend forms.
     */
    public static function getFormOptions(): array
    {
        return [
            'marital_statuses' => [
                'single' => 'Single',
                'married' => 'Married',
                'divorced' => 'Divorced',
                'widowed' => 'Widowed',
            ],
            'accommodation_types' => [
                'live_in' => 'Live-in',
                'live_out' => 'Live-out',
                'either' => 'Either',
            ],
            'relationship_types' => [
                'former_employer' => 'Former Employer',
                'family_friend' => 'Family Friend',
                'neighbor' => 'Neighbor',
                'colleague' => 'Colleague',
                'teacher' => 'Teacher',
                'community_leader' => 'Community Leader',
                'other' => 'Other',
            ],
            'common_skills' => [
                'cleaning' => 'House Cleaning',
                'cooking' => 'Cooking',
                'childcare' => 'Childcare',
                'elderly_care' => 'Elderly Care',
                'laundry' => 'Laundry',
                'ironing' => 'Ironing',
                'pet_care' => 'Pet Care',
                'gardening' => 'Gardening',
                'driving' => 'Driving',
            ],
            'registration_tips' => [
                'Complete as much information as possible for better job matches',
                'Add relevant skills to showcase your abilities',
                'Character references help build trust with employers',
                'You can always update your profile later',
                'A complete profile increases your chances of getting hired',
            ],
        ];
    }
}
