import { AgencyOtherInfoStep } from "./types";
import { validateAndSanitizeInput } from "@/utils/securityValidation";

export interface Step4ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: AgencyOtherInfoStep;
}

function validateWebsite(url?: string) {
    if (!url) return { value: "" };
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(url, "text", 255);
    if (!isValid) return { error: securityIssues.join(", ") };
    try {
        new URL(sanitizedValue);
        return { value: sanitizedValue };
    } catch {
        return { error: "Invalid website URL." };
    }
}

function validateFacebookPage(url?: string) {
    if (!url) return { value: "" };
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(url, "text", 255);
    if (!isValid) return { error: securityIssues.join(", ") };
    try {
        const parsed = new URL(sanitizedValue);
        if (!parsed.hostname.includes("facebook.com")) {
            return { error: "Facebook page must be a valid Facebook URL." };
        }
        return { value: sanitizedValue };
    } catch {
        return { error: "Facebook page must be a valid URL." };
    }
}

export function validateStep4(data: AgencyOtherInfoStep): Step4ValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<AgencyOtherInfoStep> = {};

    // Website (optional)
    const websiteResult = validateWebsite(data.website);
    if (websiteResult.error) errors.website = websiteResult.error;
    else sanitizedData.website = websiteResult.value!;

    // Facebook page (optional)
    const fbResult = validateFacebookPage(data.facebook_page);
    if (fbResult.error) errors.facebook_page = fbResult.error;
    else sanitizedData.facebook_page = fbResult.value!;

    // Placement fee (optional, must be a positive number if present)
    if (data.placement_fee !== undefined && data.placement_fee !== null) {
        let fee = Number(data.placement_fee);
        if (typeof fee !== "number" || isNaN(fee) || fee < 0) {
            errors.placement_fee = "Placement fee must be a positive number.";
        } else {
            // Always store as two decimal places
            sanitizedData.placement_fee = Number(fee.toFixed(2));
        }
    }

    // Show fee publicly (optional, boolean)
    if (typeof data.show_fee_publicly === "boolean") {
        sanitizedData.show_fee_publicly = data.show_fee_publicly;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as AgencyOtherInfoStep,
    };
}