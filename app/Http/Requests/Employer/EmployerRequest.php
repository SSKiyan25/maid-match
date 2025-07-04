<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;

class EmployerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() &&
            (auth()->user()->hasRole('employer') || auth()->user()->hasRole('admin'));
    }

    public function rules(): array
    {
        return [
            'household_description' => ['nullable', 'string', 'max:1000'],
            'family_size' => ['nullable', 'integer', 'min:1'],
            'has_children' => ['boolean'],
            'has_pets' => ['boolean'],
            'status' => ['required', 'string', 'in:active,looking,fulfilled'],
            'maid_preferences' => ['nullable', 'array'],
            'is_verified' => ['boolean'],
            'is_archived' => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'household_description.max' => 'Household description cannot exceed 1000 characters.',
            'family_size.integer' => 'Family size must be a number.',
            'family_size.min' => 'Family size must be at least 1.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be one of: active, looking, or fulfilled.',
            'maid_preferences.array' => 'Maid preferences must be an array.',
        ];
    }
}
