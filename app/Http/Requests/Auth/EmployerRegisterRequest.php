<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

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

            // Profile fields (required for employer registration)
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],

            // Basic employer info (required)
            'family_size' => ['required', 'integer', 'min:1', 'max:20'],

            // Optional employer info
            'household_description' => ['nullable', 'string', 'max:1000'],
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
            'family_size.required' => 'Family size is required.',
            'family_size.min' => 'Family size must be at least 1.',
            'family_size.max' => 'Family size cannot exceed 20.',
        ];
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
                'address' => $validated['address'] ?? null,
            ],
            'employer' => [
                'family_size' => $validated['family_size'],
                'household_description' => $validated['household_description'] ?? null,
                'status' => 'looking',
            ],
        ];
    }
}
