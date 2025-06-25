<?php

namespace App\Http\Requests\JobPosting;

use App\Models\JobPhoto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobPhotoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only employers can manage their job photos, or admins
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
            'job_posting_id' => ['required', 'integer', 'exists:job_postings,id'],
            'caption' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::in(array_keys(JobPhoto::PHOTO_TYPES))],
            'sort_order' => ['nullable', 'integer', 'min:1'],
            'is_primary' => ['nullable', 'boolean'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // For file uploads, validate the photo file
        if ($this->hasFile('photo')) {
            $rules['photo'] = [
                'required',
                'image',
                'mimes:jpeg,jpg,png,gif,webp',
                'max:5120', // 5MB max
                'dimensions:min_width=300,min_height=300,max_width=4000,max_height=4000'
            ];
        } else {
            // If not uploading, URL is required
            $rules['url'] = ['required', 'string', 'max:500'];
        }

        // For updates, make some fields optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['job_posting_id'] = ['sometimes', 'integer', 'exists:job_postings,id'];
            $rules['type'] = ['sometimes', 'string', Rule::in(array_keys(JobPhoto::PHOTO_TYPES))];

            if (!$this->hasFile('photo')) {
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
            'job_posting_id.required' => 'Job posting ID is required.',
            'job_posting_id.exists' => 'Selected job posting does not exist.',
            'type.required' => 'Photo type is required.',
            'type.in' => 'Please select a valid photo type.',
            'caption.max' => 'Caption cannot exceed 255 characters.',
            'sort_order.min' => 'Sort order must be at least 1.',
            'url.required' => 'Photo URL is required.',
            'url.max' => 'Photo URL cannot exceed 500 characters.',
            'photo.required' => 'Please select a photo to upload.',
            'photo.image' => 'The uploaded file must be an image.',
            'photo.mimes' => 'Photo must be a JPEG, PNG, GIF, or WebP image.',
            'photo.max' => 'Photo size cannot exceed 5MB.',
            'photo.dimensions' => 'Photo must be at least 300x300 pixels and no larger than 4000x4000 pixels.',
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
            'job_posting_id' => 'job posting',
            'caption' => 'photo caption',
            'type' => 'photo type',
            'sort_order' => 'display order',
            'is_primary' => 'primary photo',
            'is_archived' => 'archive status',
            'url' => 'photo URL',
            'photo' => 'photo file',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        // Clean and prepare text fields
        if ($this->has('caption')) {
            $data['caption'] = trim($this->caption) ?: null;
        }

        if ($this->has('type')) {
            $data['type'] = strtolower(trim($this->type));
        }

        if ($this->has('url')) {
            $data['url'] = trim($this->url);
        }

        // Convert numeric values
        if ($this->has('job_posting_id')) {
            $data['job_posting_id'] = (int) $this->job_posting_id;
        }

        if ($this->has('sort_order')) {
            $data['sort_order'] = is_numeric($this->sort_order) ? (int) $this->sort_order : null;
        }

        // Convert boolean values
        foreach (['is_primary', 'is_archived'] as $field) {
            if ($this->has($field)) {
                $data[$field] = filter_var($this->$field, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            }
        }

        $this->merge($data);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validate job posting ownership
            if ($this->job_posting_id && auth()->user()->hasRole('employer')) {
                $jobPosting = \App\Models\JobPosting::find($this->job_posting_id);

                if ($jobPosting && $jobPosting->employer_id !== auth()->user()->employer->id) {
                    $validator->errors()->add('job_posting_id', 'You can only add photos to your own job postings.');
                }
            }

            // Validate maximum photos per job posting
            if ($this->job_posting_id && $this->isMethod('POST')) {
                $existingPhotosCount = JobPhoto::where('job_posting_id', $this->job_posting_id)
                    ->notArchived()
                    ->count();

                if ($existingPhotosCount >= 10) { // Maximum 10 photos per job
                    $validator->errors()->add('photo', 'You cannot add more than 10 photos per job posting.');
                }
            }

            // Validate primary photo logic
            if ($this->is_primary && $this->job_posting_id) {
                $photoId = $this->route('photo')?->id; // For updates

                $existingPrimary = JobPhoto::where('job_posting_id', $this->job_posting_id)
                    ->where('is_primary', true)
                    ->when($photoId, fn($query) => $query->where('id', '!=', $photoId))
                    ->notArchived()
                    ->exists();

                if ($existingPrimary) {
                    // This is just a warning - we'll handle it in the controller
                    // by removing primary from other photos
                }
            }

            // Validate URL format if not uploading file
            if (!$this->hasFile('photo') && $this->url) {
                if (!filter_var($this->url, FILTER_VALIDATE_URL) && !str_starts_with($this->url, '/')) {
                    $validator->errors()->add('url', 'Photo URL must be a valid URL or file path.');
                }
            }

            // Validate caption is not just spaces
            if ($this->caption && !trim($this->caption)) {
                $validator->errors()->add('caption', 'Caption cannot be empty or just spaces.');
            }

            // Validate photo type requirements
            if ($this->type === 'household' && $this->job_posting_id) {
                // Household photos should ideally be primary
                $existingHousehold = JobPhoto::where('job_posting_id', $this->job_posting_id)
                    ->where('type', 'household')
                    ->notArchived()
                    ->exists();

                if ($existingHousehold && $this->isMethod('POST')) {
                    $validator->errors()->add('type', 'You already have a household overview photo. Consider using a different type.');
                }
            }

            // Validate image quality for uploaded files
            if ($this->hasFile('photo')) {
                $file = $this->file('photo');

                // Check aspect ratio (should be reasonable for display)
                if ($file->isValid()) {
                    $imageSize = getimagesize($file->getPathname());
                    if ($imageSize) {
                        $width = $imageSize[0];
                        $height = $imageSize[1];
                        $aspectRatio = $width / $height;

                        // Aspect ratio should be between 1:3 and 3:1
                        if ($aspectRatio < 0.33 || $aspectRatio > 3) {
                            $validator->errors()->add('photo', 'Photo aspect ratio should be more balanced for better display.');
                        }
                    }
                }
            }
        });
    }

    /**
     * Handle file upload and return validated data with URL.
     */
    public function validatedWithFileUpload(): array
    {
        $validated = $this->validated();

        // Handle file upload if present
        if ($this->hasFile('photo')) {
            $file = $this->file('photo');
            $jobPostingId = $validated['job_posting_id'];

            // Generate file path: job-photos/job_id/type_timestamp.extension
            $timestamp = now()->format('Y-m-d_H-i-s');
            $extension = $file->getClientOriginalExtension();
            $filename = "{$this->type}_{$timestamp}.{$extension}";

            // Store the file
            $validated['url'] = $file->storeAs("job-photos/{$jobPostingId}", $filename, 'public');

            // Remove the photo file from validated data
            unset($validated['photo']);
        }

        // Set sort order if not provided
        if (!isset($validated['sort_order']) && isset($validated['job_posting_id'])) {
            $validated['sort_order'] = JobPhoto::getNextSortOrder(
                \App\Models\JobPosting::find($validated['job_posting_id'])
            );
        }

        return $validated;
    }

    /**
     * Get available photo types for frontend.
     */
    public static function getAvailablePhotoTypes(): array
    {
        return JobPhoto::PHOTO_TYPES;
    }

    /**
     * Get upload requirements and guidelines.
     */
    public static function getUploadGuidelines(): array
    {
        return [
            'max_size' => '5MB',
            'min_dimensions' => '300x300 pixels',
            'max_dimensions' => '4000x4000 pixels',
            'allowed_formats' => [
                'jpeg' => 'JPEG Images',
                'jpg' => 'JPEG Images',
                'png' => 'PNG Images',
                'gif' => 'GIF Images (non-animated preferred)',
                'webp' => 'WebP Images'
            ],
            'max_photos_per_job' => 10,
            'recommendations' => [
                'Use high-quality, well-lit photos',
                'Include a household overview as primary photo',
                'Show different areas of the home',
                'Keep photos current and accurate',
                'Avoid including personal/private items',
                'Consider privacy when showing rooms'
            ],
            'photo_type_tips' => [
                'household' => 'Overview of the main living area - recommended as primary photo',
                'room' => 'Bedrooms or other rooms that need cleaning',
                'kitchen' => 'Kitchen area if cooking is required',
                'workspace' => 'Home office or study areas',
                'other' => 'Any other relevant areas'
            ]
        ];
    }

    /**
     * Get photo management actions for frontend.
     */
    public static function getManagementActions(): array
    {
        return [
            'reorder' => 'Drag and drop to reorder photos',
            'set_primary' => 'Set as main photo for job listing',
            'edit_caption' => 'Add or edit photo description',
            'change_type' => 'Update photo category',
            'archive' => 'Hide photo without deleting',
            'delete' => 'Permanently remove photo and file'
        ];
    }
}