<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployerRegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow anyone to register as employer (public registration)
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // User account fields
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required'],

            // Profile fields (required for employer registration)
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'is_phone_private' => ['boolean'],
            'address' => ['nullable', 'string', 'max:500'],
            'is_address_private' => ['boolean'],

            // Basic employer info (required)
            'family_size' => ['required', 'integer', 'min:1', 'max:20'],

            // Optional employer info
            'household_description' => ['nullable', 'string', 'max:1000'],
            'maid_preferences' => ['nullable', 'array'],

            // Children (optional) - name is nullable, only age is required when adding children
            'children' => ['nullable', 'array', 'max:10'],
            'children.*.name' => ['nullable', 'string', 'max:255'],
            'children.*.age' => ['required_with:children', 'integer', 'min:0', 'max:25'],
            'children.*.photo_url' => ['nullable', 'url', 'max:255'],

            // Pets (optional) - name is nullable, but at least type should be provided when adding pets
            'pets' => ['nullable', 'array', 'max:10'],
            'pets.*.type' => ['required_with:pets', 'string', 'max:100'],
            'pets.*.name' => ['nullable', 'string', 'max:255'],
            'pets.*.photo_url' => ['nullable', 'url', 'max:255'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
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

            // Employer info messages
            'family_size.required' => 'Family size is required.',
            'family_size.min' => 'Family size must be at least 1.',
            'family_size.max' => 'Family size cannot exceed 20.',
            'household_description.max' => 'Household description cannot exceed 1000 characters.',

            // Children messages
            'children.max' => 'You cannot add more than 10 children.',
            'children.*.name.max' => 'Child name cannot exceed 255 characters.',
            'children.*.age.required_with' => 'Child age is required when adding children.',
            'children.*.age.min' => 'Child age cannot be negative.',
            'children.*.age.max' => 'Child age cannot exceed 25.',
            'children.*.photo_url.url' => 'Photo URL must be a valid URL.',

            // Pets messages
            'pets.max' => 'You cannot add more than 10 pets.',
            'pets.*.type.required_with' => 'Pet type is required when adding pets.',
            'pets.*.type.max' => 'Pet type cannot exceed 100 characters.',
            'pets.*.name.max' => 'Pet name cannot exceed 255 characters.',
            'pets.*.photo_url.url' => 'Photo URL must be a valid URL.',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     *
     * @return array<string, string>
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
            'family_size' => 'family size',
            'household_description' => 'household description',
            'maid_preferences' => 'maid preferences',
            'children' => 'children',
            'pets' => 'pets',
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

        // Clean employer info
        if ($this->has('family_size')) {
            $data['family_size'] = is_numeric($this->family_size) ? (int) $this->family_size : null;
        }

        if ($this->has('household_description')) {
            $data['household_description'] = trim($this->household_description) ?: null;
        }

        // Clean children data - only keep entries with at least age
        if ($this->has('children') && is_array($this->children)) {
            $children = [];
            foreach ($this->children as $child) {
                if (isset($child['age']) && is_numeric($child['age'])) {
                    $children[] = [
                        'name' => isset($child['name']) ? (trim($child['name']) ?: null) : null,
                        'age' => (int) $child['age'],
                        'photo_url' => isset($child['photo_url']) ? (trim($child['photo_url']) ?: null) : null,
                    ];
                }
            }
            $data['children'] = $children;
        }

        // Clean pets data - only keep entries with at least type
        if ($this->has('pets') && is_array($this->pets)) {
            $pets = [];
            foreach ($this->pets as $pet) {
                if (!empty($pet['type'])) {
                    $pets[] = [
                        'type' => trim($pet['type']),
                        'name' => isset($pet['name']) ? (trim($pet['name']) ?: null) : null,
                        'photo_url' => isset($pet['photo_url']) ? (trim($pet['photo_url']) ?: null) : null,
                    ];
                }
            }
            $data['pets'] = $pets;
        }

        $this->merge($data);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validate phone number format (Philippine mobile)
            if ($this->phone_number) {
                $number = preg_replace('/[^\d+]/', '', $this->phone_number);
                if (!preg_match('/^(09\d{9}|\+639\d{9}|63\d{10})$/', $number)) {
                    $validator->errors()->add('phone_number', 'Please provide a valid Philippine mobile number (09xxxxxxxxx or +639xxxxxxxxx).');
                }
            }

            // Validate text fields are not just spaces
            $textFields = ['first_name', 'last_name'];
            foreach ($textFields as $field) {
                if ($this->has($field) && !trim($this->$field)) {
                    $validator->errors()->add($field, ucfirst(str_replace('_', ' ', $field)) . ' cannot be empty or just spaces.');
                }
            }

            // Validate children data and only check if name is not just spaces when provided
            if ($this->children) {
                foreach ($this->children as $index => $child) {
                    if (!empty($child['name']) && !trim($child['name'])) {
                        $validator->errors()->add("children.{$index}.name", 'Child name cannot be empty or just spaces.');
                    }
                }
            }

            // Validate pets data and only check if name is not just spaces when provided
            if ($this->pets) {
                foreach ($this->pets as $index => $pet) {
                    if (!empty($pet['name']) && !trim($pet['name'])) {
                        $validator->errors()->add("pets.{$index}.name", 'Pet name cannot be empty or just spaces.');
                    }
                    if (!empty($pet['type']) && !trim($pet['type'])) {
                        $validator->errors()->add("pets.{$index}.type", 'Pet type cannot be empty or just spaces.');
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
            'employer' => [
                'family_size' => $validated['family_size'],
                'household_description' => $validated['household_description'] ?? null,
                'maid_preferences' => $validated['maid_preferences'] ?? null,
                'status' => 'looking_for_maid',
                'is_verified' => false,
                'is_archived' => false,
            ],
            'children' => $validated['children'] ?? [],
            'pets' => $validated['pets'] ?? [],
        ];
    }

    /**
     * Get available options for frontend forms.
     */
    public static function getFormOptions(): array
    {
        return [
            'pet_types' => [
                'dog' => 'Dog',
                'cat' => 'Cat',
                'bird' => 'Bird',
                'fish' => 'Fish',
                'rabbit' => 'Rabbit',
                'hamster' => 'Hamster',
                'other' => 'Other',
            ],
            'maid_preferences_options' => [
                'experience_years' => 'Minimum years of experience',
                'age_range' => 'Preferred age range',
                'skills' => 'Required skills',
                'languages' => 'Languages spoken',
                'live_in' => 'Live-in arrangement',
                'start_date' => 'Preferred start date',
            ],
            'registration_tips' => [
                'Provide accurate family information for better maid matching',
                'Include children details to find maids experienced with kids',
                'Mention pets so maids know what to expect',
                'Complete household description helps maids understand your needs',
                'You can update your preferences anytime after registration',
            ],
        ];
    }
}
