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
        return auth()->check() &&
            (auth()->user()->hasRole('employer') || auth()->user()->hasRole('admin'));
    }

    /**
     * Get the validation rules that apply to the request.
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
     * Get validated data with employer_id automatically set.
     */
    public function validatedWithEmployer(): array
    {
        $validated = $this->validated();

        if (auth()->user()->hasRole('employer')) {
            $validated['employer_id'] = auth()->user()->employer->id;
        }

        return $validated;
    }
}
