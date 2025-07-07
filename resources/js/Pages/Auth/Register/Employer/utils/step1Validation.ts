import { Step1Data, ValidationResult } from './types';
import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";

// Email validation
function validateEmail(email: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(email, "email", 254);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue.trim()) return { error: "Email is required" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedValue)) return { error: "Please enter a valid email address" };
    return { value: sanitizedValue };
}

// Password validation
function validatePassword(password: string) {
    if (!password) return { error: "Password is required" };
    if (password.length < 8) return { error: "Password must be at least 8 characters long" };
    return { value: password };
}

// Name validation
function validateName(name: string, fieldName: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(name, "text", 50);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue || sanitizedValue.trim().length === 0) return { error: `${fieldName} is required` };
    if (sanitizedValue.trim().length < 2) return { error: `${fieldName} must be at least 2 characters long` };
    return { value: sanitizedValue };
}

// Phone validation (optional)
function validatePhoneNumber(phone: string) {
    if (!phone) return { value: "" };
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(phone, "phone", 20);
    if (!isValid) return { error: securityIssues.join(", ") };
    const cleaned = sanitizedValue.replace(/\D/g, '');
    const patterns = [
        /^63[89]\d{9}$/, /^639\d{9}$/, /^0[89]\d{9}$/, /^09\d{9}$/, /^[89]\d{9}$/, /^9\d{9}$/
    ];
    const isValidPhone = patterns.some(pattern => pattern.test(cleaned));
    if (!isValidPhone) return { error: "Please enter a valid Philippine phone number" };
    return { value: sanitizedValue };
}

// Main validation function
export function validateStep1(data: Step1Data): ValidationResult & { sanitizedData?: Step1Data } {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<Step1Data> = {};

    // Security check for the entire form
    const fieldTypes = {
        first_name: 'text',
        last_name: 'text',
        email: 'email',
        password: 'text',
        password_confirmation: 'text',
        phone_number: 'phone',
    } as const;
    const securityCheck = validateFormSecurity(data, fieldTypes);
    if (!securityCheck.isSecure) {
        Object.assign(errors, securityCheck.securityReport);
    }

    // Email
    const emailResult = validateEmail(data.email);
    if (emailResult.error) errors.email = emailResult.error;
    else sanitizedData.email = emailResult.value;

    // Password
    const passwordResult = validatePassword(data.password);
    if (passwordResult.error) errors.password = passwordResult.error;
    else sanitizedData.password = passwordResult.value;

    // Password confirmation
    if (data.password !== data.password_confirmation) {
        errors.password_confirmation = "Passwords do not match";
    } else {
        sanitizedData.password_confirmation = data.password_confirmation;
    }

    // First name
    const firstNameResult = validateName(data.first_name, "First name");
    if (firstNameResult.error) errors.first_name = firstNameResult.error;
    else sanitizedData.first_name = firstNameResult.value;

    // Last name
    const lastNameResult = validateName(data.last_name, "Last name");
    if (lastNameResult.error) errors.last_name = lastNameResult.error;
    else sanitizedData.last_name = lastNameResult.value;

    // Phone number (optional)
    const phoneResult = validatePhoneNumber(data.phone_number);
    if (phoneResult.error) errors.phone_number = phoneResult.error;
    else sanitizedData.phone_number = phoneResult.value;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as Step1Data,
    };
}