import { JobPostingForm } from "./types";
import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";

export interface Step1ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: JobPostingForm;
}

function validateTitle(title: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(title, "text", 255);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue || sanitizedValue.length < 3) return { error: "Title must be at least 3 characters." };
    return { value: sanitizedValue };
}

function validateDescription(description: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(description, "textarea", 2000);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue || sanitizedValue.length < 50) return { error: "Description must be at least 50 characters." };
    return { value: sanitizedValue };
}

function validateSalary(
    salary: number | string | null | undefined,
    field: string
) {
    if (salary === undefined || salary === null || salary === "") {
        return { value: null };
    }
    const num = typeof salary === "string" ? parseFloat(salary) : salary;
    if (typeof num !== "number" || isNaN(num) || num < 0) {
        return { error: `${field} must be a positive number.` };
    }
    return { value: num };
}

function validateDayOffPreference(dayOff: string | undefined) {
    if (dayOff && dayOff.trim().length < 3) {
        return { error: "Day off preference must be at least 3 characters." };
    }
    return { value: dayOff?.trim() || "" };
}

function validateLanguagePreferences(langs: string[] | undefined) {
    if (langs && (!Array.isArray(langs) || langs.some(l => typeof l !== "string" || !l.trim()))) {
        return { error: "Each language preference must be a non-empty string." };
    }
    return { value: langs?.map(l => l.trim()) || [] };
}


// Main validation function
export function validateStep1(data: JobPostingForm): Step1ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<JobPostingForm> = {};

    // Crucial fields with custom logic
    const titleResult = validateTitle(data.title);
    if (titleResult.error) errors.title = titleResult.error;
    else sanitizedData.title = titleResult.value!;

    const descResult = validateDescription(data.description);
    if (descResult.error) errors.description = descResult.error;
    else sanitizedData.description = descResult.value!;

    const minSalaryResult = validateSalary(data.min_salary, "Minimum salary");
    if (minSalaryResult.error) errors.min_salary = minSalaryResult.error;
    else sanitizedData.min_salary = minSalaryResult.value;

    const maxSalaryResult = validateSalary(data.max_salary, "Maximum salary");
    if (maxSalaryResult.error) errors.max_salary = maxSalaryResult.error;
    else sanitizedData.max_salary = maxSalaryResult.value;

    // Cross-field salary validation
    if (
        minSalaryResult.value !== undefined &&
        minSalaryResult.value !== null &&
        maxSalaryResult.value !== undefined &&
        maxSalaryResult.value !== null &&
        typeof minSalaryResult.value === "number" &&
        typeof maxSalaryResult.value === "number"
    ) {
        if (minSalaryResult.value > maxSalaryResult.value) {
            errors.min_salary = "Minimum salary should not be greater than the Maximum salary.";
        }
    }

    const dayOffPrefResult = validateDayOffPreference(data.day_off_preference);
    if (dayOffPrefResult.error) errors.day_off_preference = dayOffPrefResult.error;
    else sanitizedData.day_off_preference = dayOffPrefResult.value;

    const langPrefResult = validateLanguagePreferences(data.language_preferences);
    if (langPrefResult.error) errors.language_preferences = langPrefResult.error;
    else sanitizedData.language_preferences = langPrefResult.value;

    // Generic validation for other fields
    const fieldTypes = {
        work_types: "select",
        provides_toiletries: "select",
        provides_food: "select",
        accommodation_type: "select",
        day_off_type: "select",
    } as const;
    const securityCheck = validateFormSecurity(data, fieldTypes);

    // Required fields
    if (!data.work_types || !Array.isArray(data.work_types) || data.work_types.length === 0) {
        errors.work_types = "At least one work type is required.";
    }
    if (!data.accommodation_type) {
        errors.accommodation_type = "Accommodation type is required.";
    }
    if (!data.day_off_type) {
        errors.day_off_type = "Day off type is required.";
    }

    // Security issues for generic fields
    if (!securityCheck.isSecure) {
        securityCheck.suspiciousFields.forEach((field) => {
            if (!errors[field as string]) {
                errors[field as string] = "Suspicious or invalid input detected.";
            }
        });
    }

    // Merge sanitized generic fields
    Object.assign(sanitizedData, securityCheck.sanitizedData);

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as JobPostingForm,
    };
}