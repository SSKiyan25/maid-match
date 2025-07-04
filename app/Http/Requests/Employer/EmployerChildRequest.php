<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;

class EmployerChildRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() &&
            (auth()->user()->hasRole('employer') || auth()->user()->hasRole('admin'));
    }

    public function rules(): array
    {
        $rules = [
            'name' => ['nullable', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'photo_url' => ['nullable', 'image', 'max:5120'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // For updates, make birth_date optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['birth_date'] = ['sometimes', 'date'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'birth_date.required' => 'Birth date is required.',
            'birth_date.date' => 'Birth date must be a valid date.',
            'name.max' => 'Name cannot exceed 255 characters.',
            'photo_url.image' => 'Photo must be an image file (jpeg, png, bmp, gif, or svg).',
            'photo_url.max' => 'Photo must not be larger than 5MB.',
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
