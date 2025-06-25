<?php

namespace App\Http\Requests\JobPosting;

use App\Models\JobApplication;
use App\Models\JobPosting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobApplicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only maids can apply for jobs, or admins
        if (auth()->user()->hasRole('admin')) {
            return true;
        }

        // Maids can apply for jobs
        if (auth()->user()->hasRole('maid')) {
            return true;
        }

        // Employers can update application status for their own job postings
        if (auth()->user()->hasRole('employer') && $this->isMethod('PATCH')) {
            $application = $this->route('application');
            if ($application) {
                return $application->jobPosting->employer_id === auth()->user()->employer->id;
            }
        }

        return false;
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
            'status' => ['sometimes', 'string', Rule::in(array_keys(JobApplication::STATUSES))],
            'ranking_position' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'employer_notes' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'description' => ['nullable', 'string', 'max:1000'],
            'proposed_salary' => ['nullable', 'numeric', 'min:0', 'max:999999.99'],
            'is_archived' => ['sometimes', 'boolean'],
        ];

        // Maids applying for jobs
        if ($this->isMethod('POST') && auth()->user()->hasRole('maid')) {
            $rules['maid_id'] = ['sometimes', 'integer', 'exists:maids,id'];
            $rules['description'] = ['required', 'string', 'min:50', 'max:1000'];
        }

        // Employers updating applications
        if ($this->isMethod('PATCH') && auth()->user()->hasRole('employer')) {
            unset($rules['job_posting_id']); // Can't change job posting
            $rules['status'] = ['sometimes', 'string', Rule::in(array_keys(JobApplication::STATUSES))];
        }

        // Admin updates
        if (auth()->user()->hasRole('admin')) {
            $rules['maid_id'] = ['sometimes', 'integer', 'exists:maids,id'];
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
            'maid_id.exists' => 'Selected maid does not exist.',
            'status.in' => 'Please select a valid application status.',
            'ranking_position.min' => 'Ranking position must be at least 1.',
            'employer_notes.max' => 'Employer notes cannot exceed 2000 characters.',
            'description.required' => 'Application description is required.',
            'description.min' => 'Application description must be at least 50 characters.',
            'description.max' => 'Application description cannot exceed 1000 characters.',
            'proposed_salary.numeric' => 'Proposed salary must be a valid number.',
            'proposed_salary.min' => 'Proposed salary cannot be negative.',
            'proposed_salary.max' => 'Proposed salary cannot exceed ₱999,999.99.',
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
            'status' => 'application status',
            'ranking_position' => 'ranking position',
            'employer_notes' => 'employer notes',
            'description' => 'application description',
            'proposed_salary' => 'proposed salary',
            'is_archived' => 'archive status',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $data = [];

        // Auto-set maid_id for authenticated maids
        if (auth()->user()->hasRole('maid') && !$this->has('maid_id')) {
            $data['maid_id'] = auth()->user()->maid->id;
        }

        // Clean and prepare text fields
        if ($this->has('description')) {
            $data['description'] = trim($this->description) ?: null;
        }

        if ($this->has('employer_notes')) {
            $data['employer_notes'] = trim($this->employer_notes) ?: null;
        }

        // Clean status field
        if ($this->has('status')) {
            $data['status'] = strtolower(trim($this->status));
        }

        // Convert numeric values
        if ($this->has('job_posting_id')) {
            $data['job_posting_id'] = (int) $this->job_posting_id;
        }

        if ($this->has('maid_id')) {
            $data['maid_id'] = (int) $this->maid_id;
        }

        if ($this->has('ranking_position')) {
            $data['ranking_position'] = is_numeric($this->ranking_position) ? (int) $this->ranking_position : null;
        }

        if ($this->has('proposed_salary')) {
            $data['proposed_salary'] = is_numeric($this->proposed_salary) ? (float) $this->proposed_salary : null;
        }

        // Convert boolean values
        if ($this->has('is_archived')) {
            $data['is_archived'] = filter_var($this->is_archived, FILTER_VALIDATE_BOOLEAN);
        }

        // Set default status for new applications
        if (!$this->has('status') && $this->isMethod('POST')) {
            $data['status'] = 'pending';
        }

        $this->merge($data);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validate job posting is open for applications
            if ($this->job_posting_id && $this->isMethod('POST')) {
                $jobPosting = JobPosting::find($this->job_posting_id);

                if (!$jobPosting) {
                    $validator->errors()->add('job_posting_id', 'Job posting not found.');
                    return;
                }

                if ($jobPosting->status !== 'active') {
                    $validator->errors()->add('job_posting_id', 'This job posting is not accepting applications.');
                }

                if ($jobPosting->is_filled) {
                    $validator->errors()->add('job_posting_id', 'This position has already been filled.');
                }

                if ($jobPosting->application_deadline && $jobPosting->application_deadline->isPast()) {
                    $validator->errors()->add('job_posting_id', 'The application deadline for this job has passed.');
                }
            }

            // Check for duplicate applications
            if ($this->job_posting_id && $this->maid_id && $this->isMethod('POST')) {
                $existingApplication = JobApplication::where('job_posting_id', $this->job_posting_id)
                    ->where('maid_id', $this->maid_id)
                    ->notArchived()
                    ->whereNotIn('status', ['withdrawn'])
                    ->first();

                if ($existingApplication) {
                    $validator->errors()->add('job_posting_id', 'You have already applied for this job posting.');
                }
            }

            // Validate salary proposal against job posting
            if ($this->proposed_salary && $this->job_posting_id) {
                $jobPosting = JobPosting::find($this->job_posting_id);

                if ($jobPosting) {
                    if ($jobPosting->min_salary && $this->proposed_salary < $jobPosting->min_salary) {
                        $validator->errors()->add(
                            'proposed_salary',
                            'Proposed salary is below the minimum salary of ₱' . number_format($jobPosting->min_salary, 2) . ' for this position.'
                        );
                    }

                    if ($jobPosting->max_salary && $this->proposed_salary > ($jobPosting->max_salary * 1.5)) {
                        $validator->errors()->add(
                            'proposed_salary',
                            'Proposed salary is significantly higher than the maximum salary range for this position.'
                        );
                    }
                }
            }

            // Validate status transitions for employers
            if ($this->status && $this->isMethod('PATCH') && auth()->user()->hasRole('employer')) {
                $application = $this->route('application');

                if ($application) {
                    $currentStatus = $application->status;
                    $newStatus = $this->status;

                    // Validate logical status transitions
                    $validTransitions = [
                        'pending' => ['reviewed', 'shortlisted', 'rejected'],
                        'reviewed' => ['shortlisted', 'rejected', 'accepted'],
                        'shortlisted' => ['accepted', 'rejected'],
                        'rejected' => [], // Cannot change from rejected
                        'accepted' => [], // Cannot change from accepted
                        'withdrawn' => [], // Cannot change from withdrawn
                    ];

                    if (!in_array($newStatus, $validTransitions[$currentStatus] ?? [])) {
                        $validator->errors()->add(
                            'status',
                            "Cannot change status from '{$currentStatus}' to '{$newStatus}'."
                        );
                    }

                    // Only one application can be accepted per job
                    if ($newStatus === 'accepted') {
                        $existingAccepted = JobApplication::where('job_posting_id', $application->job_posting_id)
                            ->where('id', '!=', $application->id)
                            ->where('status', 'accepted')
                            ->exists();

                        if ($existingAccepted) {
                            $validator->errors()->add('status', 'Another application has already been accepted for this job posting.');
                        }
                    }
                }
            }

            // Validate maid eligibility
            if ($this->maid_id && $this->job_posting_id && $this->isMethod('POST')) {
                $maid = \App\Models\Maid::find($this->maid_id);
                $jobPosting = JobPosting::find($this->job_posting_id);

                if ($maid && $jobPosting) {
                    // Check if maid profile is complete
                    if (!$maid->is_profile_complete) {
                        $validator->errors()->add('maid_id', 'Please complete your profile before applying for jobs.');
                    }

                    // Check if maid is available
                    if (!$maid->is_available) {
                        $validator->errors()->add('maid_id', 'You must be available to work to apply for jobs.');
                    }

                    // Check age requirements
                    if ($jobPosting->min_age && $maid->age < $jobPosting->min_age) {
                        $validator->errors()->add('maid_id', "You must be at least {$jobPosting->min_age} years old for this position.");
                    }

                    if ($jobPosting->max_age && $maid->age > $jobPosting->max_age) {
                        $validator->errors()->add('maid_id', "The maximum age for this position is {$jobPosting->max_age} years.");
                    }

                    // Check experience requirements
                    if ($jobPosting->min_experience_years && $maid->years_of_experience < $jobPosting->min_experience_years) {
                        $validator->errors()->add('maid_id', "This position requires at least {$jobPosting->min_experience_years} years of experience.");
                    }
                }
            }

            // Validate application description quality
            if ($this->description && $this->isMethod('POST')) {
                $wordCount = str_word_count($this->description);
                if ($wordCount < 10) {
                    $validator->errors()->add('description', 'Application description should be more detailed (at least 10 words).');
                }

                // Check for generic/template descriptions
                $genericPhrases = [
                    'i am interested in this job',
                    'please hire me',
                    'i need this job',
                    'i want to work',
                ];

                $descriptionLower = strtolower($this->description);
                foreach ($genericPhrases as $phrase) {
                    if (str_contains($descriptionLower, $phrase)) {
                        $validator->errors()->add('description', 'Please write a personalized application message that highlights your qualifications for this specific position.');
                        break;
                    }
                }
            }

            // Validate text fields are not just spaces
            foreach (['description', 'employer_notes'] as $field) {
                if ($this->$field && !trim($this->$field)) {
                    $validator->errors()->add($field, ucfirst(str_replace('_', ' ', $field)) . ' cannot be empty or just spaces.');
                }
            }

            // Check application limits
            if ($this->maid_id && $this->isMethod('POST')) {
                $dailyApplications = JobApplication::where('maid_id', $this->maid_id)
                    ->where('applied_at', '>=', now()->startOfDay())
                    ->count();

                if ($dailyApplications >= 10) { // Maximum 10 applications per day
                    $validator->errors()->add('maid_id', 'You have reached the daily limit of 10 job applications. Please try again tomorrow.');
                }

                $activeApplications = JobApplication::where('maid_id', $this->maid_id)
                    ->whereIn('status', ['pending', 'reviewed', 'shortlisted'])
                    ->count();

                if ($activeApplications >= 25) { // Maximum 25 active applications
                    $validator->errors()->add('maid_id', 'You have reached the limit of 25 active applications. Please wait for responses or withdraw some applications.');
                }
            }

            // Validate ranking position uniqueness
            if ($this->ranking_position && $this->job_posting_id && $this->isMethod('PATCH')) {
                $application = $this->route('application');

                if ($application) {
                    $existingRanking = JobApplication::where('job_posting_id', $this->job_posting_id)
                        ->where('id', '!=', $application->id)
                        ->where('ranking_position', $this->ranking_position)
                        ->exists();

                    if ($existingRanking) {
                        $validator->errors()->add('ranking_position', 'This ranking position is already taken by another application.');
                    }
                }
            }
        });
    }

    /**
     * Get validated data with automatic field handling.
     */
    public function validatedWithDefaults(): array
    {
        $validated = $this->validated();

        // Set applied_at for new applications
        if ($this->isMethod('POST') && !isset($validated['applied_at'])) {
            $validated['applied_at'] = now();
        }

        // Set reviewed_at when status changes from pending
        if (isset($validated['status']) && $this->isMethod('PATCH')) {
            $application = $this->route('application');
            if ($application && $application->status === 'pending' && $validated['status'] !== 'pending') {
                $validated['reviewed_at'] = now();
            }
        }

        return $validated;
    }

    /**
     * Get available application options for frontend.
     */
    public static function getFormOptions(): array
    {
        return [
            'statuses' => JobApplication::getStatuses(),
            'active_statuses' => JobApplication::getActiveStatuses(),
            'status_progression' => JobApplication::STATUS_PROGRESSION,
            'application_tips' => self::getApplicationTips(),
        ];
    }

    /**
     * Get application tips for maids.
     */
    public static function getApplicationTips(): array
    {
        return [
            'description_tips' => [
                'Highlight your relevant experience and skills',
                'Mention specific qualifications that match the job requirements',
                'Explain why you are interested in this particular position',
                'Be professional and use proper grammar',
                'Avoid generic phrases - personalize your application',
                'Keep it concise but informative (50-1000 characters)',
            ],
            'salary_tips' => [
                'Research market rates for similar positions',
                'Consider your experience level and qualifications',
                'Stay within or slightly above the posted salary range',
                'Leave blank if you are flexible with salary',
                'Remember that benefits and bonuses add value',
            ],
            'best_practices' => [
                'Complete your profile before applying',
                'Apply only to jobs that match your skills and availability',
                'Read job descriptions carefully',
                'Apply promptly - early applications get more attention',
                'Follow up professionally if you don\'t hear back within a week',
                'Maximum 10 applications per day, 25 active applications total',
            ],
            'what_employers_look_for' => [
                'Relevant experience and skills',
                'Professional communication',
                'Genuine interest in the position',
                'Flexibility and positive attitude',
                'Reliability and trustworthiness',
                'Good references and ratings',
            ]
        ];
    }

    /**
     * Get employer application management guidelines.
     */
    public static function getEmployerGuidelines(): array
    {
        return [
            'review_process' => [
                'Review applications promptly (within 3-5 days)',
                'Provide clear feedback in employer notes',
                'Use ranking system to organize preferred candidates',
                'Shortlist 3-5 top candidates for interviews',
                'Communicate decisions professionally',
            ],
            'status_meanings' => [
                'pending' => 'New application awaiting review',
                'reviewed' => 'Application has been reviewed',
                'shortlisted' => 'Candidate selected for interview',
                'accepted' => 'Candidate hired for the position',
                'rejected' => 'Application declined',
                'withdrawn' => 'Candidate withdrew application',
            ],
            'best_practices' => [
                'Be fair and objective in your evaluations',
                'Consider both experience and attitude',
                'Schedule interviews promptly for shortlisted candidates',
                'Keep detailed notes for decision making',
                'Provide constructive feedback when possible',
            ]
        ];
    }
}