<?php

namespace App\Http\Requests\JobPosting;

use App\Models\JobPosting\JobPosting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobPostingRequest extends FormRequest
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
        return [
            'title' => ['required', 'string', 'max:255'],
            'work_types' => ['required', 'array', 'min:1'],
            'work_types.*' => ['string', Rule::in(array_keys(JobPosting::WORK_TYPES))],
            'provides_toiletries' => ['nullable', 'boolean'],
            'provides_food' => ['nullable', 'boolean'],
            'accommodation_type' => ['required', 'string', Rule::in(array_keys(JobPosting::getAccommodationTypes()))],
            'min_salary' => ['nullable', 'numeric', 'min:0'],
            'max_salary' => ['nullable', 'numeric', 'min:0'],
            'day_off_preference' => ['nullable', 'string', 'max:255'],
            'day_off_type' => ['required', 'string', Rule::in(array_keys(JobPosting::getDayOffTypes()))],
            'language_preferences' => ['nullable', 'array'],
            'language_preferences.*' => ['string', 'max:50'],
            'description' => ['required', 'string', 'min:50', 'max:2000'],
            'status' => ['sometimes', 'string', Rule::in(array_keys(JobPosting::getStatuses()))],
            'is_archived' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'title.required' => 'Job title is required.',
            'title.max' => 'Job title cannot exceed 255 characters.',
            'work_types.required' => 'Please select at least one work type.',
            'work_types.min' => 'Please select at least one work type.',
            'work_types.*.in' => 'Invalid work type selected.',
            'accommodation_type.required' => 'Accommodation type is required.',
            'accommodation_type.in' => 'Please select a valid accommodation type.',
            'min_salary.numeric' => 'Minimum salary must be a valid number.',
            'min_salary.min' => 'Minimum salary cannot be negative.',
            'max_salary.numeric' => 'Maximum salary must be a valid number.',
            'max_salary.min' => 'Maximum salary cannot be negative.',
            'day_off_type.required' => 'Day off type is required.',
            'day_off_type.in' => 'Please select a valid day off type.',
            'description.required' => 'Job description is required.',
            'description.min' => 'Job description must be at least 50 characters.',
            'description.max' => 'Job description cannot exceed 2000 characters.',
            'status.in' => 'Please select a valid status.',
        ];
    }

    /**
     * Get validated data with employer_id automatically set.
     */
    public function validatedWithEmployer(): array
    {
        $validated = $this->validated();

        if (auth()->user()->hasRole('employer')) {
            $validated['employer_id'] = auth()->user()->employer->id;
        }

        return $validated;
    }
}
