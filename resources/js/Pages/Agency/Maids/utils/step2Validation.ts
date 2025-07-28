import { MaidInput, AgencyMaidInput, CreateMaidFormData } from "./types";
import {
    validateFormSecurity,
    validateAndSanitizeInput,
} from "@/utils/securityValidation";

export interface Step2ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: CreateMaidFormData;
}

// Helper validation functions
function validateStringField(
    value: string | null | undefined,
    field: string,
    maxLength: number,
    required = false
) {
    if (required && (!value || !value.trim()))
        return { error: `${field} is required.` };
    if (value && value.length > maxLength)
        return { error: `${field} cannot exceed ${maxLength} characters.` };
    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(value ?? "", "text", maxLength);
    if (!isValid) return { error: securityIssues.join(", ") };
    return { value: sanitizedValue };
}

function validateNumberField(
    value: number | string | null | undefined, // accept string
    field: string,
    min: number,
    max: number,
    required = false
) {
    if (required && (value === null || value === undefined || value === "")) {
        return { error: `${field} is required.` };
    }
    // Convert string to number if needed
    let numValue = value;
    if (typeof value === "string" && value.trim() !== "") {
        numValue = Number(value);
    }
    if (numValue !== null && numValue !== undefined && value !== "") {
        if (typeof numValue !== "number" || isNaN(numValue))
            return { error: `${field} must be a valid number.` };
        if (numValue < min)
            return { error: `${field} cannot be less than ${min}.` };
        if (numValue > max) return { error: `${field} cannot exceed ${max}.` };
    }
    return { value: numValue };
}

function validateArrayField(
    value: string[] | undefined,
    field: string,
    maxLength: number
) {
    if (!value) return { value: [] };
    if (!Array.isArray(value)) return { error: `${field} must be an array.` };
    for (const item of value) {
        if (typeof item !== "string")
            return { error: `Each ${field} must be a string.` };
        if (item.length > maxLength)
            return {
                error: `Each ${field} cannot exceed ${maxLength} characters.`,
            };
    }
    return { value };
}

// Helper for Philippine phone validation
function validatePhPhone(phone: string | null | undefined, field: string) {
    if (!phone) return { value: "" };
    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(phone, "phone", 20);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (sanitizedValue.length > 20)
        return { error: `${field} cannot exceed 20 characters.` };
    const phPhoneRegex = /^(09\d{9}|\+639\d{9})$/;
    if (!phPhoneRegex.test(sanitizedValue)) {
        return {
            error: `${field} must be in the format 09xxxxxxxxx or +639xxxxxxxxx.`,
        };
    }
    return { value: sanitizedValue };
}

function validateSocialMediaLinks(
    value: Record<string, string> | string[] | null | undefined,
    field: string
) {
    // Handle empty values
    if (!value) return { value: {} };

    // Handle case where it might be an array
    if (Array.isArray(value) || typeof value !== "object") {
        return {
            error: `${field} must be an object with platform names as keys and URLs as values.`,
        };
    }

    // Validate object structure
    if (typeof value !== "object") {
        return { error: `${field} must be a valid object.` };
    }

    const sanitizedLinks: Record<string, string> = {};

    for (const [platform, url] of Object.entries(value)) {
        // Validate platform name
        if (platform.length > 50) {
            return { error: `Platform name cannot exceed 50 characters.` };
        }

        // Validate URL
        if (typeof url !== "string") {
            return { error: `URL for ${platform} must be a string.` };
        }

        if (url.length > 255) {
            return { error: `URL cannot exceed 255 characters.` };
        }

        // Basic URL validation
        try {
            // Check if it's a valid URL
            new URL(url);
            sanitizedLinks[platform] = url;
        } catch (e) {
            return { error: `URL for ${platform} is not valid.` };
        }
    }

    return { value: sanitizedLinks };
}

// Main validation function
export function validateStep2(data: CreateMaidFormData): Step2ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedMaid: Partial<MaidInput> = {};
    const sanitizedAgencyMaid: Partial<AgencyMaidInput> = {};

    // Maid fields
    const bioResult = validateStringField(data.maid.bio, "Bio", 1000);
    if (bioResult.error) errors.bio = bioResult.error;
    else sanitizedMaid.bio = bioResult.value;

    const skillsResult = validateArrayField(data.maid.skills, "skills", 255);
    if (skillsResult.error) errors.skills = skillsResult.error;
    else sanitizedMaid.skills = skillsResult.value;

    const nationalityResult = validateStringField(
        data.maid.nationality,
        "Nationality",
        100
    );
    if (nationalityResult.error) errors.nationality = nationalityResult.error;
    else sanitizedMaid.nationality = nationalityResult.value;

    const languagesResult = validateArrayField(
        data.maid.languages,
        "languages",
        50
    );
    if (languagesResult.error) errors.languages = languagesResult.error;
    else sanitizedMaid.languages = languagesResult.value;

    // Social Media Links validation (replace the array validation)
    const socialMediaResult = validateSocialMediaLinks(
        data.maid.social_media_links &&
            typeof data.maid.social_media_links === "object" &&
            !Array.isArray(data.maid.social_media_links)
            ? data.maid.social_media_links
            : {},
        "Social media links"
    );

    if (socialMediaResult.error)
        errors.social_media_links = socialMediaResult.error;
    else sanitizedMaid.social_media_links = socialMediaResult.value;

    // Marital status
    if (
        data.maid.marital_status &&
        !["single", "married", "divorced", "widowed"].includes(
            data.maid.marital_status
        )
    ) {
        errors.marital_status = "Please select a valid marital status.";
    } else {
        sanitizedMaid.marital_status = data.maid.marital_status ?? null;
    }

    // Boolean fields
    sanitizedMaid.has_children = !!data.maid.has_children;
    sanitizedMaid.is_willing_to_relocate = !!data.maid.is_willing_to_relocate;
    sanitizedMaid.is_verified = !!data.maid.is_verified;
    sanitizedMaid.is_archived = !!data.maid.is_archived;

    // Numeric fields
    const salaryResult = validateNumberField(
        data.maid.expected_salary,
        "Expected salary",
        0,
        1000000
    );
    if (salaryResult.error) errors.expected_salary = salaryResult.error;
    else
        sanitizedMaid.expected_salary =
            typeof salaryResult.value === "number" && !isNaN(salaryResult.value)
                ? salaryResult.value
                : null;

    const yearsExpResult = validateNumberField(
        data.maid.years_experience,
        "Years of experience",
        0,
        50
    );
    if (yearsExpResult.error) errors.years_experience = yearsExpResult.error;
    else
        sanitizedMaid.years_experience =
            typeof yearsExpResult.value === "number" &&
            !isNaN(yearsExpResult.value)
                ? yearsExpResult.value
                : undefined;

    // Preferred accommodation
    if (
        data.maid.preferred_accommodation &&
        !["live_in", "live_out", "either"].includes(
            data.maid.preferred_accommodation
        )
    ) {
        errors.preferred_accommodation =
            "Please select a valid accommodation preference.";
    } else {
        sanitizedMaid.preferred_accommodation =
            data.maid.preferred_accommodation ?? null;
    }

    // Earliest start date
    if (data.maid.earliest_start_date) {
        const date = new Date(data.maid.earliest_start_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Ignore time part
        if (isNaN(date.getTime())) {
            errors.earliest_start_date = "Invalid start date.";
        } else if (date <= today) {
            errors.earliest_start_date =
                "Earliest start date must be in the future.";
        } else {
            sanitizedMaid.earliest_start_date = data.maid.earliest_start_date;
        }
    }
    // Status
    if (
        data.maid.status &&
        !["available", "employed", "unavailable"].includes(data.maid.status)
    ) {
        errors.status = "Please select a valid status.";
    } else {
        sanitizedMaid.status = data.maid.status ?? null;
    }

    // Availability schedule, emergency contact, verification badges
    sanitizedMaid.availability_schedule = Array.isArray(
        data.maid.availability_schedule
    )
        ? data.maid.availability_schedule
        : [];
    sanitizedMaid.emergency_contact_name =
        data.maid.emergency_contact_name ?? null;

    // Emergency contact phone validation (Philippine format)
    const emergencyPhoneResult = validatePhPhone(
        data.maid.emergency_contact_phone,
        "Emergency contact phone"
    );
    if (data.maid.emergency_contact_phone && emergencyPhoneResult.error) {
        errors.emergency_contact_phone = emergencyPhoneResult.error;
        sanitizedMaid.emergency_contact_phone =
            data.maid.emergency_contact_phone;
    } else {
        sanitizedMaid.emergency_contact_phone =
            emergencyPhoneResult.value || null;
    }

    sanitizedMaid.verification_badges = Array.isArray(
        data.maid.verification_badges
    )
        ? data.maid.verification_badges
        : [];

    // Agency Maid fields
    sanitizedAgencyMaid.status = data.agency_maid.status ?? "active";
    sanitizedAgencyMaid.is_premium = !!data.agency_maid.is_premium;
    sanitizedAgencyMaid.is_trained = !!data.agency_maid.is_trained;
    sanitizedAgencyMaid.agency_notes = data.agency_maid.agency_notes ?? null;
    sanitizedAgencyMaid.agency_fee = data.agency_maid.agency_fee ?? null;
    sanitizedAgencyMaid.assigned_at = data.agency_maid.assigned_at ?? undefined;
    sanitizedAgencyMaid.status_changed_at =
        data.agency_maid.status_changed_at ?? undefined;
    sanitizedAgencyMaid.is_archived = !!data.agency_maid.is_archived;

    // Security validation for all fields (extra layer)
    const fieldTypes = {
        bio: "text",
        nationality: "text",
        emergency_contact_name: "text",
        emergency_contact_phone: "phone",
        agency_notes: "text",
    } as const;
    const securityCheck = validateFormSecurity(
        {
            bio: data.maid.bio,
            nationality: data.maid.nationality,
            emergency_contact_name: data.maid.emergency_contact_name,
            emergency_contact_phone: data.maid.emergency_contact_phone,
            agency_notes: data.agency_maid.agency_notes,
        },
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
            user: data.user,
            profile: data.profile,
            maid: sanitizedMaid as MaidInput,
            agency_maid: sanitizedAgencyMaid as AgencyMaidInput,
            documents: data.documents ?? [],
        },
    };
}
