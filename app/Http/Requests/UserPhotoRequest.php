<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserPhotoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only allow if user is authenticated
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Different rules for create vs update
        $rules = [
            'user_id'     => ['required', 'exists:users,id'],
            'caption'     => ['nullable', 'string', 'max:255'],
            'type'        => ['required', 'in:banner,gallery,other'],
            'sort_order'  => ['nullable', 'integer', 'min:0'],
            'is_banner'   => ['boolean'],
            'is_archived' => ['boolean'],
        ];
        
        // Only require URL for new photos, make it optional for updates
        if ($this->isMethod('POST') && !$this->route('userPhoto')) {
            $rules['url'] = ['required', 'image', 'max:2048']; // 2mb
        } else {
            $rules['url'] = ['nullable', 'image', 'max:2048']; // 2mb, optional
        }
        
        return $rules;
    }
}