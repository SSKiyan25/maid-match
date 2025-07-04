import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";
import { useValidation } from "../hooks/useValidation";

export interface UserFormData {
    email: string;
    password: string;
    password_confirmation: string;
    avatar: File | null;
}

export interface UserValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: UserFormData;
}

// Validation logic (same as before)
function validateEmail(email: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(email, "email", 254);
    if (!isValid) return { error: securityIssues.join(", ") };
    
    if (!sanitizedValue) return { error: "Email is required." };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedValue)) {
        return { error: "Please enter a valid email address." };
    }
    
    return { value: sanitizedValue };
}

function validatePassword(password: string, isRequired: boolean = false) {
    if (!password && !isRequired) return { value: "" };
    if (!password && isRequired) return { error: "Password is required." };
    
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(password, "text", 255);
    if (!isValid) return { error: securityIssues.join(", ") };
    
    if (sanitizedValue && sanitizedValue.length < 8) {
        return { error: "Password must be at least 8 characters long." };
    }
    
    return { value: sanitizedValue };
}

function validatePasswordConfirmation(password: string, confirmation: string) {
    if (!password) return { value: "" };
    
    if (password !== confirmation) {
        return { error: "Password confirmation does not match." };
    }
    
    return { value: confirmation };
}

function validateAvatar(avatar: File | null) {
    if (!avatar) return { value: null };
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(avatar.type)) {
        return { error: "Avatar must be a JPEG, PNG, or GIF image." };
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (avatar.size > maxSize) {
        return { error: "Avatar file size must be less than 5MB." };
    }
    
    return { value: avatar };
}

export function validateUser(data: UserFormData): UserValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<UserFormData> = {};

    const emailResult = validateEmail(data.email);
    if (emailResult.error) errors.email = emailResult.error;
    else sanitizedData.email = emailResult.value!;

    const passwordResult = validatePassword(data.password, false);
    if (passwordResult.error) errors.password = passwordResult.error;
    else sanitizedData.password = passwordResult.value!;

    const confirmationResult = validatePasswordConfirmation(data.password, data.password_confirmation);
    if (confirmationResult.error) errors.password_confirmation = confirmationResult.error;
    else sanitizedData.password_confirmation = confirmationResult.value!;

    const avatarResult = validateAvatar(data.avatar);
    if (avatarResult.error) errors.avatar = avatarResult.error;
    else sanitizedData.avatar = avatarResult.value;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as UserFormData,
    };
}

// Custom hook
export const useUserValidation = (data: UserFormData, onValidationChange?: (isValid: boolean) => void) => {
    return useValidation(data, validateUser, onValidationChange);
};