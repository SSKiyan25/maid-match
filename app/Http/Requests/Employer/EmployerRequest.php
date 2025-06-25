<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only allow authenticated users with employer role
        return auth()->check() && (
            auth()->user()->role === 'employer' ||
            auth()->user()->role === 'admin'
        );
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'household_description' => ['nullable', 'string', 'max:1000'],
            'family_size' => ['required', 'integer', 'min:1', 'max:20'],
            'status' => ['required', Rule::in(['active', 'inactive', 'looking', 'fulfilled'])],
            'maid_preferences' => ['nullable', 'array'],
            'maid_preferences.skills' => ['nullable', 'array'],
            'maid_preferences.skills.*' => ['string', 'max:100'],
            'maid_preferences.languages' => ['nullable', 'array'],
            'maid_preferences.languages.*' => ['string', 'max:50'],
            'maid_preferences.experience_years' => ['nullable', 'integer', 'min:0', 'max:50'],
            'maid_preferences.nationality' => ['nullable', 'string', 'max:100'],
            'maid_preferences.marital_status' => ['nullable', Rule::in(['single', 'married', 'divorced', 'widowed'])],
            'maid_preferences.age_range' => ['nullable', 'array'],
            'maid_preferences.age_range.min' => ['nullable', 'integer', 'min:18', 'max:65'],
            'maid_preferences.age_range.max' => ['nullable', 'integer', 'min:18', 'max:65', 'gte:maid_preferences.age_range.min'],
            'maid_preferences.budget_range' => ['nullable', 'array'],
            'maid_preferences.budget_range.min' => ['nullable', 'numeric', 'min:0'],
            'maid_preferences.budget_range.max' => ['nullable', 'numeric', 'min:0', 'gte:maid_preferences.budget_range.min'],
        ];

        // Additional rules for update operations
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            // For updates, make some fields optional
            $rules['family_size'] = ['sometimes', 'required', 'integer', 'min:1', 'max:20'];
            $rules['status'] = ['sometimes', 'required', Rule::in(['active', 'inactive', 'looking', 'fulfilled'])];
        }

        return $rules;
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'family_size.required' => 'Please specify your family size.',
            'family_size.min' => 'Family size must be at least 1 person.',
            'family_size.max' => 'Family size cannot exceed 20 people.',
            'status.required' => 'Please select your account status.',
            'status.in' => 'Please select a valid status option.',
            'household_description.max' => 'Household description cannot exceed 1000 characters.',
            'maid_preferences.skills.*.string' => 'Each skill must be a valid text.',
            'maid_preferences.languages.*.string' => 'Each language must be a valid text.',
            'maid_preferences.experience_years.min' => 'Experience years cannot be negative.',
            'maid_preferences.experience_years.max' => 'Experience years seems too high.',
            'maid_preferences.age_range.min.min' => 'Minimum age must be at least 18.',
            'maid_preferences.age_range.max.gte' => 'Maximum age must be greater than or equal to minimum age.',
            'maid_preferences.budget_range.min.min' => 'Budget cannot be negative.',
            'maid_preferences.budget_range.max.gte' => 'Maximum budget must be greater than or equal to minimum budget.',
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'household_description' => 'household description',
            'family_size' => 'family size',
            'maid_preferences.skills' => 'preferred skills',
            'maid_preferences.languages' => 'preferred languages',
            'maid_preferences.experience_years' => 'preferred experience years',
            'maid_preferences.nationality' => 'preferred nationality',
            'maid_preferences.marital_status' => 'preferred marital status',
            'maid_preferences.age_range.min' => 'minimum preferred age',
            'maid_preferences.age_range.max' => 'maximum preferred age',
            'maid_preferences.budget_range.min' => 'minimum budget',
            'maid_preferences.budget_range.max' => 'maximum budget',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Convert string numbers to integers/floats
        if ($this->has('family_size')) {
            $this->merge([
                'family_size' => (int) $this->family_size,
            ]);
        }

        // Ensure maid_preferences is an array
        if ($this->has('maid_preferences') && is_string($this->maid_preferences)) {
            $this->merge([
                'maid_preferences' => json_decode($this->maid_preferences, true) ?? [],
            ]);
        }
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Custom validation logic
            if ($this->status === 'looking' && empty($this->maid_preferences)) {
                $validator->errors()->add(
                    'maid_preferences',
                    'Please specify your preferences when looking for a maid.'
                );
            }
        });
    }
}