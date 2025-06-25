<?php

namespace App\Http\Requests\Maid;

use App\Models\MaidCharacterReference;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MaidCharacterReferenceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only maids can manage their own character references, or admins
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
            'name' => ['required', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:20'],
            'social_media_url' => ['nullable', 'array'],
            'social_media_url.facebook' => ['nullable', 'url', 'max:255'],
            'social_media_url.instagram' => ['nullable', 'url', 'max:255'],
            'social_media_url.linkedin' => ['nullable', 'url', 'max:255'],
            'social_media_url.twitter' => ['nullable', 'url', 'max:255'],
            'verify_status' => ['sometimes', 'string', Rule::in(array_keys(MaidCharacterReference::VERIFY_STATUSES))],
            'relationship' => ['required', 'string', Rule::in(array_keys(MaidCharacterReference::RELATIONSHIP_TYPES))],
            'notes' => ['nullable', 'string', 'max:1000'],
            'verified_at' => ['sometimes', 'nullable', 'date'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // For updates, make some fields optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['name'] = ['sometimes', 'string', 'max:255'];
            $rules['relationship'] = ['sometimes', 'string', Rule::in(array_keys(MaidCharacterReference::RELATIONSHIP_TYPES))];
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
            'name.required' => 'Reference name is required.',
            'name.max' => 'Reference name cannot exceed 255 characters.',
            'contact_number.max' => 'Contact number cannot exceed 20 characters.',
            'relationship.required' => 'Relationship type is required.',
            'relationship.in' => 'Please select a valid relationship type.',
            'verify_status.in' => 'Please select a valid verification status.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
            'social_media_url.facebook.url' => 'Facebook URL must be a valid URL.',
            'social_media_url.instagram.url' => 'Instagram URL must be a valid URL.',
            'social_media_url.linkedin.url' => 'LinkedIn URL must be a valid URL.',
            'social_media_url.twitter.url' => 'Twitter URL must be a valid URL.',
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
            'name' => 'reference name',
            'contact_number' => 'contact number',
            'social_media_url' => 'social media links',
            'verify_status' => 'verification status',
            'relationship' => 'relationship type',
            'notes' => 'additional notes',
            'verified_at' => 'verification date',
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
        if ($this->has('name')) {
            $data['name'] = trim($this->name);
        }

        if ($this->has('contact_number')) {
            // Clean phone number - remove spaces, dashes, parentheses
            $cleanNumber = preg_replace('/[^\d+]/', '', $this->contact_number);
            $data['contact_number'] = $cleanNumber ?: null;
        }

        if ($this->has('relationship')) {
            $data['relationship'] = strtolower(trim($this->relationship));
        }

        if ($this->has('notes')) {
            $data['notes'] = trim($this->notes) ?: null;
        }

        // Clean social media URLs
        if ($this->has('social_media_url')) {
            $socialLinks = [];
            foreach ($this->social_media_url as $platform => $url) {
                $cleanUrl = trim($url);
                if ($cleanUrl) {
                    $socialLinks[$platform] = $cleanUrl;
                }
            }
            $data['social_media_url'] = !empty($socialLinks) ? $socialLinks : null;
        }

        // Handle boolean values
        if ($this->has('is_archived')) {
            $data['is_archived'] = filter_var($this->is_archived, FILTER_VALIDATE_BOOLEAN);
        }

        // Set default verify status for new references
        if (!$this->has('verify_status') && $this->isMethod('POST')) {
            $data['verify_status'] = 'pending';
        }

        $this->merge($data);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validate that at least one contact method is provided
            $hasPhone = !empty($this->contact_number);
            $hasSocialMedia = !empty($this->social_media_url);

            if (!$hasPhone && !$hasSocialMedia) {
                $validator->errors()->add('contact_number', 'At least one contact method (phone or social media) is required.');
            }

            // Validate Philippine mobile number format if provided
            if ($this->contact_number) {
                $number = preg_replace('/[^\d+]/', '', $this->contact_number);

                // Check for Philippine mobile format (09xxxxxxxxx or +639xxxxxxxxx)
                if (!preg_match('/^(09\d{9}|\+639\d{9})$/', $number)) {
                    $validator->errors()->add('contact_number', 'Please provide a valid Philippine mobile number (09xxxxxxxxx or +639xxxxxxxxx).');
                }
            }

            // Validate social media URL formats
            if ($this->social_media_url) {
                foreach ($this->social_media_url as $platform => $url) {
                    if ($url) {
                        switch ($platform) {
                            case 'facebook':
                                if (!str_contains($url, 'facebook.com') && !str_contains($url, 'fb.com')) {
                                    $validator->errors()->add("social_media_url.{$platform}", 'Facebook URL must be a valid Facebook profile link.');
                                }
                                break;
                            case 'instagram':
                                if (!str_contains($url, 'instagram.com')) {
                                    $validator->errors()->add("social_media_url.{$platform}", 'Instagram URL must be a valid Instagram profile link.');
                                }
                                break;
                            case 'linkedin':
                                if (!str_contains($url, 'linkedin.com')) {
                                    $validator->errors()->add("social_media_url.{$platform}", 'LinkedIn URL must be a valid LinkedIn profile link.');
                                }
                                break;
                        }
                    }
                }
            }

            // Check for duplicate references (same name + relationship for same maid)
            if ($this->name && $this->relationship && auth()->user()->hasRole('maid')) {
                $maidId = auth()->user()->maid->id;
                $referenceId = $this->route('reference')?->id; // For updates

                $duplicateExists = MaidCharacterReference::where('maid_id', $maidId)
                    ->where('name', $this->name)
                    ->where('relationship', $this->relationship)
                    ->when($referenceId, fn($query) => $query->where('id', '!=', $referenceId))
                    ->where('is_archived', false)
                    ->exists();

                if ($duplicateExists) {
                    $validator->errors()->add('name', 'You already have a reference from ' . $this->name . ' as ' . $this->relationship_label . '.');
                }
            }

            // Validate maximum references per maid
            if (auth()->user()->hasRole('maid') && $this->isMethod('POST')) {
                $maidId = auth()->user()->maid->id;
                $currentCount = MaidCharacterReference::where('maid_id', $maidId)
                    ->notArchived()
                    ->count();

                if ($currentCount >= 10) { // Maximum 10 references
                    $validator->errors()->add('name', 'You cannot add more than 10 character references.');
                }
            }

            // Validate name is not just spaces
            if ($this->name && !trim($this->name)) {
                $validator->errors()->add('name', 'Reference name cannot be empty or just spaces.');
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
     * Get available relationship types for frontend.
     */
    public static function getAvailableRelationshipTypes(): array
    {
        return MaidCharacterReference::RELATIONSHIP_TYPES;
    }

    /**
     * Get available verification statuses for frontend.
     */
    public static function getAvailableVerifyStatuses(): array
    {
        return MaidCharacterReference::VERIFY_STATUSES;
    }

    /**
     * Get form requirements and guidelines.
     */
    public static function getFormGuidelines(): array
    {
        return [
            'minimum_references' => MaidCharacterReference::getRecommendedMinimumReferences(),
            'maximum_references' => 10,
            'contact_requirements' => 'At least one contact method (phone or social media) is required',
            'phone_format' => 'Philippine mobile number format: 09xxxxxxxxx or +639xxxxxxxxx',
            'recommended_relationships' => [
                'former_employer' => 'Most valuable for verification',
                'family_friend' => 'Good for character assessment',
                'neighbor' => 'Helpful for community reputation',
                'colleague' => 'Useful for work-related references'
            ],
            'verification_process' => [
                'pending' => 'Reference will be contacted for verification',
                'verified' => 'Successfully contacted and verified',
                'failed' => 'Could not be reached or verification failed',
                'not_contacted' => 'Not yet contacted for verification'
            ]
        ];
    }
}