<?php

namespace App\Http\Requests\JobPosting;

use App\Models\JobPosting\JobPhoto;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobPhotoRequest extends FormRequest
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
            'job_posting_id' => ['required', 'integer', 'exists:job_postings,id'],
            'caption' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', Rule::in(array_keys(JobPhoto::PHOTO_TYPES))],
            'sort_order' => ['nullable', 'integer', 'min:1'],
            'is_primary' => ['nullable', 'boolean'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // File upload validation
        if ($this->hasFile('photo')) {
            $rules['photo'] = [
                'required',
                'image',
                'mimes:jpeg,jpg,png,webp',
                'max:5120', // 5MB
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
            'job_posting_id.required' => 'Job posting ID is required.',
            'job_posting_id.exists' => 'Selected job posting does not exist.',
            'type.required' => 'Photo type is required.',
            'type.in' => 'Please select a valid photo type.',
            'caption.max' => 'Caption cannot exceed 255 characters.',
            'url.required' => 'Photo URL is required.',
            'photo.required' => 'Please select a photo to upload.',
            'photo.image' => 'The uploaded file must be an image.',
            'photo.mimes' => 'Photo must be a JPEG, PNG, or WebP image.',
            'photo.max' => 'Photo size cannot exceed 5MB.',
        ];
    }

    /**
     * Get validated data with file upload handling.
     */
    public function validatedWithFileUpload(): array
    {
        $validated = $this->validated();

        // Handle file upload if present
        if ($this->hasFile('photo')) {
            $file = $this->file('photo');
            $jobPostingId = $validated['job_posting_id'];

            $filename = time() . '_' . $file->getClientOriginalName();
            $validated['url'] = $file->storeAs("job-photos/{$jobPostingId}", $filename, 'public');

            unset($validated['photo']);
        }

        return $validated;
    }
}
