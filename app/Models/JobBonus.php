<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobBonus extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_posting_id',
        'title',
        'amount',
        'status',
        'description',
        'type',
        'frequency',
        'conditions',
        'is_archived',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_archived' => 'boolean',
    ];

    /**
     * Common bonus types
     */
    const BONUS_TYPES = [
        'monetary' => 'Monetary Bonus',
        'benefit' => 'Benefit/Perk',
        'allowance' => 'Allowance',
    ];

    /**
     * Bonus frequencies
     */
    const FREQUENCIES = [
        'one_time' => 'One Time',
        'monthly' => 'Monthly',
        'quarterly' => 'Quarterly',
        'yearly' => 'Yearly',
        'performance_based' => 'Performance Based',
    ];

    /**
     * Bonus statuses
     */
    const STATUSES = [
        'active' => 'Active',
        'inactive' => 'Inactive',
        'conditional' => 'Conditional',
    ];

    /**
     * Common bonus titles
     */
    const COMMON_BONUSES = [
        '13th_month' => '13th Month Pay',
        'holiday_bonus' => 'Holiday Bonus',
        'performance_bonus' => 'Performance Bonus',
        'overtime_pay' => 'Overtime Pay',
        'night_differential' => 'Night Differential',
        'transportation_allowance' => 'Transportation Allowance',
        'meal_allowance' => 'Meal Allowance',
        'phone_allowance' => 'Phone Allowance',
        'uniform_allowance' => 'Uniform Allowance',
        'health_insurance' => 'Health Insurance',
        'birthday_bonus' => 'Birthday Bonus',
        'loyalty_bonus' => 'Loyalty Bonus',
    ];

    /**
     * Relationships
     */
    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class, 'job_posting_id');
    }

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    public function scopeConditional($query)
    {
        return $query->where('status', 'conditional');
    }

    public function scopeNotArchived($query)
    {
        return $query->where('is_archived', false);
    }

    public function scopeMonetary($query)
    {
        return $query->where('type', 'monetary');
    }

    public function scopeBenefits($query)
    {
        return $query->where('type', 'benefit');
    }

    public function scopeAllowances($query)
    {
        return $query->where('type', 'allowance');
    }

    public function scopeRecurring($query)
    {
        return $query->whereIn('frequency', ['monthly', 'quarterly', 'yearly']);
    }

    public function scopeOneTime($query)
    {
        return $query->where('frequency', 'one_time');
    }

    public function scopePerformanceBased($query)
    {
        return $query->where('frequency', 'performance_based');
    }

    public function scopeWithAmount($query)
    {
        return $query->whereNotNull('amount')->where('amount', '>', 0);
    }

    /**
     * Accessors
     */
    public function getTypeLabelAttribute()
    {
        return self::BONUS_TYPES[$this->type] ?? ucfirst($this->type);
    }

    public function getFrequencyLabelAttribute()
    {
        return self::FREQUENCIES[$this->frequency] ?? ucfirst(str_replace('_', ' ', $this->frequency));
    }

    public function getStatusLabelAttribute()
    {
        return self::STATUSES[$this->status] ?? ucfirst($this->status);
    }

    public function getFormattedAmountAttribute()
    {
        if (!$this->amount) return 'N/A';

        return '₱' . number_format($this->amount, 2);
    }

    public function getIsMonetaryAttribute()
    {
        return $this->type === 'monetary';
    }

    public function getIsBenefitAttribute()
    {
        return $this->type === 'benefit';
    }

    public function getIsAllowanceAttribute()
    {
        return $this->type === 'allowance';
    }

    public function getIsActiveAttribute()
    {
        return $this->status === 'active';
    }

    public function getIsConditionalAttribute()
    {
        return $this->status === 'conditional';
    }

    public function getIsRecurringAttribute()
    {
        return in_array($this->frequency, ['monthly', 'quarterly', 'yearly']);
    }

    public function getIsPerformanceBasedAttribute()
    {
        return $this->frequency === 'performance_based';
    }

    public function getHasConditionsAttribute()
    {
        return !empty($this->conditions);
    }

    public function getDisplayTitleAttribute()
    {
        $title = $this->title;

        if ($this->amount) {
            $title .= " ({$this->formatted_amount})";
        }

        if ($this->frequency && $this->frequency !== 'one_time') {
            $title .= " - {$this->frequency_label}";
        }

        return $title;
    }

    public function getYearlyValueAttribute()
    {
        if (!$this->amount) return 0;

        return match ($this->frequency) {
            'monthly' => $this->amount * 12,
            'quarterly' => $this->amount * 4,
            'yearly' => $this->amount,
            'one_time' => $this->amount,
            default => 0
        };
    }

    /**
     * Helper Methods
     */
    public function activate()
    {
        $this->update(['status' => 'active']);
    }

    public function deactivate()
    {
        $this->update(['status' => 'inactive']);
    }

    public function makeConditional($conditions = null)
    {
        $updateData = ['status' => 'conditional'];

        if ($conditions) {
            $updateData['conditions'] = $conditions;
        }

        $this->update($updateData);
    }

    public function archive()
    {
        $this->update(['is_archived' => true]);
    }

    public function unarchive()
    {
        $this->update(['is_archived' => false]);
    }

    public function isEligible($conditions = [])
    {
        if (!$this->is_active) return false;

        if (!$this->is_conditional) return true;

        // Custom eligibility logic based on conditions
        // This would be implemented based on specific business rules
        return true;
    }

    /**
     * Static Methods
     */
    public static function getBonusTypes()
    {
        return self::BONUS_TYPES;
    }

    public static function getFrequencies()
    {
        return self::FREQUENCIES;
    }

    public static function getStatuses()
    {
        return self::STATUSES;
    }

    public static function getCommonBonuses()
    {
        return self::COMMON_BONUSES;
    }

    public static function calculateTotalYearlyValue(JobPosting $jobPosting)
    {
        return $jobPosting->bonuses()
            ->active()
            ->notArchived()
            ->withAmount()
            ->get()
            ->sum('yearly_value');
    }

    public static function getActiveMonetaryBonuses(JobPosting $jobPosting)
    {
        return $jobPosting->bonuses()
            ->active()
            ->notArchived()
            ->monetary()
            ->withAmount()
            ->get();
    }

    public static function getBonusSummary(JobPosting $jobPosting)
    {
        $bonuses = $jobPosting->bonuses()->active()->notArchived();

        return [
            'total_count' => $bonuses->count(),
            'monetary_count' => $bonuses->monetary()->count(),
            'benefit_count' => $bonuses->benefits()->count(),
            'allowance_count' => $bonuses->allowances()->count(),
            'total_yearly_value' => self::calculateTotalYearlyValue($jobPosting),
            'recurring_bonuses' => $bonuses->recurring()->count(),
            'one_time_bonuses' => $bonuses->oneTime()->count(),
            'performance_based' => $bonuses->performanceBased()->count(),
        ];
    }

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        // Ensure amount is positive
        static::saving(function ($bonus) {
            if ($bonus->amount && $bonus->amount < 0) {
                $bonus->amount = 0;
            }
        });
    }
}