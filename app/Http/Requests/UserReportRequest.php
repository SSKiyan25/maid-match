<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow authenticated users to submit reports
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'reported_user_id' => 'required|exists:users,id',
            'report_type' => 'required|string|in:harassment,spam,inappropriate,fraud,scam,impersonation,other',
            'description' => 'required|string|min:10|max:2000',
            'evidence_photo' => 'nullable|image|max:5120', // 5MB max size
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'reported_user_id.required' => 'The reported user is required.',
            'reported_user_id.exists' => 'The reported user does not exist.',
            'report_type.required' => 'Please specify the type of report.',
            'report_type.in' => 'The report type must be a valid category.',
            'description.required' => 'Please provide details about the issue.',
            'description.min' => 'Please provide more details about the issue (minimum 10 characters).',
            'evidence_photo.image' => 'The evidence must be an image file.',
            'evidence_photo.max' => 'The evidence image must not exceed 5MB.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'reporter_id' => auth()->id(),
            'status' => 'pending',
        ]);
    }
}
