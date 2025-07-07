import { AgencyContactPerson } from "./types";
import { validateAndSanitizeInput } from "@/utils/securityValidation";

export interface Step2ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: AgencyContactPerson;
}

function validateContactName(name?: string) {
    if (!name) return { error: "Contact person name is required." };
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(name, "text", 100);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (sanitizedValue.length < 2) return { error: "Contact person name must be at least 2 characters." };
    return { value: sanitizedValue };
}

function validateContactPhone(phone?: string) {
    if (!phone) return { error: "Contact person phone is required." };
    if (!/^[\d\+\-\s]{7,20}$/.test(phone)) return { error: "Invalid contact person phone number." };
    return { value: phone.trim() };
}

function validateContactEmail(email?: string) {
    if (!email) return { value: "" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { error: "Invalid contact person email address." };
    return { value: email.trim() };
}

function validateContactFacebook(facebook?: string) {
    if (!facebook) return { value: "" };
    try {
        const url = new URL(facebook);
        if (!url.hostname.includes("facebook.com")) {
            return { error: "Contact person Facebook must be a valid Facebook URL." };
        }
    } catch {
        return { error: "Contact person Facebook must be a valid URL." };
    }
    return { value: facebook };
}

export function validateStep2(
    data: AgencyContactPerson
): Step2ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<AgencyContactPerson> = {};

    // Name (required)
    const nameResult = validateContactName(data.name);
    if (nameResult.error) errors.name = nameResult.error;
    else sanitizedData.name = nameResult.value!;

    // Phone (required)
    const phoneResult = validateContactPhone(data.phone);
    if (phoneResult.error) errors.phone = phoneResult.error;
    else sanitizedData.phone = phoneResult.value!;

    // Email (optional)
    const emailResult = validateContactEmail(data.email);
    if (emailResult.error) errors.email = emailResult.error;
    else sanitizedData.email = emailResult.value!;

    // Facebook (optional)
    const facebookResult = validateContactFacebook(data.facebook);
    if (facebookResult.error) errors.facebook = facebookResult.error;
    else sanitizedData.facebook = facebookResult.value!;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as AgencyContactPerson,
    };
}