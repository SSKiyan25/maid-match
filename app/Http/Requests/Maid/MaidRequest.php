<?php

namespace App\Http\Requests\Maid;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MaidRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() &&
            (auth()->user()->hasRole('maid') || auth()->user()->hasRole('admin') || auth()->user()->hasRole('agency'));
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'bio' => ['nullable', 'string', 'max:1000'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string'],
            'nationality' => ['nullable', 'string', 'max:100'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:50'],
            'marital_status' => ['nullable', 'string', Rule::in(['single', 'married', 'divorced', 'widowed'])],
            'has_children' => ['nullable', 'boolean'],
            'expected_salary' => ['nullable', 'numeric', 'min:0'],
            'is_willing_to_relocate' => ['nullable', 'boolean'],
            'preferred_accommodation' => ['nullable', 'string', Rule::in(['live_in', 'live_out', 'either'])],
            'earliest_start_date' => ['nullable', 'date'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:50'],
            'status' => ['nullable', 'string', Rule::in(['available', 'employed', 'unavailable'])],
            'availability_schedule' => ['nullable', 'array'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            'is_verified' => ['sometimes', 'boolean'],
            'is_archived' => ['sometimes', 'boolean'],

            // Agency fields
            'agency_id' => ['nullable', 'integer', 'exists:agencies,id'],
            'registration_type' => ['nullable', 'string', Rule::in(['individual', 'agency'])],
            'agency_assigned_at' => ['nullable', 'date'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'bio.max' => 'Bio cannot exceed 1000 characters.',
            'skills.*.string' => 'Each skill must be a valid text.',
            'nationality.max' => 'Nationality cannot exceed 100 characters.',
            'languages.*.max' => 'Each language cannot exceed 50 characters.',
            'marital_status.in' => 'Please select a valid marital status.',
            'expected_salary.numeric' => 'Expected salary must be a valid number.',
            'expected_salary.min' => 'Expected salary cannot be negative.',
            'preferred_accommodation.in' => 'Please select a valid accommodation preference.',
            'earliest_start_date.date' => 'Please provide a valid start date.',
            'years_experience.integer' => 'Years of experience must be a whole number.',
            'years_experience.min' => 'Years of experience cannot be negative.',
            'years_experience.max' => 'Years of experience cannot exceed 50 years.',
            'status.in' => 'Please select a valid status.',
            'emergency_contact_name.max' => 'Emergency contact name cannot exceed 255 characters.',
            'emergency_contact_phone.max' => 'Emergency contact phone cannot exceed 20 characters.',

            // Agency validation messages
            'agency_id.exists' => 'The selected agency does not exist.',
            'registration_type.in' => 'Registration type must be either individual or agency.',
            'agency_assigned_at.date' => 'Please provide a valid assignment date.',
        ];
    }

    /**
     * Get validated data with user_id and proper agency handling.
     */
    public function validatedWithUser(): array
    {
        $validated = $this->validated();

        // Set user_id based on role
        if (auth()->user()->hasRole('maid')) {
            $validated['user_id'] = auth()->id();
        }

        // Handle agency assignment logic
        if (isset($validated['agency_id']) && $validated['agency_id']) {
            $validated['registration_type'] = 'agency';
            $validated['agency_assigned_at'] = $validated['agency_assigned_at'] ?? now();
        } else {
            $validated['registration_type'] = 'individual';
            $validated['agency_id'] = null;
            $validated['agency_assigned_at'] = null;
        }

        return $validated;
    }

    /**
     * Custom validation rules for agency assignments.
     */
    protected function prepareForValidation(): void
    {
        // If agency user is creating a maid, auto-assign to their agency
        if (auth()->user()->hasRole('agency') && !$this->has('agency_id')) {
            $agency = auth()->user()->agency;
            if ($agency) {
                $this->merge([
                    'agency_id' => $agency->id,
                    'registration_type' => 'agency',
                ]);
            }
        }
    }
}
