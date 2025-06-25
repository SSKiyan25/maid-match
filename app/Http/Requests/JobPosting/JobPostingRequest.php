<?php

namespace App\Http\Requests\JobPosting;

use App\Models\JobPosting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobPostingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only employers can manage their job postings, or admins
        return auth()->check() &&
            (auth()->user()->hasRole('employer') || auth()->user()->hasRole('admin'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'work_types' => ['required', 'array', 'min:1', 'max:8'],
            'work_types.*' => ['string', Rule::in(array_keys(JobPosting::WORK_TYPES))],
            'provides_toiletries' => ['nullable', 'boolean'],
            'provides_food' => ['nullable', 'boolean'],
            'accommodation_type' => ['required', 'string', Rule::in(array_keys(JobPosting::getAccommodationTypes()))],
            'min_salary' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'max_salary' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'day_off_preference' => ['nullable', 'string', 'max:255'],
            'day_off_type' => ['required', 'string', Rule::in(array_keys(JobPosting::getDayOffTypes()))],
            'language_preferences' => ['nullable', 'array', 'max:5'],
            'language_preferences.*' => ['string', 'max:50'],
            'description' => ['required', 'string', 'min:50', 'max:2000'],
            'status' => ['sometimes', 'string', Rule::in(array_keys(JobPosting::getStatuses()))],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // For updates, make some fields optional
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $rules['title'] = ['sometimes', 'string', 'max:255'];
            $rules['work_types'] = ['sometimes', 'array', 'min:1', 'max:8'];
            $rules['accommodation_type'] = ['sometimes', 'string', Rule::in(array_keys(JobPosting::getAccommodationTypes()))];
            $rules['day_off_type'] = ['sometimes', 'string', Rule::in(array_keys(JobPosting::getDayOffTypes()))];
            $rules['description'] = ['sometimes', 'string', 'min:50', 'max:2000'];
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
            'title.required' => 'Job title is required.',
            'title.max' => 'Job title cannot exceed 255 characters.',
            'work_types.required' => 'Please select at least one work type.',
            'work_types.min' => 'Please select at least one work type.',
            'work_types.max' => 'You can select a maximum of 8 work types.',
            'work_types.*.in' => 'Invalid work type selected.',
            'accommodation_type.required' => 'Accommodation type is required.',
            'accommodation_type.in' => 'Please select a valid accommodation type.',
            'min_salary.numeric' => 'Minimum salary must be a valid number.',
            'min_salary.min' => 'Minimum salary cannot be negative.',
            'min_salary.max' => 'Minimum salary cannot exceed ₱999,999.99.',
            'max_salary.numeric' => 'Maximum salary must be a valid number.',
            'max_salary.min' => 'Maximum salary cannot be negative.',
            'max_salary.max' => 'Maximum salary cannot exceed ₱999,999.99.',
            'day_off_type.required' => 'Day off type is required.',
            'day_off_type.in' => 'Please select a valid day off type.',
            'language_preferences.max' => 'You can specify a maximum of 5 languages.',
            'description.required' => 'Job description is required.',
            'description.min' => 'Job description must be at least 50 characters.',
            'description.max' => 'Job description cannot exceed 2000 characters.',
            'status.in' => 'Please select a valid status.',
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
            'title' => 'job title',
            'work_types' => 'work types',
            'provides_toiletries' => 'toiletries provision',
            'provides_food' => 'food provision',
            'accommodation_type' => 'accommodation type',
            'min_salary' => 'minimum salary',
            'max_salary' => 'maximum salary',
            'day_off_preference' => 'day off preference',
            'day_off_type' => 'day off type',
            'language_preferences' => 'language preferences',
            'description' => 'job description',
            'is_archived' => 'archive status',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        // Clean and prepare text fields
        if ($this->has('title')) {
            $data['title'] = trim($this->title);
        }

        if ($this->has('description')) {
            $data['description'] = trim($this->description);
        }

        if ($this->has('day_off_preference')) {
            $data['day_off_preference'] = trim($this->day_off_preference) ?: null;
        }

        // Ensure work_types is array and clean it
        if ($this->has('work_types')) {
            $workTypes = is_array($this->work_types) ? $this->work_types : [];
            $data['work_types'] = array_filter(array_unique($workTypes));
        }

        // Ensure language_preferences is array and clean it
        if ($this->has('language_preferences')) {
            $languages = is_array($this->language_preferences) ? $this->language_preferences : [];
            $data['language_preferences'] = array_filter(array_unique(array_map('trim', $languages)));
        }

        // Convert boolean values
        foreach (['provides_toiletries', 'provides_food', 'is_archived'] as $field) {
            if ($this->has($field)) {
                $data[$field] = filter_var($this->$field, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            }
        }

        // Convert numeric values
        foreach (['min_salary', 'max_salary'] as $field) {
            if ($this->has($field)) {
                $value = $this->$field;
                $data[$field] = is_numeric($value) ? (float) $value : null;
            }
        }

        // Set default status for new job postings
        if (!$this->has('status') && $this->isMethod('POST')) {
            $data['status'] = 'draft';
        }

        $this->merge($data);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validate salary range consistency
            if ($this->min_salary && $this->max_salary && $this->min_salary > $this->max_salary) {
                $validator->errors()->add('max_salary', 'Maximum salary must be greater than or equal to minimum salary.');
            }

            // Validate work types uniqueness
            if ($this->work_types && count($this->work_types) !== count(array_unique($this->work_types))) {
                $validator->errors()->add('work_types', 'Duplicate work types are not allowed.');
            }

            // Validate language preferences uniqueness
            if ($this->language_preferences && count($this->language_preferences) !== count(array_unique($this->language_preferences))) {
                $validator->errors()->add('language_preferences', 'Duplicate languages are not allowed.');
            }

            // Validate description content quality
            if ($this->description) {
                $wordCount = str_word_count($this->description);
                if ($wordCount < 10) {
                    $validator->errors()->add('description', 'Job description should contain at least 10 words for better clarity.');
                }
            }

            // Validate title is not just spaces
            if ($this->title && !trim($this->title)) {
                $validator->errors()->add('title', 'Job title cannot be empty or just spaces.');
            }

            // Validate day off preference consistency
            if ($this->day_off_type === 'none' && $this->day_off_preference) {
                $validator->errors()->add('day_off_preference', 'Day off preference should be empty when day off type is "none".');
            }

            // Validate live-in specific requirements
            if ($this->accommodation_type === 'live_in') {
                if (!$this->provides_food && !$this->provides_toiletries) {
                    $validator->errors()->add('provides_food', 'Live-in positions typically provide food or toiletries. Please consider including these benefits.');
                }
            }

            // Check for duplicate job titles for the same employer
            if ($this->title && auth()->user()->hasRole('employer')) {
                $employerId = auth()->user()->employer->id;
                $jobId = $this->route('job')?->id; // For updates

                $duplicateExists = JobPosting::where('employer_id', $employerId)
                    ->where('title', $this->title)
                    ->when($jobId, fn($query) => $query->where('id', '!=', $jobId))
                    ->whereIn('status', ['active', 'draft'])
                    ->exists();

                if ($duplicateExists) {
                    $validator->errors()->add('title', 'You already have an active or draft job posting with this title.');
                }
            }

            // Validate maximum active job postings per employer
            if (auth()->user()->hasRole('employer') && $this->isMethod('POST')) {
                $employerId = auth()->user()->employer->id;
                $activeJobsCount = JobPosting::where('employer_id', $employerId)
                    ->whereIn('status', ['active', 'draft'])
                    ->count();

                if ($activeJobsCount >= 10) { // Maximum 10 active job postings
                    $validator->errors()->add('title', 'You cannot have more than 10 active job postings. Please archive or delete some existing postings.');
                }
            }
        });
    }

    /**
     * Get validated data with employer_id automatically set.
     */
    public function validatedWithEmployer(): array
    {
        $validated = $this->validated();

        // Automatically set the employer_id from the authenticated user
        if (auth()->user()->hasRole('employer')) {
            $validated['employer_id'] = auth()->user()->employer->id;
        }

        return $validated;
    }

    /**
     * Get available options for frontend forms.
     */
    public static function getFormOptions(): array
    {
        return [
            'work_types' => JobPosting::getWorkTypes(),
            'accommodation_types' => JobPosting::getAccommodationTypes(),
            'day_off_types' => JobPosting::getDayOffTypes(),
            'statuses' => JobPosting::getStatuses(),
            'common_languages' => [
                'english' => 'English',
                'tagalog' => 'Tagalog',
                'bisaya' => 'Bisaya',
                'ilocano' => 'Ilocano',
                'chinese' => 'Chinese',
                'korean' => 'Korean',
                'japanese' => 'Japanese',
                'spanish' => 'Spanish'
            ],
            'salary_ranges' => [
                '10000-15000' => '₱10,000 - ₱15,000',
                '15000-20000' => '₱15,000 - ₱20,000',
                '20000-25000' => '₱20,000 - ₱25,000',
                '25000-30000' => '₱25,000 - ₱30,000',
                '30000-50000' => '₱30,000 - ₱50,000',
                '50000+' => '₱50,000+'
            ]
        ];
    }

    /**
     * Get posting guidelines for employers.
     */
    public static function getPostingGuidelines(): array
    {
        return [
            'title_tips' => [
                'Be specific about the role',
                'Include key responsibilities',
                'Avoid discriminatory language',
                'Keep it under 255 characters'
            ],
            'description_tips' => [
                'Describe daily tasks clearly',
                'Mention household size and composition',
                'Include work schedule and hours',
                'Specify any special requirements',
                'Be honest about expectations',
                'Minimum 50 characters, maximum 2000'
            ],
            'salary_tips' => [
                'Offer competitive and fair wages',
                'Consider market rates in your area',
                'Include 13th month pay if applicable',
                'Be transparent about payment schedule'
            ],
            'work_types_tips' => [
                'Select all applicable work types',
                'Maximum 8 work types allowed',
                'Be realistic about workload'
            ],
            'benefits_tips' => [
                'Live-in positions should provide meals/toiletries',
                'Consider adding bonuses for holidays',
                'Specify day-off arrangements clearly'
            ]
        ];
    }
}