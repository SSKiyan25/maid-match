import { MaidUserInput, MaidProfileInput, CreateMaidFormData } from "./types";
import {
    validateFormSecurity,
    validateAndSanitizeInput,
} from "@/utils/securityValidation";

export interface Step1ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: CreateMaidFormData;
}

// Helper validation functions
function validateEmail(email: string | undefined) {
    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(email ?? "", "email", 255);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue) return { error: "Email is required." };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedValue))
        return { error: "Invalid email address." };
    return { value: sanitizedValue };
}

function validatePassword(
    password: string | undefined,
    confirmation: string | undefined,
    isEdit: boolean
) {
    if (!password) {
        if (isEdit) return { value: "" }; // allow blank in edit mode
        return { error: "Password is required." };
    }
    if (password.length < 8)
        return { error: "Password must be at least 8 characters." };
    if (password !== confirmation)
        return { error: "Password confirmation does not match." };
    return { value: password };
}

function validateName(name: string | undefined, field: string) {
    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(name ?? "", "text", 255);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue) return { error: `${field} is required.` };
    if (sanitizedValue.length > 255)
        return { error: `${field} cannot exceed 255 characters.` };
    return { value: sanitizedValue };
}

function validatePhone(phone: string | undefined) {
    if (!phone) return { value: "" };
    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(phone, "phone", 20);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (sanitizedValue.length > 20)
        return { error: "Phone number cannot exceed 20 characters." };

    // Philippine phone number pattern: 09xxxxxxxxx or +639xxxxxxxxx
    const phPhoneRegex = /^(09\d{9}|\+639\d{9})$/;
    if (!phPhoneRegex.test(sanitizedValue)) {
        return {
            error: "Phone number must be in the format 09xxxxxxxxx or +639xxxxxxxxx.",
        };
    }

    return { value: sanitizedValue };
}

function validateBirthDate(birthDate: string | undefined) {
    if (!birthDate) return { value: "" };
    // Increase max length to 30 to allow ISO strings
    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(birthDate, "text", 30);
    if (!isValid) return { error: securityIssues.join(", ") };
    const date = new Date(sanitizedValue);
    if (isNaN(date.getTime())) return { error: "Invalid birth date." };
    if (date > new Date()) return { error: "Birth date must be before today." };
    return { value: sanitizedValue };
}

function validateAddress(address: MaidProfileInput["address"]) {
    const fieldErrors: Record<string, string> = {};
    if (!address)
        return {
            value: { street: "", barangay: "", city: "", province: "" },
            errors: fieldErrors,
        };

    const fields = ["street", "barangay", "city", "province"] as const;
    const sanitized: Record<string, string> = {};
    for (const field of fields) {
        const val = address[field];
        if (typeof val !== "string") {
            fieldErrors[field] = `Address ${field} is required.`;
            continue;
        }
        const { isValid, sanitizedValue, securityIssues } =
            validateAndSanitizeInput(val, "text", 100);
        if (!isValid) {
            fieldErrors[field] = `Address ${field}: ${securityIssues.join(
                ", "
            )}`;
            continue;
        }
        if (!sanitizedValue) {
            fieldErrors[field] = `Address ${field} is required.`;
            continue;
        }
        if (sanitizedValue.length > 100) {
            fieldErrors[
                field
            ] = `Address ${field} cannot exceed 100 characters.`;
            continue;
        }
        sanitized[field] = sanitizedValue;
    }
    return {
        value: {
            street: sanitized["street"] ?? "",
            barangay: sanitized["barangay"] ?? "",
            city: sanitized["city"] ?? "",
            province: sanitized["province"] ?? "",
        },
        errors: fieldErrors,
    };
}

// Main validation function
export function validateStep1(
    data: CreateMaidFormData,
    isEdit: boolean = false
): Step1ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedUser: Partial<MaidUserInput> = {};
    const sanitizedProfile: Partial<MaidProfileInput> = {};

    // User fields
    const emailResult = validateEmail(data.user.email);
    if (emailResult.error) errors.email = emailResult.error;
    else sanitizedUser.email = emailResult.value!;

    const passwordResult = validatePassword(
        data.user.password,
        data.user.password_confirmation,
        isEdit
    );
    if (passwordResult.error) errors.password = passwordResult.error;
    else sanitizedUser.password = passwordResult.value!;

    // Profile fields
    const firstNameResult = validateName(data.profile.first_name, "First name");
    if (firstNameResult.error) errors.first_name = firstNameResult.error;
    else sanitizedProfile.first_name = firstNameResult.value!;

    const lastNameResult = validateName(data.profile.last_name, "Last name");
    if (lastNameResult.error) errors.last_name = lastNameResult.error;
    else sanitizedProfile.last_name = lastNameResult.value!;

    const phoneResult = validatePhone(data.profile.phone_number ?? undefined);
    if (phoneResult.error) errors.phone_number = phoneResult.error;
    else sanitizedProfile.phone_number = phoneResult.value!;

    const birthDateResult = validateBirthDate(
        data.profile.birth_date ?? undefined
    );
    if (birthDateResult.error) errors.birth_date = birthDateResult.error;
    else sanitizedProfile.birth_date = birthDateResult.value!;

    const addressResult = validateAddress(data.profile.address);
    if (addressResult.errors) {
        Object.entries(addressResult.errors).forEach(([field, msg]) => {
            errors[field] = msg;
        });
    }
    if (!Object.keys(addressResult.errors).length) {
        sanitizedProfile.address = addressResult.value!;
    }

    // Security validation for all fields (extra layer)
    const fieldTypes = {
        first_name: "text",
        last_name: "text",
        phone_number: "phone",
        birth_date: "text",
        email: "email",
    } as const;
    const securityCheck = validateFormSecurity(
        { ...data.user, ...data.profile },
        fieldTypes
    );
    if (!securityCheck.isSecure) {
        securityCheck.suspiciousFields.forEach((field) => {
            if (!errors[field as string]) {
                errors[field as string] =
                    "Suspicious or invalid input detected.";
            }
        });
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: {
            user: sanitizedUser as MaidUserInput,
            profile: sanitizedProfile as MaidProfileInput,
            maid: data.maid,
            agency_maid: data.agency_maid,
            documents: data.documents ?? [],
        },
    };
}
