<?php

namespace App\Http\Requests\Agency;

use Illuminate\Foundation\Http\FormRequest;

class AgencyCreditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Allow admins and agencies to add credits
        return $this->user() && ($this->user()->hasRole('admin') || $this->user()->hasRole('agency'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'agency_id' => 'required|exists:agencies,id',
            'amount' => 'required|integer',
            'type' => 'required|string|in:purchase,used,refund,admin_grant',
            'description' => 'nullable|string|max:255',
            'expires_at' => 'nullable|date|after:now',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'agency_id.required' => 'The agency ID is required.',
            'agency_id.exists' => 'The selected agency does not exist.',
            'amount.required' => 'The amount is required.',
            'amount.integer' => 'The amount must be a whole number.',
            'type.required' => 'The credit type is required.',
            'type.in' => 'The credit type must be one of: purchase, used, refund, admin_grant.',
            'expires_at.date' => 'The expiration date must be a valid date.',
            'expires_at.after' => 'The expiration date must be a future date.',
        ];
    }
}
