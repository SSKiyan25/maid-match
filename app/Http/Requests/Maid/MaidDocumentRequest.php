<?php

namespace App\Http\Requests\Maid;

use App\Models\MaidDocument;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MaidDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only maids can manage their own documents, or admins
        return auth()->check() &&
            (auth()->user()->hasRole('maid') || auth()->user()->hasRole('admin'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'type' => ['required', 'string', Rule::in(array_keys(MaidDocument::DOCUMENT_TYPES))],
            'title' => ['required', 'string', 'max:255'],
            'url' => ['required', 'string', 'max:500'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // For file uploads, validate the file instead of URL
        if ($this->hasFile('document')) {
            $rules['document'] = [
                'required',
                'file',
                'mimes:pdf,jpg,jpeg,png,gif,doc,docx',
                'max:10240', // 10MB max
            ];
            unset($rules['url']); // Remove URL validation when uploading file
        }

        // For updates, make some fields optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['type'] = ['sometimes', 'string', Rule::in(array_keys(MaidDocument::DOCUMENT_TYPES))];
            $rules['title'] = ['sometimes', 'string', 'max:255'];

            if (!$this->hasFile('document')) {
                $rules['url'] = ['sometimes', 'string', 'max:500'];
            }
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
            'type.required' => 'Document type is required.',
            'type.in' => 'Please select a valid document type.',
            'title.required' => 'Document title is required.',
            'title.max' => 'Document title cannot exceed 255 characters.',
            'url.required' => 'Document URL is required.',
            'url.max' => 'Document URL cannot exceed 500 characters.',
            'description.max' => 'Description cannot exceed 1000 characters.',
            'document.required' => 'Please select a file to upload.',
            'document.file' => 'The uploaded item must be a file.',
            'document.mimes' => 'File must be a PDF, image (JPG, PNG, GIF), or Word document.',
            'document.max' => 'File size cannot exceed 10MB.',
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
            'type' => 'document type',
            'title' => 'document title',
            'url' => 'document URL',
            'description' => 'document description',
            'document' => 'document file',
            'is_archived' => 'archive status',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        // Clean and prepare text fields
        if ($this->has('type')) {
            $data['type'] = strtolower(trim($this->type));
        }

        if ($this->has('title')) {
            $data['title'] = trim($this->title);
        }

        if ($this->has('url')) {
            $data['url'] = trim($this->url);
        }

        if ($this->has('description')) {
            $data['description'] = trim($this->description) ?: null;
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
            // Check for duplicate document type for the same maid
            if ($this->type && auth()->user()->hasRole('maid')) {
                $maidId = auth()->user()->maid->id;
                $documentId = $this->route('document')?->id; // For updates

                // Some documents can have duplicates, others cannot
                $uniqueTypes = ['id', 'passport', 'resume', 'medical'];

                if (in_array($this->type, $uniqueTypes)) {
                    $duplicateExists = MaidDocument::where('maid_id', $maidId)
                        ->where('type', $this->type)
                        ->when($documentId, fn($query) => $query->where('id', '!=', $documentId))
                        ->where('is_archived', false)
                        ->exists();

                    if ($duplicateExists) {
                        $validator->errors()->add('type', 'You already have a ' . $this->type_label . ' document uploaded.');
                    }
                }
            }

            // Validate file URL format if not uploading
            if (!$this->hasFile('document') && $this->url) {
                // Check if URL looks like a valid file path or URL
                if (!filter_var($this->url, FILTER_VALIDATE_URL) && !str_starts_with($this->url, '/')) {
                    $validator->errors()->add('url', 'Document URL must be a valid URL or file path.');
                }
            }

            // Validate title is not just spaces
            if ($this->title && !trim($this->title)) {
                $validator->errors()->add('title', 'Document title cannot be empty or just spaces.');
            }

            // Check file size for required documents (stricter limits)
            if ($this->hasFile('document') && $this->type) {
                $file = $this->file('document');
                $requiredTypes = array_keys(MaidDocument::REQUIRED_DOCUMENTS);

                if (in_array($this->type, $requiredTypes)) {
                    // Required documents should be clear and readable
                    if ($file->getSize() > 5242880) { // 5MB for required docs
                        $validator->errors()->add('document', 'Required documents should not exceed 5MB for better clarity.');
                    }
                }
            }
        });
    }

    /**
     * Get validated data with maid_id automatically set.
     */
    public function validatedWithMaid(): array
    {
        $validated = $this->validated();

        // Automatically set the maid_id from the authenticated user
        if (auth()->user()->hasRole('maid')) {
            $validated['maid_id'] = auth()->user()->maid->id;
        }

        return $validated;
    }

    /**
     * Handle file upload and return validated data with URL.
     */
    public function validatedWithFileUpload(): array
    {
        $validated = $this->validatedWithMaid();

        // Handle file upload if present
        if ($this->hasFile('document')) {
            $file = $this->file('document');
            $maidId = $validated['maid_id'];

            // Generate file path: maid-documents/maid_id/type_timestamp.extension
            $timestamp = now()->format('Y-m-d_H-i-s');
            $extension = $file->getClientOriginalExtension();
            $filename = "{$this->type}_{$timestamp}.{$extension}";
            $path = "maid-documents/{$maidId}/{$filename}";

            // Store the file
            $validated['url'] = $file->storeAs('maid-documents/' . $maidId, $filename, 'public');

            // Remove the document file from validated data
            unset($validated['document']);
        }

        return $validated;
    }

    /**
     * Get available document types for frontend.
     */
    public static function getAvailableDocumentTypes(): array
    {
        return MaidDocument::DOCUMENT_TYPES;
    }

    /**
     * Get required document types for frontend.
     */
    public static function getRequiredDocumentTypes(): array
    {
        return MaidDocument::REQUIRED_DOCUMENTS;
    }

    /**
     * Get file upload requirements.
     */
    public static function getFileRequirements(): array
    {
        return [
            'max_size' => '10MB',
            'required_max_size' => '5MB',
            'allowed_types' => [
                'pdf' => 'PDF Documents',
                'jpg' => 'JPEG Images',
                'jpeg' => 'JPEG Images',
                'png' => 'PNG Images',
                'gif' => 'GIF Images',
                'doc' => 'Word Documents',
                'docx' => 'Word Documents'
            ],
            'recommended' => 'PDF format is recommended for documents'
        ];
    }
}