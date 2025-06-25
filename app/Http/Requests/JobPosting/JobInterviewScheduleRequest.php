<?php

namespace App\Http\Requests\JobPosting;

use App\Models\JobInterviewSchedule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobInterviewScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only employers can schedule interviews, or admins
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
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'job_posting_id.required' => 'Job posting is required.',
            'job_posting_id.exists' => 'Selected job posting does not exist.',
            'maid_id.required' => 'Maid selection is required.',
            'maid_id.exists' => 'Selected maid does not exist.',
            'job_application_id.exists' => 'Selected job application does not exist.',
            'title.required' => 'Interview title is required.',
            'title.max' => 'Interview title cannot exceed 255 characters.',
            'interview_date.required' => 'Interview date is required.',
            'interview_date.date' => 'Please provide a valid interview date.',
            'interview_date.after_or_equal' => 'Interview date cannot be in the past.',
            'time_start.required' => 'Start time is required.',
            'time_start.date_format' => 'Start time must be in HH:MM format (e.g., 14:30).',
            'time_end.required' => 'End time is required.',
            'time_end.date_format' => 'End time must be in HH:MM format (e.g., 15:30).',
            'time_end.after' => 'End time must be after start time.',
            'status.in' => 'Please select a valid interview status.',
            'description.max' => 'Description cannot exceed 1000 characters.',
            'type.required' => 'Interview type is required.',
            'type.in' => 'Please select a valid interview type.',
            'location.max' => 'Location cannot exceed 500 characters.',
            'meeting_link.url' => 'Meeting link must be a valid URL.',
            'meeting_link.max' => 'Meeting link cannot exceed 500 characters.',
            'employer_notes.max' => 'Employer notes cannot exceed 1000 characters.',
            'maid_notes.max' => 'Maid notes cannot exceed 1000 characters.',
            'employer_rating.min' => 'Rating must be between 1 and 5.',
            'employer_rating.max' => 'Rating must be between 1 and 5.',
            'maid_rating.min' => 'Rating must be between 1 and 5.',
            'maid_rating.max' => 'Rating must be between 1 and 5.',
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
            'job_posting_id' => 'job posting',
            'maid_id' => 'maid',
            'job_application_id' => 'job application',
            'title' => 'interview title',
            'interview_date' => 'interview date',
            'time_start' => 'start time',
            'time_end' => 'end time',
            'status' => 'interview status',
            'description' => 'interview description',
            'type' => 'interview type',
            'location' => 'interview location',
            'meeting_link' => 'meeting link',
            'employer_notes' => 'employer notes',
            'maid_notes' => 'maid notes',
            'employer_rating' => 'employer rating',
            'maid_rating' => 'maid rating',
            'confirmed_at' => 'confirmation date',
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
            $data['description'] = trim($this->description) ?: null;
        }

        if ($this->has('location')) {
            $data['location'] = trim($this->location) ?: null;
        }

        if ($this->has('meeting_link')) {
            $data['meeting_link'] = trim($this->meeting_link) ?: null;
        }

        if ($this->has('employer_notes')) {
            $data['employer_notes'] = trim($this->employer_notes) ?: null;
        }

        if ($this->has('maid_notes')) {
            $data['maid_notes'] = trim($this->maid_notes) ?: null;
        }

        // Convert numeric values
        foreach (['job_posting_id', 'maid_id', 'job_application_id'] as $field) {
            if ($this->has($field)) {
                $data[$field] = is_numeric($this->$field) ? (int) $this->$field : null;
            }
        }

        foreach (['employer_rating', 'maid_rating'] as $field) {
            if ($this->has($field)) {
                $data[$field] = is_numeric($this->$field) ? (int) $this->$field : null;
            }
        }

        // Convert boolean values
        if ($this->has('is_archived')) {
            $data['is_archived'] = filter_var($this->is_archived, FILTER_VALIDATE_BOOLEAN);
        }

        // Set default status for new interviews
        if (!$this->has('status') && $this->isMethod('POST')) {
            $data['status'] = 'scheduled';
        }

        // Clean type field
        if ($this->has('type')) {
            $data['type'] = strtolower(trim($this->type));
        }

        $this->merge($data);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validate job posting ownership
            if ($this->job_posting_id && auth()->user()->hasRole('employer')) {
                $jobPosting = \App\Models\JobPosting::find($this->job_posting_id);

                if ($jobPosting && $jobPosting->employer_id !== auth()->user()->employer->id) {
                    $validator->errors()->add('job_posting_id', 'You can only schedule interviews for your own job postings.');
                }
            }

            // Validate job application belongs to the job posting and maid
            if ($this->job_application_id && $this->job_posting_id && $this->maid_id) {
                $application = \App\Models\JobApplication::find($this->job_application_id);

                if ($application) {
                    if ($application->job_posting_id != $this->job_posting_id) {
                        $validator->errors()->add('job_application_id', 'Job application does not belong to the selected job posting.');
                    }

                    if ($application->maid_id != $this->maid_id) {
                        $validator->errors()->add('job_application_id', 'Job application does not belong to the selected maid.');
                    }
                }
            }

            // Validate interview time constraints
            if ($this->interview_date && $this->time_start && $this->time_end) {
                $startDateTime = \Carbon\Carbon::parse($this->interview_date . ' ' . $this->time_start);
                $endDateTime = \Carbon\Carbon::parse($this->interview_date . ' ' . $this->time_end);

                // Check if interview is not longer than 4 hours
                if ($startDateTime->diffInHours($endDateTime) > 4) {
                    $validator->errors()->add('time_end', 'Interview cannot be longer than 4 hours.');
                }

                // Check if interview is during reasonable hours (7 AM - 10 PM)
                if ($startDateTime->hour < 7 || $endDateTime->hour > 22) {
                    $validator->errors()->add('time_start', 'Please schedule interviews between 7:00 AM and 10:00 PM.');
                }
            }

            // Validate type-specific requirements
            if ($this->type) {
                switch ($this->type) {
                    case 'video_call':
                        if (!$this->meeting_link && $this->isMethod('POST')) {
                            // Meeting link will be auto-generated if not provided
                        }
                        break;

                    case 'in_person':
                    case 'home_visit':
                        if (!$this->location) {
                            $validator->errors()->add('location', 'Location is required for ' . $this->type . ' interviews.');
                        }
                        break;

                    case 'phone_call':
                        // No specific requirements
                        break;
                }
            }

            // Check for scheduling conflicts
            if ($this->interview_date && $this->time_start && $this->time_end && $this->maid_id) {
                $interviewId = $this->route('interview')?->id; // For updates

                $conflictingInterview = JobInterviewSchedule::where('maid_id', $this->maid_id)
                    ->where('interview_date', $this->interview_date)
                    ->whereIn('status', ['scheduled', 'confirmed'])
                    ->when($interviewId, fn($query) => $query->where('id', '!=', $interviewId))
                    ->where(function ($query) {
                        $query->whereBetween('time_start', [$this->time_start, $this->time_end])
                            ->orWhereBetween('time_end', [$this->time_start, $this->time_end])
                            ->orWhere(function ($q) {
                                $q->where('time_start', '<=', $this->time_start)
                                    ->where('time_end', '>=', $this->time_end);
                            });
                    })
                    ->first();

                if ($conflictingInterview) {
                    $validator->errors()->add('time_start', 'The maid already has an interview scheduled during this time.');
                }
            }

            // Validate text fields are not just spaces
            foreach (['title', 'description', 'location'] as $field) {
                if ($this->$field && !trim($this->$field)) {
                    $validator->errors()->add($field, ucfirst(str_replace('_', ' ', $field)) . ' cannot be empty or just spaces.');
                }
            }

            // Validate interview date is not too far in the future
            if ($this->interview_date) {
                $maxDate = now()->addMonths(3);
                if (\Carbon\Carbon::parse($this->interview_date)->gt($maxDate)) {
                    $validator->errors()->add('interview_date', 'Interview cannot be scheduled more than 3 months in advance.');
                }
            }

            // Validate ratings can only be set for completed interviews
            if (($this->employer_rating || $this->maid_rating) && $this->status !== 'completed') {
                $validator->errors()->add('employer_rating', 'Ratings can only be set for completed interviews.');
            }

            // Check maximum interviews per day for maid
            if ($this->interview_date && $this->maid_id && $this->isMethod('POST')) {
                $dailyInterviewsCount = JobInterviewSchedule::where('maid_id', $this->maid_id)
                    ->where('interview_date', $this->interview_date)
                    ->whereIn('status', ['scheduled', 'confirmed'])
                    ->count();

                if ($dailyInterviewsCount >= 3) { // Maximum 3 interviews per day
                    $validator->errors()->add('interview_date', 'Maid already has 3 interviews scheduled for this date. Please choose a different date.');
                }
            }
        });
    }

    /**
     * Get validated data with automatic meeting link generation.
     */
    public function validatedWithMeetingLink(): array
    {
        $validated = $this->validated();

        // Auto-generate meeting link for video calls if not provided
        if ($validated['type'] === 'video_call' && empty($validated['meeting_link'])) {
            // This would integrate with your video calling service
            $validated['meeting_link'] = $this->generateMeetingLink();
        }

        return $validated;
    }

    /**
     * Generate a meeting link for video interviews.
     */
    protected function generateMeetingLink(): string
    {
        // Implement based on video calling service (Zoom, Google Meet, etc.)
        // For now return a placeholder until updated with actual service integration
        $interviewId = uniqid('interview_');
        return "https://meet.example.com/{$interviewId}";
    }

    /**
     * Get available interview options for frontend.
     */
    public static function getFormOptions(): array
    {
        return [
            'statuses' => JobInterviewSchedule::getStatuses(),
            'types' => JobInterviewSchedule::getTypes(),
            'common_titles' => JobInterviewSchedule::getCommonTitles(),
            'time_slots' => self::getCommonTimeSlots(),
            'duration_options' => [
                30 => '30 minutes',
                60 => '1 hour',
                90 => '1.5 hours',
                120 => '2 hours',
                180 => '3 hours',
            ]
        ];
    }

    /**
     * Get common time slots for scheduling.
     */
    public static function getCommonTimeSlots(): array
    {
        $slots = [];
        for ($hour = 7; $hour <= 21; $hour++) {
            foreach ([0, 30] as $minute) {
                $time = sprintf('%02d:%02d', $hour, $minute);
                $display = \Carbon\Carbon::createFromFormat('H:i', $time)->format('g:i A');
                $slots[$time] = $display;
            }
        }
        return $slots;
    }

    /**
     * Get scheduling guidelines for employers.
     */
    public static function getSchedulingGuidelines(): array
    {
        return [
            'timing' => [
                'Schedule between 7:00 AM and 10:00 PM',
                'Minimum 30 minutes, maximum 4 hours',
                'Allow buffer time between interviews',
                'Consider maid\'s travel time for in-person meetings'
            ],
            'interview_types' => [
                'video_call' => 'Best for initial screening - meeting link auto-generated',
                'phone_call' => 'Quick and convenient for basic questions',
                'in_person' => 'Ideal for detailed discussions - location required',
                'home_visit' => 'Perfect for showing the workplace - location required'
            ],
            'preparation' => [
                'Prepare questions in advance',
                'Review maid\'s profile and application',
                'Test video/audio equipment for video calls',
                'Share interview agenda in description'
            ],
            'best_practices' => [
                'Confirm interviews 24 hours in advance',
                'Be punctual and respectful',
                'Provide clear directions for in-person meetings',
                'Rate and provide feedback after completion'
            ],
            'limits' => [
                'Maximum 3 interviews per maid per day',
                'Cannot schedule more than 3 months in advance',
                'No overlapping time slots for same maid'
            ]
        ];
    }
}