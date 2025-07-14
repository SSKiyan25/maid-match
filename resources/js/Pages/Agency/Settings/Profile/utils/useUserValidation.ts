import { validateAndSanitizeInput } from "@/utils/securityValidation";
import { useValidation } from "../hooks/useValidation";

export interface UserFormData {
    email: string;
    avatar: File | null;
    password: string;
    password_confirmation: string;
}

export interface UserValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: UserFormData;
}

function validateEmail(email: string) {
    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(email, "email", 254);
    if (!isValid) return { error: securityIssues.join(", ") };

    if (!sanitizedValue) return { error: "Email is required." };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedValue)) {
        return { error: "Please enter a valid email address." };
    }

    return { value: sanitizedValue };
}

function validateAvatar(avatar: File | null) {
    if (!avatar) return { value: null };

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(avatar.type)) {
        return { error: "Avatar must be a JPEG, PNG, or GIF image." };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (avatar.size > maxSize) {
        return { error: "Avatar file size must be less than 5MB." };
    }

    return { value: avatar };
}

function validatePassword(password: string, password_confirmation: string) {
    if (!password && !password_confirmation) return { value: "" };

    if (password.length < 8) {
        return { error: "Password must be at least 8 characters." };
    }

    if (password !== password_confirmation) {
        return { error: "Passwords do not match." };
    }

    return { value: password };
}

export function validateUser(data: UserFormData): UserValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<UserFormData> = {};

    const emailResult = validateEmail(data.email);
    if (emailResult.error) errors.email = emailResult.error;
    else sanitizedData.email = emailResult.value!;

    const avatarResult = validateAvatar(data.avatar);
    if (avatarResult.error) errors.avatar = avatarResult.error;
    else sanitizedData.avatar = avatarResult.value;

    const passwordResult = validatePassword(
        data.password,
        data.password_confirmation
    );
    if (data.password || data.password_confirmation) {
        if (passwordResult.error) errors.password = passwordResult.error;
        else sanitizedData.password = passwordResult.value!;
        sanitizedData.password_confirmation = data.password_confirmation;
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as UserFormData,
    };
}

export const useUserValidation = (
    data: UserFormData,
    onValidationChange?: (isValid: boolean) => void
) => {
    return useValidation(data, validateUser, onValidationChange);
};
