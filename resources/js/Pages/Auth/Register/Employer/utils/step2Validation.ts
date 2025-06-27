import { validateAndSanitizeInput, validateFormSecurity } from './securityValidation';

export interface AddressData {
    street: string;
    barangay: string;
    city: string;
    province: string;
}

export interface Step2Data {
    address: string;
    family_size: number;
    household_description: string;
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

export const validateStep2 = (
    currentData: Step2Data,
    currentAddressData: AddressData
) => {
    const newErrors: Record<string, string> = {};

    // Security validation for address fields
    const streetSecurity = validateAndSanitizeInput(currentAddressData.street, 'text', 200);
    const barangaySecurity = validateAndSanitizeInput(currentAddressData.barangay, 'text', 100);
    const citySecurity = validateAndSanitizeInput(currentAddressData.city, 'text', 100);
    const provinceSecurity = validateAndSanitizeInput(currentAddressData.province, 'text', 100);

    // Check for security issues
    if (!streetSecurity.isValid) {
        newErrors["address.street"] = streetSecurity.securityIssues.join(', ');
    } else if (!streetSecurity.sanitizedValue?.trim()) {
        newErrors["address.street"] = "Street address is required";
    }

    if (!barangaySecurity.isValid) {
        newErrors["address.barangay"] = barangaySecurity.securityIssues.join(', ');
    } else if (!barangaySecurity.sanitizedValue?.trim()) {
        newErrors["address.barangay"] = "Barangay is required";
    }

    if (!citySecurity.isValid) {
        newErrors["address.city"] = citySecurity.securityIssues.join(', ');
    } else if (!citySecurity.sanitizedValue?.trim()) {
        newErrors["address.city"] = "City is required";
    }

    if (!provinceSecurity.isValid) {
        newErrors["address.province"] = provinceSecurity.securityIssues.join(', ');
    } else if (!provinceSecurity.sanitizedValue?.trim()) {
        newErrors["address.province"] = "Province is required";
    }

    // Validate family size
    if (!currentData.family_size || currentData.family_size < 1) {
        newErrors.family_size = "Family size must be at least 1";
    }
    if (currentData.family_size > 20) {
        newErrors.family_size = "Family size cannot exceed 20";
    }

    // Validate household description
    if (currentData.household_description) {
        const descSecurity = validateAndSanitizeInput(currentData.household_description, 'textarea', 1000);
        if (!descSecurity.isValid) {
            newErrors.household_description = descSecurity.securityIssues.join(', ');
        }
    }

    return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors,
        sanitizedAddressData: {
            street: streetSecurity.sanitizedValue || '',
            barangay: barangaySecurity.sanitizedValue || '',
            city: citySecurity.sanitizedValue || '',
            province: provinceSecurity.sanitizedValue || '',
        }
    };
};

export const stringifyAddress = (addressData: AddressData): string => {
    return JSON.stringify(addressData);
};