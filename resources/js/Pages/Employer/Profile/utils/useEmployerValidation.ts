import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";
import { useValidation } from "../hooks/useValidation";

export interface EmployerFormData {
    household_description: string;
    family_size: number;
    has_children: boolean;
    has_pets: boolean;
    status: 'active' | 'looking' | 'fulfilled';
    maid_preferences: string[];
}

export interface EmployerValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: EmployerFormData;
}

function validateHouseholdDescription(description: string) {
    if (!description) return { value: "" };
    
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(description, "textarea", 1000);
    if (!isValid) return { error: securityIssues.join(", ") };
    
    if (sanitizedValue && sanitizedValue.length > 0 && sanitizedValue.length < 10) {
        return { error: "Household description must be at least 10 characters if provided." };
    }
    
    return { value: sanitizedValue };
}

function validateFamilySize(size: number) {
    if (!size || isNaN(size)) {
        return { error: "Family size is required and must be a number." };
    }
    
    if (size < 1 || size > 20) {
        return { error: "Family size must be between 1 and 20 members." };
    }
    
    return { value: size };
}

function validateStatus(status: string) {
    const validStatuses = ['active', 'looking', 'fulfilled'];
    
    if (!status) {
        return { error: "Status is required." };
    }
    
    if (!validStatuses.includes(status)) {
        return { error: "Please select a valid status." };
    }
    
    return { value: status as 'active' | 'looking' | 'fulfilled' };
}

function validateMaidPreferences(preferences: string[]) {
    if (!preferences || !Array.isArray(preferences)) return { value: [] };
    
    const sanitizedPreferences: string[] = [];
    const errors: string[] = [];
    
    preferences.forEach((pref, index) => {
        if (typeof pref !== 'string') {
            errors.push(`Preference ${index + 1} must be text.`);
            return;
        }
        
        const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(pref, "text", 100);
        if (!isValid) {
            errors.push(`Preference ${index + 1}: ${securityIssues.join(", ")}`);
        } else if (sanitizedValue && sanitizedValue.length >= 2) {
            sanitizedPreferences.push(sanitizedValue);
        }
    });
    
    if (errors.length > 0) {
        return { error: errors.join(" ") };
    }
    
    return { value: sanitizedPreferences };
}

export function validateEmployer(data: EmployerFormData): EmployerValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<EmployerFormData> = {};

    // Validate household description
    const descriptionResult = validateHouseholdDescription(data.household_description);
    if (descriptionResult.error) errors.household_description = descriptionResult.error;
    else sanitizedData.household_description = descriptionResult.value!;

    // Validate family size
    const familySizeResult = validateFamilySize(data.family_size);
    if (familySizeResult.error) errors.family_size = familySizeResult.error;
    else sanitizedData.family_size = familySizeResult.value!;

    // Validate status
    const statusResult = validateStatus(data.status);
    if (statusResult.error) errors.status = statusResult.error;
    else sanitizedData.status = statusResult.value!;

    // Validate maid preferences
    const preferencesResult = validateMaidPreferences(data.maid_preferences);
    if (preferencesResult.error) errors.maid_preferences = preferencesResult.error;
    else sanitizedData.maid_preferences = preferencesResult.value!;

    // Set boolean flags
    sanitizedData.has_children = Boolean(data.has_children);
    sanitizedData.has_pets = Boolean(data.has_pets);

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as EmployerFormData,
    };
}

export const useEmployerValidation = (data: EmployerFormData, onValidationChange?: (isValid: boolean) => void) => {
    return useValidation(data, validateEmployer, onValidationChange);
};