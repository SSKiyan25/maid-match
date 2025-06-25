<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // User fields
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],

            // Profile fields
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'is_phone_private' => ['boolean'],
            'address' => ['nullable', 'string', 'max:500'],
            'is_address_private' => ['boolean'],
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
            'email.unique' => 'This email address is already taken.',
            'first_name.required' => 'First name is required.',
            'first_name.max' => 'First name cannot exceed 255 characters.',
            'last_name.required' => 'Last name is required.',
            'last_name.max' => 'Last name cannot exceed 255 characters.',
            'phone_number.max' => 'Phone number cannot exceed 20 characters.',
            'address.max' => 'Address cannot exceed 500 characters.',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'first_name' => 'first name',
            'last_name' => 'last name',
            'phone_number' => 'phone number',
            'is_phone_private' => 'phone privacy setting',
            'address' => 'address',
            'is_address_private' => 'address privacy setting',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        // Clean user fields
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

        // Convert boolean values
        foreach (['is_phone_private', 'is_address_private'] as $field) {
            if ($this->has($field)) {
                $data[$field] = filter_var($this->$field, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE) ?? false;
            }
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
        });
    }

    /**
     * Get data organized by model.
     */
    public function getOrganizedData(): array
    {
        $validated = $this->validated();

        return [
            'user' => [
                'email' => $validated['email'],
            ],
            'profile' => [
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'phone_number' => $validated['phone_number'] ?? null,
                'is_phone_private' => $validated['is_phone_private'] ?? false,
                'address' => $validated['address'] ?? null,
                'is_address_private' => $validated['is_address_private'] ?? false,
            ],
        ];
    }
}
