import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";
import { useValidation } from "../hooks/useValidation";

export interface ChildFormData {
    name: string;
    birth_date: string;
    photo_url: File | null;
}

export interface ChildValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: ChildFormData;
}

// Name is optional, only validate if provided
function validateChildName(name: string) {
    if (!name) return { value: "" };

    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(name, "text", 100);
    if (!isValid) return { error: securityIssues.join(", ") };

    // Check for valid name characters if provided
    if (sanitizedValue && !/^[a-zA-Z\s\-'.]+$/.test(sanitizedValue)) {
        return { error: "Child name can only contain letters, spaces, hyphens, and apostrophes." };
    }

    return { value: sanitizedValue };
}

function validateChildBirthDate(birthDate: string) {
    if (!birthDate) return { error: "Birth date is required." };

    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
        return { error: "Please enter a valid birth date." };
    }

    // Check if date is not in the future
    if (date > new Date()) {
        return { error: "Birth date cannot be in the future." };
    }

    return { value: birthDate };
}

function validateChildPhoto(photo: File | null) {
    if (!photo) return { value: null };

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(photo.type)) {
        return { error: "Child photo must be a JPEG, PNG, or GIF image." };
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxSize) {
        return { error: "Child photo file size must be less than 5MB." };
    }

    return { value: photo };
}

export function validateChild(data: ChildFormData): ChildValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<ChildFormData> = {};

    // Validate child name (optional)
    const nameResult = validateChildName(data.name);
    if (nameResult.error) errors.name = nameResult.error;
    else sanitizedData.name = nameResult.value!;

    // Validate birth date (required)
    const birthDateResult = validateChildBirthDate(data.birth_date);
    if (birthDateResult.error) errors.birth_date = birthDateResult.error;
    else sanitizedData.birth_date = birthDateResult.value!;

    // Validate child photo (optional)
    const photoResult = validateChildPhoto(data.photo_url);
    if (photoResult.error) errors.photo_url = photoResult.error;
    else sanitizedData.photo_url = photoResult.value;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as ChildFormData,
    };
}

export const useChildValidation = (data: ChildFormData, onValidationChange?: (isValid: boolean) => void) => {
    return useValidation(data, validateChild, onValidationChange);
};