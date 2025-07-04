import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";
import { ProfileAddress } from "./types";
import { useValidation } from "../hooks/useValidation";

export interface ProfileFormData {
    first_name: string;
    last_name: string;
    phone_number: string;
    is_phone_private: boolean;
    birth_date: string;
    address: ProfileAddress;
    is_address_private: boolean;
    preferred_language: string;
    preferred_contact_methods: string[];
}

export interface ProfileValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: ProfileFormData;
}

function validateName(name: string, fieldName: string, isRequired: boolean = true) {
    if (!name && isRequired) return { error: `${fieldName} is required.` };
    if (!name && !isRequired) return { value: "" };
    
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(name, "text", 100);
    if (!isValid) return { error: securityIssues.join(", ") };
    
    if (sanitizedValue && sanitizedValue.length < 2) {
        return { error: `${fieldName} must be at least 2 characters long.` };
    }
    
    // Check for valid name characters
    if (sanitizedValue && !/^[a-zA-Z\s\-'.]+$/.test(sanitizedValue)) {
        return { error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes.` };
    }
    
    return { value: sanitizedValue };
}

function validatePhoneNumber(phone: string) {
    if (!phone) return { value: "" };
    
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(phone, "phone", 20);
    if (!isValid) return { error: securityIssues.join(", ") };
    
    // Basic phone format validation (flexible for international numbers)
    if (sanitizedValue && !/^[\+]?[0-9\s\-\(\)\.]{7,20}$/.test(sanitizedValue)) {
        return { error: "Please enter a valid phone number." };
    }
    
    return { value: sanitizedValue };
}

function validateBirthDate(birthDate: string) {
    if (!birthDate) return { value: "" };
    
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
        return { error: "Please enter a valid birth date." };
    }
    
    // Check if date is not in the future
    if (date > new Date()) {
        return { error: "Birth date cannot be in the future." };
    }
    
    // Check if person is not too old (reasonable limit)
    const maxAge = new Date();
    maxAge.setFullYear(maxAge.getFullYear() - 120);
    if (date < maxAge) {
        return { error: "Please enter a valid birth date." };
    }
    
    return { value: birthDate };
}

function validateAddress(address: ProfileAddress) {
    const errors: Record<string, string> = {};
    const sanitizedAddress: ProfileAddress = {};
    
    const fields = ['street', 'barangay', 'city', 'province'] as const;
    
    fields.forEach(field => {
        const value = address[field] || "";
        if (value) {
            const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(value, "text", 100);
            if (!isValid) {
                errors[`address_${field}`] = securityIssues.join(", ");
            } else {
                sanitizedAddress[field] = sanitizedValue;
            }
        } else {
            sanitizedAddress[field] = "";
        }
    });
    
    return { errors, value: sanitizedAddress };
}

function validateLanguage(language: string) {
    if (!language) return { value: "" };
    
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(language, "text", 50);
    if (!isValid) return { error: securityIssues.join(", ") };
    
    // Check for valid language format
    if (sanitizedValue && !/^[a-zA-Z\s\-,]+$/.test(sanitizedValue)) {
        return { error: "Language can only contain letters, spaces, hyphens, and commas." };
    }
    
    return { value: sanitizedValue };
}

function validateContactMethods(methods: string[]) {
    if (!methods || !Array.isArray(methods)) return { value: [] };
    
    const validMethods = ['email', 'phone', 'sms', 'whatsapp', 'messenger'];
    const filteredMethods = methods.filter(method => validMethods.includes(method));
    
    return { value: filteredMethods };
}

export function validateProfile(data: ProfileFormData): ProfileValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<ProfileFormData> = {};

    // Validate names
    const firstNameResult = validateName(data.first_name, "First name", true);
    if (firstNameResult.error) errors.first_name = firstNameResult.error;
    else sanitizedData.first_name = firstNameResult.value!;

    const lastNameResult = validateName(data.last_name, "Last name", true);
    if (lastNameResult.error) errors.last_name = lastNameResult.error;
    else sanitizedData.last_name = lastNameResult.value!;

    // Validate phone
    const phoneResult = validatePhoneNumber(data.phone_number);
    if (phoneResult.error) errors.phone_number = phoneResult.error;
    else sanitizedData.phone_number = phoneResult.value!;

    // Validate birth date
    const birthDateResult = validateBirthDate(data.birth_date);
    if (birthDateResult.error) errors.birth_date = birthDateResult.error;
    else sanitizedData.birth_date = birthDateResult.value!;

    // Validate address
    const addressResult = validateAddress(data.address);
    Object.assign(errors, addressResult.errors);
    sanitizedData.address = addressResult.value;

    // Validate language
    const languageResult = validateLanguage(data.preferred_language);
    if (languageResult.error) errors.preferred_language = languageResult.error;
    else sanitizedData.preferred_language = languageResult.value!;

    // Validate contact methods
    const contactMethodsResult = validateContactMethods(data.preferred_contact_methods);
    sanitizedData.preferred_contact_methods = contactMethodsResult.value;

    // Set privacy flags
    sanitizedData.is_phone_private = data.is_phone_private;
    sanitizedData.is_address_private = data.is_address_private;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as ProfileFormData,
    };
}

export const useProfileValidation = (data: ProfileFormData, onValidationChange?: (isValid: boolean) => void) => {
    return useValidation(data, validateProfile, onValidationChange);
};