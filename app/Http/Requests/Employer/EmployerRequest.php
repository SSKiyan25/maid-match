<?php

namespace App\Http\Requests\Employer;

use App\Models\Employer\EmployerPet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployerPetRequest extends FormRequest
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
            'type' => ['required', 'string', Rule::in(array_keys(EmployerPet::PET_TYPES))],
            'name' => ['nullable', 'string', 'max:255'],
            'photo_url' => ['nullable', 'string', 'max:500'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // For updates, make type optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['type'] = ['sometimes', 'string', Rule::in(array_keys(EmployerPet::PET_TYPES))];
        }

        return $rules;
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Pet type is required.',
            'type.in' => 'Please select a valid pet type.',
            'name.max' => 'Pet name cannot exceed 255 characters.',
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
