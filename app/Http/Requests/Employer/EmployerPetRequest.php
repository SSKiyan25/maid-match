<?php

namespace App\Http\Requests\Employer;

use App\Models\EmployerPet;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployerPetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only employers can manage their pets
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
     *
     * @return array<string, string>
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
     * Get custom attribute names for validation errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'type' => 'pet type',
            'name' => 'pet name',
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

        if ($this->has('type')) {
            $data['type'] = strtolower(trim($this->type));
        }

        if ($this->has('name')) {
            $data['name'] = trim($this->name) ?: null;
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
                $validator->errors()->add('name', 'Pet name cannot be empty or just spaces.');
            }

            // Custom validation: Photo URL format check
            if ($this->photo_url && !filter_var($this->photo_url, FILTER_VALIDATE_URL)) {
                $validator->errors()->add('photo_url', 'Photo URL must be a valid URL.');
            }

            // Custom validation: Check for duplicate pet names for the same employer
            if ($this->name && auth()->user()->hasRole('employer')) {
                $employerId = auth()->user()->employer->id;
                $petId = $this->route('pet')?->id; // For updates

                $duplicateExists = EmployerPet::where('employer_id', $employerId)
                    ->where('name', $this->name)
                    ->where('type', $this->type)
                    ->when($petId, fn($query) => $query->where('id', '!=', $petId))
                    ->where('is_archived', false)
                    ->exists();

                if ($duplicateExists) {
                    $validator->errors()->add('name', 'You already have a ' . $this->type . ' named "' . $this->name . '".');
                }
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

    /**
     * Get available pet types for frontend.
     */
    public static function getAvailablePetTypes(): array
    {
        return EmployerPet::PET_TYPES;
    }
}