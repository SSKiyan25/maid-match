import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";
import { Step4Data, Child, ValidationResult } from "./types";

export interface Step4ValidationResult extends ValidationResult {
    childErrors: Record<string, Record<string, string>>;
    sanitizedData?: Step4Data;
    hasData: boolean;
}

// --- Utility Functions ---

export function calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

export function getAgeGroup(age: number): string {
    if (age < 1) return "Infant (0-1 year)";
    if (age < 3) return "Toddler (1-3 years)";
    if (age < 6) return "Preschooler (3-6 years)";
    if (age < 13) return "School Age (6-13 years)";
    if (age < 18) return "Teenager (13-18 years)";
    return "Adult (18+ years)";
}

// --- Field Validators ---

function validateChildName(name: string) {
    if (!name || !name.trim()) return { value: "" }; // Optional
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(name, "text", 50);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (sanitizedValue.trim().length < 2) return { error: "Child's name must be at least 2 characters long" };
    return { value: sanitizedValue };
}

function validateBirthDate(birthDate: string) {
    if (!birthDate || !birthDate.trim()) return { error: "Birth date is required" }; // Now required
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(birthDate, "text", 20);
    if (!isValid) return { error: securityIssues.join(", ") };
    const date = new Date(birthDate);
    const today = new Date();
    if (isNaN(date.getTime())) return { error: "Please enter a valid birth date" };
    if (date > today) return { error: "Birth date cannot be in the future" };
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
    if (date < hundredYearsAgo) return { error: "Please enter a valid birth date" };
    return { value: birthDate };
}

function validatePhoto(photo?: File) {
    if (!photo) return { isValid: true };
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxSize) return { isValid: false, error: "Photo file size must be less than 5MB" };
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(photo.type)) return { isValid: false, error: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)" };
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar'];
    const fileName = photo.name.toLowerCase();
    if (suspiciousExtensions.some(ext => fileName.includes(ext))) return { isValid: false, error: "Invalid file type detected" };
    return { isValid: true };
}

// --- Main Validation ---

export function validateStep4(data: Step4Data): Step4ValidationResult {
    const errors: Record<string, string> = {};
    const childErrors: Record<string, Record<string, string>> = {};
    const sanitizedChildren: Child[] = [];
    let hasValidChildren = false;

    // If no children or has_children is false, it's valid (optional step)
    if (!data.has_children || !data.children || data.children.length === 0) {
        return {
            isValid: true,
            errors: {},
            childErrors: {},
            sanitizedData: {
                ...data,
                children: [],
                children_data: JSON.stringify([]),
                children_photos: []
            },
            hasData: false
        };
    }

    // Validate each child where once a child is added, birth_date becomes required
    data.children.forEach((child) => {
        const cErrors: Record<string, string> = {};
        const sanitizedChild: Partial<Child> = { id: child.id };

        // Name (always optional)
        const nameResult = validateChildName(child.name);
        if (nameResult.error) cErrors.name = nameResult.error;
        else sanitizedChild.name = nameResult.value || "";

        // Birth date (REQUIRED once child is added)
        const birthResult = validateBirthDate(child.birth_date);
        if (birthResult.error) cErrors.birth_date = birthResult.error;
        else sanitizedChild.birth_date = birthResult.value || "";

        // Photo (always optional)
        if (child.photo) {
            const photoResult = validatePhoto(child.photo);
            if (!photoResult.isValid) cErrors.photo = photoResult.error!;
            else sanitizedChild.photo = child.photo;
        }

        // If this child has any data (even just a birth_date), we consider there are children
        if (child.birth_date || child.name?.trim() || child.photo) {
            hasValidChildren = true;
        }

        // Add errors for this child if any exist
        if (Object.keys(cErrors).length > 0) {
            childErrors[child.id] = cErrors;
        } else {
            sanitizedChildren.push(sanitizedChild as Child);
        }
    });

    // Limit check
    if (data.children.length > 10) {
        errors.general = "Maximum of 10 children can be added";
    }

    // The step is invalid if there are any child errors
    const isValid = Object.keys(errors).length === 0 && Object.keys(childErrors).length === 0;

    // Prepare sanitized data
    const childrenData = sanitizedChildren.map(child => ({
        name: child.name,
        birth_date: child.birth_date,
        photo_url: null,
    }));

    const photoFiles = sanitizedChildren
        .map(child => child.photo)
        .filter((photo): photo is File => !!photo);

    return {
        isValid,
        errors,
        childErrors,
        sanitizedData: {
            has_children: hasValidChildren,
            children: sanitizedChildren,
            children_data: JSON.stringify(childrenData),
            children_photos: photoFiles
        },
        hasData: hasValidChildren
    };
}