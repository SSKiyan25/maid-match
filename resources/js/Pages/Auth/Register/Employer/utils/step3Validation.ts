import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";
import { Step3Data, ValidationResult } from "./types";

export interface Step3ValidationResult extends ValidationResult {
    warnings: Record<string, string>;
    sanitizedData?: Step3Data;
    hasData: boolean;
}

function validateBudget(budget: number | undefined, field: string) {
    if (budget === undefined || budget === null || budget === 0) return { value: undefined };
    if (typeof budget !== "number" || isNaN(budget) || budget < 0) {
        return { error: `${field} must be a positive number.` };
    }
    return { value: budget };
}

function validateSpecialRequirements(text: string | undefined) {
    if (!text) return { value: "" };
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(text, "textarea", 500);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (sanitizedValue.length > 500) return { error: "Special requirements cannot exceed 500 characters." };
    return { value: sanitizedValue };
}

export function validateStep3(data: Step3Data): Step3ValidationResult {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};
    const sanitizedData: Partial<Step3Data> = {};

    // Security check for all fields
    const fieldTypes = {
        work_type: "select",
        accommodation: "select",
        schedule: "select",
        experience_needed: "select",
        special_requirements: "textarea",
    } as const;
    const securityCheck = validateFormSecurity(data, fieldTypes);
    if (!securityCheck.isSecure) {
        securityCheck.suspiciousFields.forEach((field) => {
            errors[field as string] = "Suspicious or invalid input detected.";
        });
    }

    // Directly assign select values (already validated by UI)
    sanitizedData.work_type = data.work_type || "";
    sanitizedData.accommodation = data.accommodation || "";
    sanitizedData.schedule = data.schedule || "";
    sanitizedData.experience_needed = data.experience_needed || "";

    // Budget min/max
    const minBudgetResult = validateBudget(data.budget_min, "Minimum budget");
    if (minBudgetResult.error) errors.budget_min = minBudgetResult.error;
    else sanitizedData.budget_min = minBudgetResult.value;

    const maxBudgetResult = validateBudget(data.budget_max, "Maximum budget");
    if (maxBudgetResult.error) errors.budget_max = maxBudgetResult.error;
    else sanitizedData.budget_max = maxBudgetResult.value;

    // Budget logic
    if (
        sanitizedData.budget_min !== undefined &&
        sanitizedData.budget_max !== undefined
    ) {
        if (sanitizedData.budget_min! > sanitizedData.budget_max!) {
            errors.budget_min = "Minimum budget cannot be greater than maximum budget.";
        }
        if (sanitizedData.budget_min! < 5000) {
            warnings.budget_min = "Consider if this budget is realistic for the Philippines market.";
        }
        if (sanitizedData.budget_max! > 100000) {
            warnings.budget_max = "This seems like a very high budget range.";
        }
    }
    if (
        (sanitizedData.budget_min !== undefined && sanitizedData.budget_max === undefined) ||
        (sanitizedData.budget_max !== undefined && sanitizedData.budget_min === undefined)
    ) {
        errors.budget_range = "Please provide both minimum and maximum budget or leave both empty.";
    }

    // Special requirements
    const specialReqResult = validateSpecialRequirements(data.special_requirements);
    if (specialReqResult.error) errors.special_requirements = specialReqResult.error;
    else sanitizedData.special_requirements = specialReqResult.value;

    // Compatibility warnings
    if (sanitizedData.work_type === "elderly_care" && sanitizedData.accommodation === "live_out") {
        warnings.accommodation = "Elderly care typically works better with live-in arrangements.";
    }
    if (sanitizedData.work_type === "childcare" && sanitizedData.schedule === "weekends_only") {
        warnings.schedule = "Childcare usually requires more regular scheduling.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        warnings,
        sanitizedData: sanitizedData as Step3Data,
        hasData: hasAnyData(data),
    };
}

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