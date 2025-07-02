export interface Step4ValidationResult {
    isValid: boolean;
    errors: Record<number, Record<string, string>>;
    sanitizedData?: {
        file?: File;
        url?: string;
        caption?: string;
        type: string;
        sort_order?: number;
        is_primary?: boolean;
    }[];
}

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const maxSize = 2 * 1024 * 1024; // 2MB

function validatePhotoFile(photo: File | undefined) {
    if (!photo) {
        return { isValid: false, error: "Photo file is required." };
    }
    if (photo.size > maxSize) {
        return { isValid: false, error: "Photo file size must be less than 2MB." };
    }
    if (!allowedTypes.includes(photo.type)) {
        return { isValid: false, error: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)." };
    }
    // Optionally check for suspicious extensions
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar'];
    const fileName = photo.name.toLowerCase();
    if (suspiciousExtensions.some(ext => fileName.includes(ext))) {
        return { isValid: false, error: "Invalid file type detected." };
    }
    return { isValid: true };
}

function validatePhotoType(type: string) {
    if (!type || typeof type !== "string" || !type.trim()) {
        return { error: "Photo type is required." };
    }
    return { value: type.trim() };
}

function validateCaption(caption: string | undefined) {
    if (!caption) return { value: "" };
    if (caption.length > 255) return { error: "Caption must be less than 255 characters." };
    return { value: caption.trim() };
}

export function validateStep4(
    data: { file?: File; url?: string; caption?: string; type: string; sort_order?: number; is_primary?: boolean }[]
): Step4ValidationResult {
    const errors: Record<number, Record<string, string>> = {};
    const sanitizedData: {
        file?: File;
        url?: string;
        caption?: string;
        type: string;
        sort_order?: number;
        is_primary?: boolean;
    }[] = [];

    data.forEach((photo, idx) => {
        const photoErrors: Record<string, string> = {};
        const sanitizedPhoto: Partial<{
            file?: File;
            url?: string;
            caption?: string;
            type: string;
            sort_order?: number;
            is_primary?: boolean;
        }> = {};

        // Validate file or url
        if (photo.file) {
            const fileResult = validatePhotoFile(photo.file);
            if (!fileResult.isValid) photoErrors.file = fileResult.error!;
            else sanitizedPhoto.file = photo.file;
        } else if (photo.url) {
            sanitizedPhoto.url = photo.url;
        } else {
            photoErrors.file = "Photo file is required.";
        }

        // Validate type
        const typeResult = validatePhotoType(photo.type);
        if (typeResult.error) photoErrors.type = typeResult.error;
        else sanitizedPhoto.type = typeResult.value!;

        // Validate caption
        const captionResult = validateCaption(photo.caption);
        if (captionResult.error) photoErrors.caption = captionResult.error;
        else sanitizedPhoto.caption = captionResult.value;

        // Optional fields
        if (photo.sort_order !== undefined) {
            if (typeof photo.sort_order !== "number" || isNaN(photo.sort_order) || photo.sort_order < 0) {
                photoErrors.sort_order = "Sort order must be a positive number.";
            } else {
                sanitizedPhoto.sort_order = photo.sort_order;
            }
        }
        if (photo.is_primary !== undefined) {
            sanitizedPhoto.is_primary = !!photo.is_primary;
        }

        if (Object.keys(photoErrors).length > 0) {
            errors[idx] = photoErrors;
        }
        // Only push if file is valid or url exists
        if ((photo.file && !photoErrors.file) || (photo.url && !photoErrors.file)) {
            sanitizedData.push(sanitizedPhoto as {
                file?: File;
                url?: string;
                caption?: string;
                type: string;
                sort_order?: number;
                is_primary?: boolean;
            });
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData,
    };
}