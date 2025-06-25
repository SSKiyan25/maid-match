<?php

namespace App\Http\Requests\JobPosting;

use App\Models\JobPosting\JobBonus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobBonusRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'amount' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'type' => ['required', 'string', Rule::in(array_keys(JobBonus::BONUS_TYPES))],
            'frequency' => ['required', 'string', Rule::in(array_keys(JobBonus::FREQUENCIES))],
            'status' => ['sometimes', 'string', Rule::in(array_keys(JobBonus::STATUSES))],
            'description' => ['nullable', 'string', 'max:1000'],
            'conditions' => ['nullable', 'string', 'max:1000'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // For updates, make some fields optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['job_posting_id'] = ['sometimes', 'integer', 'exists:job_postings,id'];
            $rules['title'] = ['sometimes', 'string', 'max:255'];
            $rules['type'] = ['sometimes', 'string', Rule::in(array_keys(JobBonus::BONUS_TYPES))];
            $rules['frequency'] = ['sometimes', 'string', Rule::in(array_keys(JobBonus::FREQUENCIES))];
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
            'title.required' => 'Bonus title is required.',
            'title.max' => 'Bonus title cannot exceed 255 characters.',
            'amount.numeric' => 'Amount must be a valid number.',
            'amount.min' => 'Amount cannot be negative.',
            'amount.max' => 'Amount cannot exceed ₱999,999.99.',
            'type.required' => 'Bonus type is required.',
            'type.in' => 'Please select a valid bonus type.',
            'frequency.required' => 'Frequency is required.',
            'frequency.in' => 'Please select a valid frequency.',
            'status.in' => 'Please select a valid status.',
            'description.max' => 'Description cannot exceed 1000 characters.',
            'conditions.max' => 'Conditions cannot exceed 1000 characters.',
        ];
    }
}
