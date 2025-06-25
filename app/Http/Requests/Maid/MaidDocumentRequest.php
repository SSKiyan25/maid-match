<?php

namespace App\Http\Requests\Maid;

use App\Models\Maid\MaidDocument;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MaidDocumentRequest extends FormRequest
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
        $rules = [
            'type' => ['required', 'string', Rule::in(array_keys(MaidDocument::DOCUMENT_TYPES))],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // File upload validation
        if ($this->hasFile('document')) {
            $rules['document'] = [
                'required',
                'file',
                'mimes:pdf,jpg,jpeg,png,doc,docx',
                'max:10240', // 10MB
            ];
        } else {
            $rules['url'] = ['required', 'string', 'max:500'];
        }

        return $rules;
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Document type is required.',
            'type.in' => 'Please select a valid document type.',
            'title.required' => 'Document title is required.',
            'title.max' => 'Document title cannot exceed 255 characters.',
            'url.required' => 'Document URL is required.',
            'description.max' => 'Description cannot exceed 1000 characters.',
            'document.required' => 'Please select a file to upload.',
            'document.mimes' => 'File must be PDF, image, or Word document.',
            'document.max' => 'File size cannot exceed 10MB.',
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
