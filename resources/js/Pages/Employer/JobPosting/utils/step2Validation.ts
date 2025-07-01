import { JobLocation } from "./types";
import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";

export interface Step2ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: JobLocation;
}

function validateBrgy(brgy: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(brgy, "text", 100);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue || sanitizedValue.length < 2) return { error: "Barangay is required and must be at least 2 characters." };
    return { value: sanitizedValue };
}

function validateCity(city: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(city, "text", 100);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue || sanitizedValue.length < 2) return { error: "City is required and must be at least 2 characters." };
    return { value: sanitizedValue };
}

function validateProvince(province: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(province, "text", 100);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue || sanitizedValue.length < 2) return { error: "Province is required and must be at least 2 characters." };
    return { value: sanitizedValue };
}

// Main validation function
export function validateStep2(data: JobLocation): Step2ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<JobLocation> = {};

    // Crucial fields with custom logic
    const brgyResult = validateBrgy(data.brgy);
    if (brgyResult.error) errors.brgy = brgyResult.error;
    else sanitizedData.brgy = brgyResult.value!;

    const cityResult = validateCity(data.city);
    if (cityResult.error) errors.city = cityResult.error;
    else sanitizedData.city = cityResult.value!;

    const provinceResult = validateProvince(data.province);
    if (provinceResult.error) errors.province = provinceResult.error;
    else sanitizedData.province = provinceResult.value!;

    // Generic validation for other fields
    const fieldTypes = {
        postal_code: "text",
        landmark: "text",
        directions: "textarea",
        latitude: "number",
        longitude: "number",
        is_hidden: "select",
    } as const;
    const securityCheck = validateFormSecurity(data, fieldTypes);

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
        sanitizedData: sanitizedData as JobLocation,
    };
}