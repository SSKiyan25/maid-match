<?php

namespace App\Http\Requests\JobPosting;

use App\Models\JobPosting\JobApplication;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() &&
            (auth()->user()->hasRole('maid') ||
                auth()->user()->hasRole('employer') ||
                auth()->user()->hasRole('admin') ||
                auth()->user()->hasRole('agency'));
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'job_posting_id' => ['required', 'integer', 'exists:job_postings,id'],
            'status' => ['sometimes', 'string', Rule::in(array_keys(JobApplication::STATUSES))],
            'ranking_position' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'employer_notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'description' => ['nullable', 'string', 'max:1000'],
            'proposed_salary' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // Maids applying for jobs
        if ($this->isMethod('POST') && auth()->user()->hasRole('maid')) {
            $rules['maid_id'] = ['sometimes', 'integer', 'exists:maids,id'];
            $rules['description'] = ['required', 'string', 'min:50', 'max:1000'];
        }

        // Employers updating applications
        if ($this->isMethod('PATCH') && auth()->user()->hasRole('employer')) {
            unset($rules['job_posting_id']); // Can't change job posting
            $rules['status'] = ['sometimes', 'string', Rule::in(array_keys(JobApplication::STATUSES))];
        }

        // Admin updates
        if (auth()->user()->hasRole('admin')) {
            $rules['maid_id'] = ['sometimes', 'integer', 'exists:maids,id'];
        }

        return $rules;
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'job_posting_id.required' => 'Job posting is required.',
            'job_posting_id.exists' => 'Selected job posting does not exist.',
            'maid_id.exists' => 'Selected maid does not exist.',
            'status.in' => 'Please select a valid application status.',
            'ranking_position.min' => 'Ranking position must be at least 1.',
            'employer_notes.max' => 'Employer notes cannot exceed 2000 characters.',
            'description.required' => 'Application description is required.',
            'description.min' => 'Application description must be at least 50 characters.',
            'description.max' => 'Application description cannot exceed 1000 characters.',
            'proposed_salary.numeric' => 'Proposed salary must be a valid number.',
            'proposed_salary.min' => 'Proposed salary cannot be negative.',
            'proposed_salary.max' => 'Proposed salary cannot exceed ₱999,999.99.',
        ];
    }

    /**
     * Get validated data with automatic field handling.
     */
    public function validatedWithDefaults(): array
    {
        $validated = $this->validated();

        // Auto-set maid_id for authenticated maids
        if (auth()->user()->hasRole('maid') && !isset($validated['maid_id'])) {
            $validated['maid_id'] = auth()->user()->maid->id;
        }

        // Set applied_at for new applications
        if ($this->isMethod('POST') && !isset($validated['applied_at'])) {
            $validated['applied_at'] = now();
        }

        return $validated;
    }
}
