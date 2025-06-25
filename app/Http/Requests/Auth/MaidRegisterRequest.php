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
            'address' => ['nullable', 'string', 'max:500'],

            // Basic maid info
            'bio' => ['nullable', 'string', 'max:1000'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'marital_status' => ['nullable', 'string', Rule::in(['single', 'married', 'divorced', 'widowed'])],
            'has_children' => ['nullable', 'boolean'],
            'expected_salary' => ['nullable', 'numeric', 'min:0'],
            'is_willing_to_relocate' => ['nullable', 'boolean'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:50'],

            // Arrays
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', 'max:100'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:50'],
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
            'expected_salary.min' => 'Expected salary cannot be negative.',
            'years_experience.max' => 'Years of experience cannot exceed 50.',
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
            'maid' => [
                'bio' => $validated['bio'] ?? null,
                'skills' => $validated['skills'] ?? [],
                'nationality' => $validated['nationality'] ?? null,
                'languages' => $validated['languages'] ?? [],
                'marital_status' => $validated['marital_status'] ?? null,
                'has_children' => $validated['has_children'] ?? false,
                'expected_salary' => $validated['expected_salary'] ?? null,
                'is_willing_to_relocate' => $validated['is_willing_to_relocate'] ?? false,
                'years_experience' => $validated['years_experience'] ?? 0,
                'status' => 'available',
            ],
        ];
    }
}
