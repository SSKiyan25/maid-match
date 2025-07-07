import { AgencyAddressStep } from "./types";
import { validateAndSanitizeInput } from "@/utils/securityValidation";

export interface Step3ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: AgencyAddressStep;
}

function validateTextField(value?: string, field = "Field", min = 2, max = 255) {
    if (!value) return { error: `${field} is required.` };
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(value, "text", max);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (sanitizedValue.length < min) return { error: `${field} must be at least ${min} characters.` };
    return { value: sanitizedValue };
}

export function validateStep3(data: AgencyAddressStep): Step3ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<AgencyAddressStep> = {};

    // Street (required)
    const streetResult = validateTextField(data.street, "Street");
    if (streetResult.error) errors.street = streetResult.error;
    else sanitizedData.street = streetResult.value!;

    // Barangay (required)
    const barangayResult = validateTextField(data.barangay, "Barangay");
    if (barangayResult.error) errors.barangay = barangayResult.error;
    else sanitizedData.barangay = barangayResult.value!;

    // City (required)
    const cityResult = validateTextField(data.city, "City");
    if (cityResult.error) errors.city = cityResult.error;
    else sanitizedData.city = cityResult.value!;

    // Province (required)
    const provinceResult = validateTextField(data.province, "Province");
    if (provinceResult.error) errors.province = provinceResult.error;
    else sanitizedData.province = provinceResult.value!;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as AgencyAddressStep,
    };
}