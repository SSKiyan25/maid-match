<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;

class EmployerChildRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only employers can manage their children
        return auth()->check() &&
            (auth()->user()->hasRole('employer') || auth()->user()->hasRole('admin'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['nullable', 'string', 'max:255'],
            'age' => ['required', 'integer', 'min:0', 'max:50'],
            'photo_url' => ['nullable', 'string', 'max:500'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // For updates, make some fields optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['age'] = ['sometimes', 'integer', 'min:0', 'max:50'];
        }

        return $rules;
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'age.required' => 'Child age is required.',
            'age.integer' => 'Age must be a number.',
            'age.min' => 'Age cannot be negative.',
            'age.max' => 'Age cannot exceed 50 years.',
            'name.max' => 'Name cannot exceed 255 characters.',
            'photo_url.max' => 'Photo URL cannot exceed 500 characters.',
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
            'name' => 'child name',
            'age' => 'child age',
            'photo_url' => 'photo URL',
            'is_archived' => 'archive status',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Clean up the data before validation
        $data = [];

        if ($this->has('name')) {
            $data['name'] = trim($this->name) ?: null;
        }

        if ($this->has('age')) {
            $data['age'] = (int) $this->age;
        }

        if ($this->has('photo_url')) {
            $data['photo_url'] = trim($this->photo_url) ?: null;
        }

        if ($this->has('is_archived')) {
            $data['is_archived'] = filter_var($this->is_archived, FILTER_VALIDATE_BOOLEAN);
        }

        $this->merge($data);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Custom validation: If name is provided, it should not be just spaces
            if ($this->name && !trim($this->name)) {
                $validator->errors()->add('name', 'Child name cannot be empty or just spaces.');
            }

            // Custom validation: Photo URL format check
            if ($this->photo_url && !filter_var($this->photo_url, FILTER_VALIDATE_URL)) {
                $validator->errors()->add('photo_url', 'Photo URL must be a valid URL.');
            }

            // For employers with active job postings, validate child age makes sense
            if ($this->age !== null && ($this->age < 0 || $this->age > 50)) {
                $validator->errors()->add('age', 'Please provide a realistic age for the child.');
            }
        });
    }

    /**
     * Get validated data with employer_id automatically set.
     */
    public function validatedWithEmployer(): array
    {
        $validated = $this->validated();

        // Automatically set the employer_id from the authenticated user
        if (auth()->user()->hasRole('employer')) {
            $validated['employer_id'] = auth()->user()->employer->id;
        }

        return $validated;
    }
}