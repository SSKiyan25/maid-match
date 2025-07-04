import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";
import { useValidation } from "../hooks/useValidation";

export interface PetFormData {
    type: string;
    name: string;
    photo_url: File | null;
}

export interface PetValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: PetFormData;
}

function validatePetType(type: string) {
    if (!type) return { error: "Pet type is required." };
    
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(type, "text", 50);
    if (!isValid) return { error: securityIssues.join(", ") };
    
    if (sanitizedValue && sanitizedValue.length < 2) {
        return { error: "Pet type must be at least 2 characters long." };
    }
    
    // Check for valid pet type format
    if (sanitizedValue && !/^[a-zA-Z\s\-]+$/.test(sanitizedValue)) {
        return { error: "Pet type can only contain letters, spaces, and hyphens." };
    }
    
    return { value: sanitizedValue };
}

// Pet name is optional, only validate if provided
function validatePetName(name: string) {
    if (!name) return { value: "" };

    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(name, "text", 100);
    if (!isValid) return { error: securityIssues.join(", ") };

    // Check for valid name characters if provided
    if (sanitizedValue && !/^[a-zA-Z\s\-'.]+$/.test(sanitizedValue)) {
        return { error: "Pet name can only contain letters, spaces, hyphens, and apostrophes." };
    }

    return { value: sanitizedValue };
}

function validatePetPhoto(photo: File | null) {
    if (!photo) return { value: null };
    
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(photo.type)) {
        return { error: "Pet photo must be a JPEG, PNG, or GIF image." };
    }
    
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxSize) {
        return { error: "Pet photo file size must be less than 5MB." };
    }
    
    return { value: photo };
}

export function validatePet(data: PetFormData): PetValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<PetFormData> = {};

    // Validate pet type
    const typeResult = validatePetType(data.type);
    if (typeResult.error) errors.type = typeResult.error;
    else sanitizedData.type = typeResult.value!;

    // Validate pet name (optional)
    const nameResult = validatePetName(data.name);
    if (nameResult.error) errors.name = nameResult.error;
    else sanitizedData.name = nameResult.value!;

    // Validate pet photo
    const photoResult = validatePetPhoto(data.photo_url);
    if (photoResult.error) errors.photo_url = photoResult.error;
    else sanitizedData.photo_url = photoResult.value;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as PetFormData,
    };
}

// Custom hook
export const usePetValidation = (data: PetFormData, onValidationChange?: (isValid: boolean) => void) => {
    return useValidation(data, validatePet, onValidationChange);
};