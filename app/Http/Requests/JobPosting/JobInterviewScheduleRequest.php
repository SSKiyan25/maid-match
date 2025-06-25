<?php

namespace App\Http\Requests\JobPosting;

use App\Models\JobPosting\JobInterviewSchedule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobInterviewScheduleRequest extends FormRequest
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
            'maid_id' => ['required', 'integer', 'exists:maids,id'],
            'job_application_id' => ['nullable', 'integer', 'exists:job_applications,id'],
            'title' => ['required', 'string', 'max:255'],
            'interview_date' => ['required', 'date', 'after_or_equal:today'],
            'time_start' => ['required', 'date_format:H:i'],
            'time_end' => ['required', 'date_format:H:i', 'after:time_start'],
            'status' => ['sometimes', 'string', Rule::in(array_keys(JobInterviewSchedule::STATUSES))],
            'description' => ['nullable', 'string', 'max:1000'],
            'type' => ['required', 'string', Rule::in(array_keys(JobInterviewSchedule::TYPES))],
            'location' => ['nullable', 'string', 'max:500'],
            'meeting_link' => ['nullable', 'url', 'max:500'],
            'employer_notes' => ['nullable', 'string', 'max:1000'],
            'maid_notes' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'employer_rating' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:5'],
            'maid_rating' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:5'],
            'confirmed_at' => ['sometimes', 'nullable', 'date'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // For updates, make some fields optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['job_posting_id'] = ['sometimes', 'integer', 'exists:job_postings,id'];
            $rules['maid_id'] = ['sometimes', 'integer', 'exists:maids,id'];
            $rules['title'] = ['sometimes', 'string', 'max:255'];
            $rules['interview_date'] = ['sometimes', 'date', 'after_or_equal:today'];
            $rules['time_start'] = ['sometimes', 'date_format:H:i'];
            $rules['time_end'] = ['sometimes', 'date_format:H:i', 'after:time_start'];
            $rules['type'] = ['sometimes', 'string', Rule::in(array_keys(JobInterviewSchedule::TYPES))];
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
            'maid_id.required' => 'Maid selection is required.',
            'maid_id.exists' => 'Selected maid does not exist.',
            'title.required' => 'Interview title is required.',
            'interview_date.required' => 'Interview date is required.',
            'interview_date.after_or_equal' => 'Interview date cannot be in the past.',
            'time_start.required' => 'Start time is required.',
            'time_end.required' => 'End time is required.',
            'time_end.after' => 'End time must be after start time.',
            'type.required' => 'Interview type is required.',
            'meeting_link.url' => 'Meeting link must be a valid URL.',
        ];
    }
}
