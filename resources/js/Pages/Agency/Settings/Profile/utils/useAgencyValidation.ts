import { validateAndSanitizeInput } from "@/utils/securityValidation";
import { useValidation } from "../hooks/useValidation";

export interface AgencyFormData {
    name: string;
    license_number: string;
    license_photo_front: File | null;
    license_photo_back: File | null;
    description: string;
    established_at: string;
    business_email: string;
    business_phone: string;
    website: string;
    facebook_page: string;
}

export interface AgencyValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: AgencyFormData;
}

function validateAgencyName(name: string) {
    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(name, "text", 255);
    if (!isValid) return { error: securityIssues.join(", ") };

    if (!sanitizedValue) return { error: "Agency name is required." };
    if (sanitizedValue.length < 2)
        return { error: "Agency name must be at least 2 characters." };

    return { value: sanitizedValue };
}

function validateLicenseNumber(licenseNumber: string) {
    if (!licenseNumber) return { value: "" };

    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(licenseNumber, "text", 50);
    if (!isValid) return { error: securityIssues.join(", ") };

    return { value: sanitizedValue };
}

function validateLicensePhoto(photo: File | null) {
    if (!photo) return { value: null };

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/pdf"];
    if (!allowedTypes.includes(photo.type)) {
        return { error: "License photo must be a JPEG, PNG, or PDF file." };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxSize) {
        return { error: "License photo file size must be less than 5MB." };
    }

    return { value: photo };
}

function validateDescription(description: string) {
    if (!description) return { value: "" };

    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(description, "textarea", 2000);
    if (!isValid) return { error: securityIssues.join(", ") };

    return { value: sanitizedValue };
}

function validateDate(date: string) {
    if (!date) return { value: "" };

    try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return { error: "Please enter a valid date." };
        }

        // Check if date is not in the future
        if (parsedDate > new Date()) {
            return { error: "Date cannot be in the future." };
        }

        return { value: date };
    } catch (e) {
        return { error: "Please enter a valid date." };
    }
}

function validateEmail(email: string) {
    if (!email) return { value: "" };

    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(email, "email", 254);
    if (!isValid) return { error: securityIssues.join(", ") };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (sanitizedValue && !emailRegex.test(sanitizedValue)) {
        return { error: "Please enter a valid email address." };
    }

    return { value: sanitizedValue };
}

function validatePhone(phone: string) {
    if (!phone) return { value: "" };

    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(phone, "phone", 20);
    if (!isValid) return { error: securityIssues.join(", ") };

    // Simple phone validation - allow for international formats
    if (sanitizedValue && !/^[+]?[\d\s\-().]{7,20}$/.test(sanitizedValue)) {
        return { error: "Please enter a valid phone number." };
    }

    return { value: sanitizedValue };
}

function validateUrl(url: string, field: string) {
    if (!url) return { value: "" };

    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(url, "text", 255);
    if (!isValid) return { error: securityIssues.join(", ") };

    // Improved URL validation (accepts query params)
    if (sanitizedValue && !/^https?:\/\/[^\s]+$/.test(sanitizedValue)) {
        return { error: `Please enter a valid ${field} URL.` };
    }

    // Add https:// if not present
    let finalUrl = sanitizedValue;
    if (
        sanitizedValue &&
        !sanitizedValue.startsWith("http://") &&
        !sanitizedValue.startsWith("https://")
    ) {
        finalUrl = `https://${sanitizedValue}`;
    }

    return { value: finalUrl };
}

export function validateAgency(data: AgencyFormData): AgencyValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<AgencyFormData> = {};

    const nameResult = validateAgencyName(data.name);
    if (nameResult.error) errors.name = nameResult.error;
    else sanitizedData.name = nameResult.value!;

    const licenseNumberResult = validateLicenseNumber(data.license_number);
    if (licenseNumberResult.error)
        errors.license_number = licenseNumberResult.error;
    else sanitizedData.license_number = licenseNumberResult.value!;

    const licensePhotoFrontResult = validateLicensePhoto(
        data.license_photo_front
    );
    if (licensePhotoFrontResult.error)
        errors.license_photo_front = licensePhotoFrontResult.error;
    else sanitizedData.license_photo_front = licensePhotoFrontResult.value;

    const licensePhotoBackResult = validateLicensePhoto(
        data.license_photo_back
    );
    if (licensePhotoBackResult.error)
        errors.license_photo_back = licensePhotoBackResult.error;
    else sanitizedData.license_photo_back = licensePhotoBackResult.value;

    const descriptionResult = validateDescription(data.description);
    if (descriptionResult.error) errors.description = descriptionResult.error;
    else sanitizedData.description = descriptionResult.value!;

    const establishedAtResult = validateDate(data.established_at);
    if (establishedAtResult.error)
        errors.established_at = establishedAtResult.error;
    else sanitizedData.established_at = establishedAtResult.value!;

    const businessEmailResult = validateEmail(data.business_email);
    if (businessEmailResult.error)
        errors.business_email = businessEmailResult.error;
    else sanitizedData.business_email = businessEmailResult.value!;

    const businessPhoneResult = validatePhone(data.business_phone);
    if (businessPhoneResult.error)
        errors.business_phone = businessPhoneResult.error;
    else sanitizedData.business_phone = businessPhoneResult.value!;

    const websiteResult = validateUrl(data.website, "website");
    if (websiteResult.error) errors.website = websiteResult.error;
    else sanitizedData.website = websiteResult.value!;

    const facebookPageResult = validateUrl(data.facebook_page, "Facebook page");
    if (facebookPageResult.error)
        errors.facebook_page = facebookPageResult.error;
    else sanitizedData.facebook_page = facebookPageResult.value!;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as AgencyFormData,
    };
}

export const useAgencyValidation = (
    data: AgencyFormData,
    onValidationChange?: (isValid: boolean) => void
) => {
    return useValidation(data, validateAgency, onValidationChange);
};
