import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";
import { ValidationResult } from "./types";
import { Step2Data, AddressData } from "./types";

export interface Step2ValidationData extends Step2Data {
    addressData: AddressData;
}

export const parseAddress = (addressString: string): AddressData => {
    if (!addressString) {
        return { street: "", barangay: "", city: "", province: "" };
    }

    try {
        const parsed = JSON.parse(addressString);
        return {
            street: parsed.street || "",
            barangay: parsed.barangay || "",
            city: parsed.city || "",
            province: parsed.province || "",
        };
    } catch {
        return {
            street: addressString,
            barangay: "",
            city: "",
            province: "",
        };
    }
};

export const validateStep2 = (data: Step2ValidationData): ValidationResult & { sanitizedData?: Step2ValidationData } => {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<Step2ValidationData> = {};

    // Security check for the entire form
    const fieldTypes = {
        address: 'text',
        family_size: 'number',
        household_description: 'textarea',
    } as const;
    const securityCheck = validateFormSecurity(data, fieldTypes);
    if (!securityCheck.isSecure) {
        Object.assign(errors, securityCheck.securityReport);
    }

    // Security validation for address fields
    const streetSecurity = validateAndSanitizeInput(data.addressData.street, 'text', 200);
    const barangaySecurity = validateAndSanitizeInput(data.addressData.barangay, 'text', 100);
    const citySecurity = validateAndSanitizeInput(data.addressData.city, 'text', 100);
    const provinceSecurity = validateAndSanitizeInput(data.addressData.province, 'text', 100);

    // Check for security issues and required fields
    if (!streetSecurity.isValid) {
        errors["address.street"] = streetSecurity.securityIssues.join(', ');
    } else if (!streetSecurity.sanitizedValue?.trim()) {
        errors["address.street"] = "Street address is required";
    }

    if (!barangaySecurity.isValid) {
        errors["address.barangay"] = barangaySecurity.securityIssues.join(', ');
    } else if (!barangaySecurity.sanitizedValue?.trim()) {
        errors["address.barangay"] = "Barangay is required";
    }

    if (!citySecurity.isValid) {
        errors["address.city"] = citySecurity.securityIssues.join(', ');
    } else if (!citySecurity.sanitizedValue?.trim()) {
        errors["address.city"] = "City is required";
    }

    if (!provinceSecurity.isValid) {
        errors["address.province"] = provinceSecurity.securityIssues.join(', ');
    } else if (!provinceSecurity.sanitizedValue?.trim()) {
        errors["address.province"] = "Province is required";
    }

    // Validate family size
    if (!data.family_size || data.family_size < 1) {
        errors.family_size = "Family size must be at least 1";
    } else if (data.family_size > 20) {
        errors.family_size = "Family size cannot exceed 20";
    } else {
        sanitizedData.family_size = data.family_size;
    }

    // Validate household description
    if (data.household_description) {
        const descSecurity = validateAndSanitizeInput(data.household_description, 'textarea', 1000);
        if (!descSecurity.isValid) {
            errors.household_description = descSecurity.securityIssues.join(', ');
        } else {
            sanitizedData.household_description = descSecurity.sanitizedValue;
        }
    } else {
        sanitizedData.household_description = '';
    }

    // If all address fields are valid, create sanitized address data
    if (!errors["address.street"] && !errors["address.barangay"] && 
        !errors["address.city"] && !errors["address.province"]) {
        const sanitizedAddressData = {
            street: streetSecurity.sanitizedValue || '',
            barangay: barangaySecurity.sanitizedValue || '',
            city: citySecurity.sanitizedValue || '',
            province: provinceSecurity.sanitizedValue || '',
        };
        sanitizedData.addressData = sanitizedAddressData;
        sanitizedData.address = stringifyAddress(sanitizedAddressData);
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as Step2ValidationData,
    };
};

export const stringifyAddress = (addressData: AddressData): string => {
    return JSON.stringify(addressData);
};