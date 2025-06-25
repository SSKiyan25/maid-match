<?php

namespace App\Http\Requests\JobPosting;

use App\Models\JobBonus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class JobBonusRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Only employers can manage their job bonuses, or admins
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
     *
     * @return array<string, string>
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

    /**
     * Get custom attribute names for validation errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'job_posting_id' => 'job posting',
            'title' => 'bonus title',
            'amount' => 'bonus amount',
            'type' => 'bonus type',
            'frequency' => 'bonus frequency',
            'status' => 'bonus status',
            'description' => 'bonus description',
            'conditions' => 'bonus conditions',
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

        if ($this->has('conditions')) {
            $data['conditions'] = trim($this->conditions) ?: null;
        }

        // Clean type and frequency fields
        if ($this->has('type')) {
            $data['type'] = strtolower(trim($this->type));
        }

        if ($this->has('frequency')) {
            $data['frequency'] = strtolower(trim($this->frequency));
        }

        if ($this->has('status')) {
            $data['status'] = strtolower(trim($this->status));
        }

        // Convert numeric values
        if ($this->has('job_posting_id')) {
            $data['job_posting_id'] = (int) $this->job_posting_id;
        }

        if ($this->has('amount')) {
            $data['amount'] = is_numeric($this->amount) ? (float) $this->amount : null;
        }

        // Convert boolean values
        if ($this->has('is_archived')) {
            $data['is_archived'] = filter_var($this->is_archived, FILTER_VALIDATE_BOOLEAN);
        }

        // Set default status for new bonuses
        if (!$this->has('status') && $this->isMethod('POST')) {
            $data['status'] = 'active';
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
                    $validator->errors()->add('job_posting_id', 'You can only add bonuses to your own job postings.');
                }
            }

            // Validate type-specific requirements
            if ($this->type === 'monetary') {
                if (!$this->amount || $this->amount <= 0) {
                    $validator->errors()->add('amount', 'Amount is required for monetary bonuses and must be greater than 0.');
                }
            }

            if ($this->type === 'benefit' && !$this->description) {
                $validator->errors()->add('description', 'Description is required for benefits to explain what is included.');
            }

            // Validate frequency-specific requirements
            if ($this->frequency === 'performance_based') {
                if (!$this->conditions) {
                    $validator->errors()->add('conditions', 'Conditions are required for performance-based bonuses.');
                }

                // Set status to conditional for performance-based bonuses
                if ($this->status !== 'conditional') {
                    $this->merge(['status' => 'conditional']);
                }
            }

            // Validate conditional status requirements
            if ($this->status === 'conditional' && !$this->conditions) {
                $validator->errors()->add('conditions', 'Conditions are required when status is conditional.');
            }

            // Validate common bonus amounts
            if ($this->amount && $this->type === 'monetary') {
                // Validate reasonable amounts based on frequency
                switch ($this->frequency) {
                    case 'monthly':
                        if ($this->amount > 50000) {
                            $validator->errors()->add('amount', 'Monthly bonus amount seems unusually high. Please verify.');
                        }
                        break;
                    case 'yearly':
                        if ($this->amount > 200000) {
                            $validator->errors()->add('amount', 'Yearly bonus amount seems unusually high. Please verify.');
                        }
                        break;
                    case 'one_time':
                        if ($this->amount > 100000) {
                            $validator->errors()->add('amount', 'One-time bonus amount seems unusually high. Please verify.');
                        }
                        break;
                }
            }

            // Check for duplicate bonus titles for the same job posting
            if ($this->title && $this->job_posting_id) {
                $bonusId = $this->route('bonus')?->id; // For updates

                $duplicateExists = JobBonus::where('job_posting_id', $this->job_posting_id)
                    ->where('title', $this->title)
                    ->when($bonusId, fn($query) => $query->where('id', '!=', $bonusId))
                    ->notArchived()
                    ->exists();

                if ($duplicateExists) {
                    $validator->errors()->add('title', 'A bonus with this title already exists for this job posting.');
                }
            }

            // Validate maximum bonuses per job posting
            if ($this->job_posting_id && $this->isMethod('POST')) {
                $existingBonusesCount = JobBonus::where('job_posting_id', $this->job_posting_id)
                    ->notArchived()
                    ->count();

                if ($existingBonusesCount >= 15) { // Maximum 15 bonuses per job
                    $validator->errors()->add('title', 'You cannot add more than 15 bonuses per job posting.');
                }
            }

            // Validate text fields are not just spaces
            foreach (['title', 'description', 'conditions'] as $field) {
                if ($this->$field && !trim($this->$field)) {
                    $validator->errors()->add($field, ucfirst($field) . ' cannot be empty or just spaces.');
                }
            }

            // Validate 13th month pay logic
            if (str_contains(strtolower($this->title), '13th month')) {
                if ($this->frequency !== 'yearly') {
                    $validator->errors()->add('frequency', '13th month pay should typically be yearly frequency.');
                }

                if ($this->type !== 'monetary') {
                    $validator->errors()->add('type', '13th month pay should be monetary type.');
                }
            }

            // Validate allowance logic
            if ($this->type === 'allowance') {
                $allowanceKeywords = ['allowance', 'reimbursement', 'subsidy'];
                $hasAllowanceKeyword = false;

                foreach ($allowanceKeywords as $keyword) {
                    if (str_contains(strtolower($this->title), $keyword)) {
                        $hasAllowanceKeyword = true;
                        break;
                    }
                }

                if (!$hasAllowanceKeyword) {
                    // This is just a suggestion, not an error
                }
            }

            // Validate benefit descriptions
            if ($this->type === 'benefit' && $this->description) {
                $wordCount = str_word_count($this->description);
                if ($wordCount < 3) {
                    $validator->errors()->add('description', 'Benefit description should be more detailed (at least 3 words).');
                }
            }
        });
    }

    /**
     * Get validated data with automatic status handling.
     */
    public function validatedWithStatusLogic(): array
    {
        $validated = $this->validated();

        // Auto-set conditional status for performance-based bonuses
        if ($validated['frequency'] === 'performance_based') {
            $validated['status'] = 'conditional';
        }

        // Ensure conditions are set for conditional bonuses
        if ($validated['status'] === 'conditional' && empty($validated['conditions'])) {
            $validated['conditions'] = 'Conditions to be determined based on performance metrics.';
        }

        return $validated;
    }

    /**
     * Get available bonus options for frontend.
     */
    public static function getFormOptions(): array
    {
        return [
            'types' => JobBonus::getBonusTypes(),
            'frequencies' => JobBonus::getFrequencies(),
            'statuses' => JobBonus::getStatuses(),
            'common_bonuses' => JobBonus::getCommonBonuses(),
            'suggested_amounts' => self::getSuggestedAmounts(),
        ];
    }

    /**
     * Get suggested amounts for different bonus types.
     */
    public static function getSuggestedAmounts(): array
    {
        return [
            'monthly_allowances' => [
                'transportation' => [500, 1000, 1500, 2000],
                'meal' => [1000, 1500, 2000, 3000],
                'phone' => [300, 500, 800, 1000],
                'uniform' => [500, 1000],
            ],
            'yearly_bonuses' => [
                '13th_month' => 'Based on monthly salary',
                'performance' => [5000, 10000, 15000, 20000],
                'loyalty' => [2000, 5000, 10000],
                'holiday' => [1000, 2000, 3000, 5000],
            ],
            'one_time_bonuses' => [
                'signing' => [2000, 5000, 8000, 10000],
                'referral' => [1000, 2000, 3000],
                'birthday' => [500, 1000, 2000],
            ]
        ];
    }

    /**
     * Get bonus creation guidelines for employers.
     */
    public static function getBonusGuidelines(): array
    {
        return [
            'best_practices' => [
                'Be specific with bonus titles',
                'Clearly define conditions for performance-based bonuses',
                'Set realistic and fair amounts',
                'Consider the frequency impact on your budget',
                'Use benefits for non-monetary perks'
            ],
            'common_bonuses' => [
                'highly_recommended' => [
                    '13th Month Pay' => 'Highly recommended and expected by most workers in Philippines',
                    'Holiday Pay' => 'For work on legal holidays'
                ],
                'recommended' => [
                    'Performance Bonus' => 'Motivates good work',
                    'Transportation Allowance' => 'Helps with commute costs',
                    'Meal Allowance' => 'Covers food expenses',
                    'Health Insurance' => 'Important benefit'
                ],
                'optional' => [
                    'Birthday Bonus' => 'Personal touch',
                    'Loyalty Bonus' => 'Retains good workers',
                    'Overtime Pay' => 'For extra hours'
                ]
            ],
            'type_explanations' => [
                'monetary' => 'Cash bonuses and allowances - requires amount',
                'benefit' => 'Non-cash perks like insurance, meals - describe in detail',
                'allowance' => 'Regular allowances for specific expenses'
            ],
            'frequency_tips' => [
                'one_time' => 'For signing bonuses, special occasions',
                'monthly' => 'Regular allowances like transportation',
                'quarterly' => 'Performance reviews, seasonal bonuses',
                'yearly' => '13th month, annual performance bonus',
                'performance_based' => 'Tied to specific achievements - set clear conditions'
            ],
            'suggestions' => [
                '13th month pay greatly increases job attractiveness to candidates',
                'Performance bonuses should have clear, achievable criteria',
                'Consider tax implications for large bonuses',
                'Document all bonus conditions clearly',
                'Competitive bonuses help attract and retain quality workers'
            ]
        ];
    }
}