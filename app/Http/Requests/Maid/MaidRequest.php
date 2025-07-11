<?php

namespace App\Http\Requests\Maid;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class MaidRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() &&
            (auth()->user()->hasRole('agency') || auth()->user()->hasRole('admin'));
    }

    protected function prepareForValidation()
    {
        $booleanFields = [
            'profile.is_phone_private',
            'profile.is_address_private',
            'profile.is_archived',
            'maid.has_children',
            'maid.is_willing_to_relocate',
            'maid.is_verified',
            'maid.is_archived',
            'agency_maid.is_premium',
            'agency_maid.is_trained',
            'agency_maid.is_archived',
        ];

        $input = $this->all();

        foreach ($booleanFields as $field) {
            data_set($input, $field, filter_var(data_get($input, $field, false), FILTER_VALIDATE_BOOLEAN));
        }

        $this->replace($input);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        // Determine if this is an update (PUT/PATCH) or create (POST)
        $isUpdate = in_array($this->method(), ['PUT', 'PATCH']);
        // Try to get the maid user id for unique email rule
        $maidUserId = optional($this->route('agencyMaid'))->maid->user_id ?? null;

        return [
            // User account fields
            'user.email' => [
                'required',
                'email',
                'max:255',
                $isUpdate
                    ? Rule::unique('users', 'email')->ignore($maidUserId)
                    : 'unique:users,email',
            ],
            'user.password' => [
                $isUpdate ? 'nullable' : 'required',
                'string',
                'min:8',
                'confirmed',
            ],
            'user.password_confirmation' => [
                $isUpdate ? 'nullable' : 'required',
            ],

            // Profile fields
            'profile.first_name' => ['required', 'string', 'max:255'],
            'profile.last_name' => ['required', 'string', 'max:255'],
            'profile.phone_number' => ['nullable', 'string', 'max:20'],
            'profile.birth_date' => ['nullable', 'date', 'before:today'],
            'profile.address' => ['nullable', 'string', 'max:500'], // Will be converted to JSON
            'profile.is_phone_private' => ['nullable', 'boolean'],
            'profile.is_address_private' => ['nullable', 'boolean'],
            'profile.preferred_contact_methods' => ['nullable', 'array'],
            'profile.preferred_contact_methods.*' => ['string'],
            'profile.preferred_language' => ['nullable', 'string', 'max:10'],

            // Maid fields
            'maid.bio' => ['nullable', 'string', 'max:1000'],
            'maid.skills' => ['nullable', 'array'],
            'maid.skills.*' => ['string'],
            'maid.nationality' => ['nullable', 'string', 'max:100'],
            'maid.languages' => ['nullable', 'array'],
            'maid.languages.*' => ['string', 'max:50'],
            'maid.social_media_links' => ['nullable', 'array'],
            'maid.social_media_links.*' => ['string', 'max:255'],
            'maid.marital_status' => ['nullable', 'string', Rule::in(['single', 'married', 'divorced', 'widowed'])],
            'maid.has_children' => ['nullable', 'boolean'],
            'maid.expected_salary' => ['nullable', 'numeric', 'min:0'],
            'maid.is_willing_to_relocate' => ['nullable', 'boolean'],
            'maid.preferred_accommodation' => ['nullable', 'string', Rule::in(['live_in', 'live_out', 'either'])],
            'maid.earliest_start_date' => ['nullable', 'date', 'after_or_equal:today'],
            'maid.years_experience' => ['nullable', 'integer', 'min:0', 'max:50'],
            'maid.status' => ['nullable', 'string', Rule::in(['available', 'employed', 'unavailable'])],
            'maid.availability_schedule' => ['nullable', 'array'],
            'maid.emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'maid.emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            'maid.verification_badges' => ['nullable', 'array'],
            'maid.verification_badges.*' => ['string', 'max:255'],

            // Agency Maid fields
            'agency_maid.is_premium' => ['nullable', 'boolean'],
            'agency_maid.is_trained' => ['nullable', 'boolean'],
            'agency_maid.agency_notes' => ['nullable', 'string', 'max:1000'],
            'agency_maid.agency_fee' => ['nullable', 'numeric', 'min:0'],

            // Document uploads
            'documents' => ['nullable', 'array'],
            'documents.*.type' => ['required_with:documents', 'string', Rule::in(array_keys(\App\Models\Maid\MaidDocument::DOCUMENT_TYPES))],
            'documents.*.title' => ['required_with:documents', 'string', 'max:255'],
            // Only require file if creating or if file is present in request (new/changed)
            'documents.*.file' => [
                $isUpdate ? 'nullable' : 'required_with:documents',
                'file',
                'mimes:pdf,doc,docx,jpg,jpeg,png',
                'max:10240'
            ],
            'documents.*.description' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'user.email.required' => 'Email address is required.',
            'user.email.email' => 'Please enter a valid email address.',
            'user.email.unique' => 'This email address is already registered.',
            'user.password.required' => 'Password is required.',
            'user.password.min' => 'Password must be at least 8 characters.',
            'user.password.confirmed' => 'Password confirmation does not match.',
            'profile.first_name.required' => 'First name is required.',
            'profile.last_name.required' => 'Last name is required.',
            'profile.birth_date.date' => 'Please enter a valid date of birth.',
            'profile.birth_date.before' => 'Date of birth must be before today.',
            'maid.expected_salary.numeric' => 'Expected salary must be a valid number.',
            'maid.expected_salary.min' => 'Expected salary cannot be negative.',
            'maid.earliest_start_date.after_or_equal' => 'Start date cannot be in the past.',
            'maid.years_experience.integer' => 'Years of experience must be a whole number.',
            'maid.years_experience.min' => 'Years of experience cannot be negative.',
            'maid.years_experience.max' => 'Years of experience cannot exceed 50 years.',
            'maid.marital_status.in' => 'Please select a valid marital status.',
            'maid.preferred_accommodation.in' => 'Please select a valid accommodation preference.',
            'maid.status.in' => 'Please select a valid status.',
            'agency_maid.agency_fee.numeric' => 'Agency fee must be a valid number.',
            'agency_maid.agency_fee.min' => 'Agency fee cannot be negative.',
            'documents.*.type.required_with' => 'Document type is required.',
            'documents.*.type.in' => 'Please select a valid document type.',
            'documents.*.title.required_with' => 'Document title is required.',
            'documents.*.file.required_with' => 'Document file is required.',
            'documents.*.file.mimes' => 'Document must be a PDF, Word document, or image file.',
            'documents.*.file.max' => 'Document file must not exceed 10MB.',
        ];
    }

    /**
     * Get organized data for creating maid and related records.
     */
    public function getOrganizedData(): array
    {
        $validated = $this->validated();

        // Ensure all boolean fields are strictly boolean
        $booleanFields = [
            'profile' => ['is_phone_private', 'is_address_private', 'is_archived'],
            'maid' => ['has_children', 'is_willing_to_relocate', 'is_verified', 'is_archived'],
            'agency_maid' => ['is_premium', 'is_trained', 'is_archived'],
        ];

        foreach ($booleanFields as $section => $fields) {
            foreach ($fields as $field) {
                // If not set, default to false
                $validated[$section][$field] = isset($validated[$section][$field])
                    ? filter_var($validated[$section][$field], FILTER_VALIDATE_BOOLEAN)
                    : false;
            }
        }

        $address = null;
        if (!empty($validated['profile']['address'])) {
            $decoded = json_decode($validated['profile']['address'], true);
            $address = is_array($decoded) ? $decoded : [
                'street' => $validated['profile']['address'],
                'barangay' => '',
                'city' => '',
                'province' => '',
            ];
        }

        // Handle document uploads
        $documents = [];
        if (!empty($this->input('documents'))) {
            foreach ($this->input('documents') as $index => $documentData) {
                if ($this->hasFile("documents.$index.file")) {
                    $file = $this->file("documents.$index.file");
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('maid-documents', $filename, 'public');

                    $documents[] = [
                        'type' => $documentData['type'],
                        'title' => $documentData['title'],
                        'url' => Storage::url($path),
                        'description' => $documentData['description'] ?? null,
                        'is_archived' => false,
                    ];
                } else if (isset($documentData['url'])) {
                    // Existing document, keep its URL
                    $documents[] = [
                        'type' => $documentData['type'],
                        'title' => $documentData['title'],
                        'url' => $documentData['url'],
                        'description' => $documentData['description'] ?? null,
                        'is_archived' => false,
                    ];
                }
            }
        }

        return [
            'user' => $validated['user'] ?? [],
            'profile' => [
                ...($validated['profile'] ?? []),
                'address' => $address,
            ],
            'maid' => $validated['maid'] ?? [],
            'agency_maid' => $validated['agency_maid'] ?? [],
            'documents' => $documents,
        ];
    }
}
