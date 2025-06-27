import { validateAndSanitizeInput, validateSelectValue } from './securityValidation';
import { Step3Data } from "./types";

// Define allowed values for select fields
const ALLOWED_WORK_TYPES = [
    'general_housework', 'childcare', 'elderly_care', 'cooking_cleaning',
    'laundry_ironing', 'pet_care', 'all_around'
];

const ALLOWED_ACCOMMODATIONS = ['live_in', 'live_out', 'flexible'];

const ALLOWED_SCHEDULES = [
    'full_time', 'part_time', 'weekdays_only', 'weekends_only', 'as_needed'
];

const ALLOWED_EXPERIENCE_LEVELS = [
    'no_experience', 'some_experience', 'experienced', 'very_experienced', 'specific_skills'
];

export const validateStep3 = (currentData: Step3Data) => {
    const newErrors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    // Validate work type
    if (currentData.work_type) {
        const workTypeValidation = validateSelectValue(currentData.work_type, ALLOWED_WORK_TYPES);
        if (!workTypeValidation.isValid) {
            newErrors.work_type = workTypeValidation.error!;
        }
    }

    // Validate accommodation
    if (currentData.accommodation) {
        const accommodationValidation = validateSelectValue(currentData.accommodation, ALLOWED_ACCOMMODATIONS);
        if (!accommodationValidation.isValid) {
            newErrors.accommodation = accommodationValidation.error!;
        }
    }

    // Validate schedule
    if (currentData.schedule) {
        const scheduleValidation = validateSelectValue(currentData.schedule, ALLOWED_SCHEDULES);
        if (!scheduleValidation.isValid) {
            newErrors.schedule = scheduleValidation.error!;
        }
    }

    // Validate experience needed
    if (currentData.experience_needed) {
        const experienceValidation = validateSelectValue(currentData.experience_needed, ALLOWED_EXPERIENCE_LEVELS);
        if (!experienceValidation.isValid) {
            newErrors.experience_needed = experienceValidation.error!;
        }
    }

    // Budget validation with security
    if (currentData.budget_min || currentData.budget_max) {
        const minStr = currentData.budget_min?.toString() || '';
        const maxStr = currentData.budget_max?.toString() || '';
        
        const minSecurity = validateAndSanitizeInput(minStr, 'number', 10);
        const maxSecurity = validateAndSanitizeInput(maxStr, 'number', 10);

        if (!minSecurity.isValid) {
            newErrors.budget_min = minSecurity.securityIssues.join(', ');
        }
        if (!maxSecurity.isValid) {
            newErrors.budget_max = maxSecurity.securityIssues.join(', ');
        }

        // Logical validation
        if (currentData.budget_min && currentData.budget_max) {
            if (currentData.budget_min > currentData.budget_max) {
                newErrors.budget_range = "Minimum budget cannot be greater than maximum budget";
            }
            if (currentData.budget_min < 5000) {
                warnings.budget_min = "Consider if this budget is realistic for the Philippines market";
            }
            if (currentData.budget_max > 100000) {
                warnings.budget_max = "This seems like a very high budget range";
            }
        }

        // Budget consistency check
        if ((currentData.budget_min && !currentData.budget_max) || 
            (!currentData.budget_min && currentData.budget_max)) {
            newErrors.budget_range = "Please provide both minimum and maximum budget or leave both empty";
        }
    }

    // Validate special requirements
    if (currentData.special_requirements) {
        const specialReqSecurity = validateAndSanitizeInput(currentData.special_requirements, 'textarea', 500);
        if (!specialReqSecurity.isValid) {
            newErrors.special_requirements = specialReqSecurity.securityIssues.join(', ');
        } else if (specialReqSecurity.sanitizedValue.length > 500) {
            newErrors.special_requirements = "Special requirements cannot exceed 500 characters";
        }
    }

    // Work type and accommodation compatibility warnings
    if (currentData.work_type === "elderly_care" && currentData.accommodation === "live_out") {
        warnings.accommodation = "Elderly care typically works better with live-in arrangements";
    }

    if (currentData.work_type === "childcare" && currentData.schedule === "weekends_only") {
        warnings.schedule = "Childcare usually requires more regular scheduling";
    }

    return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors,
        warnings: warnings,
        hasData: hasAnyData(currentData)
    };
};

export const hasAnyData = (data: Step3Data): boolean => {
    return !!(
        data.work_type ||
        data.accommodation ||
        data.budget_min ||
        data.budget_max ||
        data.schedule ||
        data.experience_needed ||
        data.special_requirements
    );
};

export const createMaidPreferences = (data: Step3Data): string => {
    // Sanitize before creating JSON
    const specialReqSecurity = validateAndSanitizeInput(data.special_requirements || '', 'textarea', 500);
    
    const maidPreferences = {
        work_type: data.work_type || null,
        accommodation: data.accommodation || null,
        budget_range: (data.budget_min || data.budget_max) 
            ? `₱${data.budget_min || 0} - ₱${data.budget_max || 0}`
            : null,
        schedule: data.schedule || null,
        experience_needed: data.experience_needed || null,
        special_requirements: specialReqSecurity.sanitizedValue || null,
    };

    // Remove null values
    const cleanPreferences = Object.fromEntries(
        Object.entries(maidPreferences).filter(([_, v]) => v !== null)
    );

    return JSON.stringify(cleanPreferences);
};

export const getCompletionPercentage = (data: Step3Data): number => {
    const fields = [
        'work_type',
        'accommodation', 
        'schedule',
        'experience_needed'
    ];
    
    const budgetComplete = !!(data.budget_min && data.budget_max);
    const fieldsComplete = fields.filter(field => !!data[field as keyof Step3Data]).length;
    const specialReqComplete = !!data.special_requirements;
    
    const totalPossible = fields.length + 1 + 1; // fields + budget + special_req
    const completed = fieldsComplete + (budgetComplete ? 1 : 0) + (specialReqComplete ? 1 : 0);
    
    return Math.round((completed / totalPossible) * 100);
};