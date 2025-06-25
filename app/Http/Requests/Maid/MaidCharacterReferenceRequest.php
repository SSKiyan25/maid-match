<?php

namespace App\Http\Requests\Maid;

use App\Models\Maid\MaidCharacterReference;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MaidCharacterReferenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() &&
            (auth()->user()->hasRole('maid') || auth()->user()->hasRole('admin'));
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'relationship' => ['required', 'string', Rule::in(array_keys(MaidCharacterReference::RELATIONSHIP_TYPES))],
            'notes' => ['nullable', 'string', 'max:1000'],
            'verify_status' => ['sometimes', 'string', Rule::in(array_keys(MaidCharacterReference::VERIFY_STATUSES))],
            'is_archived' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Reference name is required.',
            'name.max' => 'Reference name cannot exceed 255 characters.',
            'contact_number.max' => 'Contact number cannot exceed 20 characters.',
            'relationship.required' => 'Relationship type is required.',
            'relationship.in' => 'Please select a valid relationship type.',
            'verify_status.in' => 'Please select a valid verification status.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
        ];
    }

    /**
     * Get validated data with maid_id.
     */
    public function validatedWithMaid(): array
    {
        $validated = $this->validated();

        if (auth()->user()->hasRole('maid')) {
            $validated['maid_id'] = auth()->user()->maid->id;
        }

        return $validated;
    }
}
