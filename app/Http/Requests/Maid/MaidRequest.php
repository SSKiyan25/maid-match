<?php

namespace App\Http\Requests\Maid;

use App\Models\Maid;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MaidRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only maids can manage their own profile, or admins
        return auth()->check() &&
            (auth()->user()->hasRole('maid') || auth()->user()->hasRole('admin'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'bio' => ['nullable', 'string', 'max:1000'],
            'skills' => ['nullable', 'array'],
            'skills.*' => ['string', Rule::in(array_keys(Maid::COMMON_SKILLS))],
            'nationality' => ['nullable', 'string', 'max:100'],
            'languages' => ['nullable', 'array'],
            'languages.*' => ['string', 'max:50'],
            'social_media_links' => ['nullable', 'array'],
            'social_media_links.facebook' => ['nullable', 'url', 'max:255'],
            'social_media_links.instagram' => ['nullable', 'url', 'max:255'],
            'social_media_links.linkedin' => ['nullable', 'url', 'max:255'],
            'marital_status' => ['nullable', 'string', Rule::in(Maid::getMaritalStatuses())],
            'has_children' => ['nullable', 'boolean'],
            'expected_salary' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'is_willing_to_relocate' => ['nullable', 'boolean'],
            'preferred_accommodation' => ['nullable', 'string', Rule::in(['live_in', 'live_out', 'either'])],
            'earliest_start_date' => ['nullable', 'date', 'after_or_equal:today'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:50'],
            'status' => ['nullable', 'string', Rule::in(Maid::getAvailableStatuses())],
            'availability_schedule' => ['nullable', 'array'],
            'availability_schedule.days' => ['nullable', 'array'],
            'availability_schedule.days.*' => ['string', Rule::in(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])],
            'availability_schedule.hours_start' => ['nullable', 'string', 'regex:/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/'],
            'availability_schedule.hours_end' => ['nullable', 'string', 'regex:/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
            'verification_badges' => ['sometimes', 'array'],
            'verification_badges.*' => ['string', Rule::in(['id_verified', 'background_checked', 'reference_verified', 'skill_certified'])],
            'is_verified' => ['sometimes', 'boolean'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // For updates, make most fields optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            foreach ($rules as $field => $rule) {
                if (!in_array($field, ['verification_badges', 'is_verified', 'is_archived'])) {
                    $rules[$field] = array_merge(['sometimes'], $rule);
                }
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
            'bio.max' => 'Bio cannot exceed 1000 characters.',
            'skills.array' => 'Skills must be provided as an array.',
            'skills.*.in' => 'Invalid skill selected. Please choose from available skills.',
            'languages.array' => 'Languages must be provided as an array.',
            'expected_salary.numeric' => 'Expected salary must be a valid number.',
            'expected_salary.min' => 'Expected salary cannot be negative.',
            'expected_salary.max' => 'Expected salary cannot exceed ₱999,999.99.',
            'earliest_start_date.after_or_equal' => 'Start date cannot be in the past.',
            'years_experience.min' => 'Years of experience cannot be negative.',
            'years_experience.max' => 'Years of experience cannot exceed 50.',
            'availability_schedule.days.*.in' => 'Invalid day selected.',
            'availability_schedule.hours_start.regex' => 'Start time must be in HH:MM format.',
            'availability_schedule.hours_end.regex' => 'End time must be in HH:MM format.',
            'emergency_contact_phone.max' => 'Emergency contact phone cannot exceed 20 characters.',
            'social_media_links.facebook.url' => 'Facebook URL must be a valid URL.',
            'social_media_links.instagram.url' => 'Instagram URL must be a valid URL.',
            'social_media_links.linkedin.url' => 'LinkedIn URL must be a valid URL.',
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
            'bio' => 'biography',
            'expected_salary' => 'expected salary',
            'is_willing_to_relocate' => 'willingness to relocate',
            'preferred_accommodation' => 'preferred accommodation',
            'earliest_start_date' => 'earliest start date',
            'years_experience' => 'years of experience',
            'availability_schedule' => 'availability schedule',
            'emergency_contact_name' => 'emergency contact name',
            'emergency_contact_phone' => 'emergency contact phone',
            'verification_badges' => 'verification badges',
            'is_verified' => 'verification status',
            'is_archived' => 'archive status',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        // Clean bio
        if ($this->has('bio')) {
            $data['bio'] = trim($this->bio) ?: null;
        }

        // Ensure skills and languages are arrays
        if ($this->has('skills')) {
            $data['skills'] = is_array($this->skills) ? array_filter($this->skills) : [];
        }

        if ($this->has('languages')) {
            $data['languages'] = is_array($this->languages) ? array_filter($this->languages) : [];
        }

        // Clean social media links
        if ($this->has('social_media_links')) {
            $socialLinks = [];
            foreach ($this->social_media_links as $platform => $url) {
                if (trim($url)) {
                    $socialLinks[$platform] = trim($url);
                }
            }
            $data['social_media_links'] = !empty($socialLinks) ? $socialLinks : null;
        }

        // Convert boolean values
        foreach (['has_children', 'is_willing_to_relocate', 'is_verified', 'is_archived'] as $field) {
            if ($this->has($field)) {
                $data[$field] = filter_var($this->$field, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            }
        }

        // Convert numeric values
        if ($this->has('expected_salary')) {
            $data['expected_salary'] = is_numeric($this->expected_salary) ? (float) $this->expected_salary : null;
        }

        if ($this->has('years_experience')) {
            $data['years_experience'] = is_numeric($this->years_experience) ? (int) $this->years_experience : null;
        }

        // Clean emergency contacts
        if ($this->has('emergency_contact_name')) {
            $data['emergency_contact_name'] = trim($this->emergency_contact_name) ?: null;
        }

        if ($this->has('emergency_contact_phone')) {
            $data['emergency_contact_phone'] = trim($this->emergency_contact_phone) ?: null;
        }

        $this->merge($data);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validate availability schedule consistency
            if ($this->availability_schedule) {
                $schedule = $this->availability_schedule;
                $startTime = $schedule['hours_start'] ?? null;
                $endTime = $schedule['hours_end'] ?? null;

                if ($startTime && $endTime && $startTime >= $endTime) {
                    $validator->errors()->add('availability_schedule.hours_end', 'End time must be after start time.');
                }
            }

            // Validate that employed maids have realistic start dates
            if ($this->status === 'employed' && $this->earliest_start_date && $this->earliest_start_date <= now()) {
                $validator->errors()->add('earliest_start_date', 'Employed maids should have a future start date for new positions.');
            }

            // Validate emergency contact completeness
            $hasEmergencyName = !empty($this->emergency_contact_name);
            $hasEmergencyPhone = !empty($this->emergency_contact_phone);

            if ($hasEmergencyName && !$hasEmergencyPhone) {
                $validator->errors()->add('emergency_contact_phone', 'Emergency contact phone is required when name is provided.');
            }

            if ($hasEmergencyPhone && !$hasEmergencyName) {
                $validator->errors()->add('emergency_contact_name', 'Emergency contact name is required when phone is provided.');
            }

            // Validate skills uniqueness
            if ($this->skills && count($this->skills) !== count(array_unique($this->skills))) {
                $validator->errors()->add('skills', 'Duplicate skills are not allowed.');
            }

            // Validate languages uniqueness
            if ($this->languages && count($this->languages) !== count(array_unique($this->languages))) {
                $validator->errors()->add('languages', 'Duplicate languages are not allowed.');
            }
        });
    }

    /**
     * Get validated data with user_id automatically set.
     */
    public function validatedWithUser(): array
    {
        $validated = $this->validated();

        // Automatically set the user_id from the authenticated user
        if (auth()->user()->hasRole('maid')) {
            $validated['user_id'] = auth()->id();
        }

        return $validated;
    }

    /**
     * Get available options for frontend forms.
     */
    public static function getFormOptions(): array
    {
        return [
            'skills' => Maid::getCommonSkills(),
            'statuses' => Maid::getAvailableStatuses(),
            'marital_statuses' => Maid::getMaritalStatuses(),
            'accommodation_types' => [
                'live_in' => 'Live-in',
                'live_out' => 'Live-out',
                'either' => 'Either'
            ],
            'verification_badges' => [
                'id_verified' => 'ID Verified',
                'background_checked' => 'Background Checked',
                'reference_verified' => 'References Verified',
                'skill_certified' => 'Skills Certified'
            ],
            'days_of_week' => [
                'monday' => 'Monday',
                'tuesday' => 'Tuesday',
                'wednesday' => 'Wednesday',
                'thursday' => 'Thursday',
                'friday' => 'Friday',
                'saturday' => 'Saturday',
                'sunday' => 'Sunday'
            ]
        ];
    }
}