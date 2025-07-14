import { validateAndSanitizeInput } from "@/utils/securityValidation";
import { useValidation } from "../hooks/useValidation";

export interface PhotoFormData {
    photos?: File[];
    photo?: File | null;
    caption: string;
    type: string;
    is_primary: boolean;
    sort_order: number;
}

export interface PhotoValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: PhotoFormData;
}

function validatePhotos(photos: File[] | undefined) {
    if (!photos || photos.length === 0) {
        return { error: "At least one photo is required." };
    }

    if (photos.length > 5) {
        return { error: "Maximum 5 photos allowed." };
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (const photo of photos) {
        if (!allowedTypes.includes(photo.type)) {
            return { error: "All photos must be JPEG, PNG, or GIF images." };
        }

        if (photo.size > maxSize) {
            return { error: "All photos must be less than 5MB in size." };
        }
    }

    return { value: photos };
}

function validateSinglePhoto(photo: File | null | undefined) {
    if (!photo) return { value: null };

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(photo.type)) {
        return { error: "Photo must be a JPEG, PNG, or GIF image." };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxSize) {
        return { error: "Photo file size must be less than 5MB." };
    }

    return { value: photo };
}

function validateCaption(caption: string) {
    if (!caption) return { value: "" };

    const { isValid, sanitizedValue, securityIssues } =
        validateAndSanitizeInput(caption, "text", 255);
    if (!isValid) return { error: securityIssues.join(", ") };

    return { value: sanitizedValue };
}

function validatePhotoType(type: string) {
    const validTypes = ["logo", "office", "team", "certificate", "other"];

    if (!type) return { error: "Photo type is required." };
    if (!validTypes.includes(type)) {
        return { error: "Please select a valid photo type." };
    }

    return { value: type };
}

function validateSortOrder(sortOrder: number) {
    if (isNaN(sortOrder)) return { value: 0 };

    if (sortOrder < 0) {
        return { error: "Sort order cannot be negative." };
    }

    return { value: sortOrder };
}

export function validatePhoto(data: PhotoFormData): PhotoValidationResult {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<PhotoFormData> = {};

    // Handle array of photos (for adding multiple)
    if (data.photos) {
        const photosResult = validatePhotos(data.photos);
        if (photosResult.error) errors.photos = photosResult.error;
        else sanitizedData.photos = photosResult.value;
    }

    // Handle single photo (for editing)
    if (data.photo !== undefined) {
        const photoResult = validateSinglePhoto(data.photo);
        if (photoResult.error) errors.photo = photoResult.error;
        else sanitizedData.photo = photoResult.value;
    }

    const captionResult = validateCaption(data.caption);
    if (captionResult.error) errors.caption = captionResult.error;
    else sanitizedData.caption = captionResult.value!;

    const typeResult = validatePhotoType(data.type);
    if (typeResult.error) errors.type = typeResult.error;
    else sanitizedData.type = typeResult.value!;

    sanitizedData.is_primary = !!data.is_primary;

    const sortOrderResult = validateSortOrder(data.sort_order);
    if (sortOrderResult.error) errors.sort_order = sortOrderResult.error;
    else sanitizedData.sort_order = sortOrderResult.value!;

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as PhotoFormData,
    };
}

export const usePhotoValidation = (
    data: PhotoFormData,
    onValidationChange?: (isValid: boolean) => void
) => {
    return useValidation(data, validatePhoto, onValidationChange);
};
