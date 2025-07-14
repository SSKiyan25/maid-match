<?php

namespace App\Http\Requests\Agency;

use Illuminate\Foundation\Http\FormRequest;

class AgencyPhotoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->agency;
    }

    public function rules(): array
    {
        $rules = [
            'photos' => ['required', 'array', 'min:1', 'max:5'],
            'photos.*' => ['required', 'image', 'max:5120'], // Each photo max 5MB
            'caption' => ['nullable', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:logo,office,team,certificate,other'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_primary' => ['nullable', 'boolean'],
            'is_archived' => ['nullable', 'boolean'],
        ];

        // For updates, make photos optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['photos'] = ['sometimes', 'array', 'max:5'];
            $rules['photos.*'] = ['sometimes', 'image', 'max:5120'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'photo.required' => 'Photo is required.',
            'photo.image' => 'Photo must be an image file (jpeg, png, bmp, gif, or svg).',
            'photo.max' => 'Photo must not be larger than 5MB.',
            'caption.max' => 'Caption cannot exceed 255 characters.',
        ];
    }
}
