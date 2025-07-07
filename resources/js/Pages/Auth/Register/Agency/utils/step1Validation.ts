import { AgencyInfoStep } from "./types";
import { validateAndSanitizeInput } from "@/utils/securityValidation";

export interface Step1ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: AgencyInfoStep & {
        email?: string;
        password?: string;
        password_confirmation?: string;
    };
}

function validateEmail(email?: string) {
    if (!email) return { error: "Email is required." };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { error: "Invalid email address." };
    return { value: email.trim() };
}

function validatePassword(password?: string, confirmation?: string) {
    if (!password) return { error: "Password is required." };
    if (password.length < 8) return { error: "Password must be at least 8 characters." };
    if (confirmation !== undefined && password !== confirmation) {
        return { error: "Passwords do not match." };
    }
    return { value: password };
}

function validateName(name: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(name, "text", 255);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue || sanitizedValue.length < 3) return { error: "Agency name must be at least 3 characters." };
    return { value: sanitizedValue };
}

function validateLicenseNumber(license_number: string) {
    if (!license_number) return { value: "" }; // nullable
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(license_number, "text", 64);
    if (!isValid) return { error: securityIssues.join(", ") };
    return { value: sanitizedValue };
}

function validateDescription(description?: string) {
    if (!description) return { value: "" };
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(description, "textarea", 2000);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (sanitizedValue && sanitizedValue.length < 20) return { error: "Description must be at least 20 characters." };
    return { value: sanitizedValue };
}

function validateEstablishedAt(established_at?: string) {
    if (!established_at) return { value: "" };
    const date = new Date(established_at);
    if (isNaN(date.getTime())) return { error: "Invalid date format for Established At." };
    const now = new Date();
    if (date > now) return { error: "Established At cannot be in the future." };
    return { value: established_at };
}

function validateBusinessEmail(email?: string) {
    if (!email) return { value: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { error: "Invalid business email address." };
    return { value: email.trim() };
}

function validateBusinessPhone(phone?: string) {
    if (!phone) return { value: "" };
    if (!/^[\d\+\-\s]{7,20}$/.test(phone)) return { error: "Invalid business phone number." };
    return { value: phone.trim() };
}

// License photo validation (optional, must be File and image if present)
function validateLicensePhoto(photo: File | null | undefined, field: string) {
    if (!photo) return {};
    if (!(photo instanceof File)) return { error: `The ${field} must be a file.` };
    if (!photo.type.startsWith("image/")) return { error: `The ${field} must be an image.` };
    if (photo.size > 5 * 1024 * 1024) return { error: `The ${field} must be less than 5MB.` };
    return {};
}

export function validateStep1(
    data: AgencyInfoStep & { email?: string; password?: string; password_confirmation?: string }
): Step1ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<AgencyInfoStep & { email?: string; password?: string; password_confirmation?: string }> = {};

    // Email (required)
    const emailResult = validateEmail(data.email);
    if (emailResult.error) errors.email = emailResult.error;
    else sanitizedData.email = emailResult.value!;

    // Password (required)
    const passwordResult = validatePassword(data.password, data.password_confirmation);
    if (passwordResult.error) errors.password = passwordResult.error;
    else sanitizedData.password = passwordResult.value!;

    // Password confirmation (for error display)
    if (data.password && data.password_confirmation !== undefined && data.password !== data.password_confirmation) {
        errors.password_confirmation = "Passwords do not match.";
    } else if (data.password_confirmation) {
        sanitizedData.password_confirmation = data.password_confirmation;
    }

    // Required: name
    const nameResult = validateName(data.name);
    if (nameResult.error) errors.name = nameResult.error;
    else sanitizedData.name = nameResult.value!;

    // Nullable: license_number
    const licenseResult = validateLicenseNumber(data.license_number);
    if (licenseResult.error) errors.license_number = licenseResult.error;
    else sanitizedData.license_number = licenseResult.value!;

    // Optional: description
    const descResult = validateDescription(data.description);
    if (descResult.error) errors.description = descResult.error;
    else sanitizedData.description = descResult.value!;

    // Optional: established_at
    const estResult = validateEstablishedAt(data.established_at);
    if (estResult.error) errors.established_at = estResult.error;
    else sanitizedData.established_at = estResult.value!;

    // Optional: business_email
    const businessEmailResult = validateBusinessEmail(data.business_email);
    if (businessEmailResult.error) errors.business_email = businessEmailResult.error;
    else sanitizedData.business_email = businessEmailResult.value!;

    // Optional: business_phone
    const businessPhoneResult = validateBusinessPhone(data.business_phone);
    if (businessPhoneResult.error) errors.business_phone = businessPhoneResult.error;
    else sanitizedData.business_phone = businessPhoneResult.value!;

    // License photos (optional)
    const licenseFrontResult = validateLicensePhoto(data.license_photo_front, "license photo (front)");
    if (licenseFrontResult.error) errors.license_photo_front = licenseFrontResult.error;

    const licenseBackResult = validateLicensePhoto(data.license_photo_back, "license photo (back)");
    if (licenseBackResult.error) errors.license_photo_back = licenseBackResult.error;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as AgencyInfoStep & {
            email?: string;
            password?: string;
            password_confirmation?: string;
        },
    };
}