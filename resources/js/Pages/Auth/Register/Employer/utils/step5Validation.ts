import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";
import { Step5Data, Pet, ValidationResult } from "./types";

export interface Step5ValidationResult extends ValidationResult {
    petErrors: Record<string, Record<string, string>>;
    sanitizedData?: Step5Data;
    hasData: boolean;
}

// Pet type information for UI
export const getPetTypeInfo = (type: string) => {
    const petTypes = {
        dog: { label: "Dog", category: "common" },
        cat: { label: "Cat", category: "common" },
        bird: { label: "Bird", category: "common" },
        fish: { label: "Fish", category: "common" },
        rabbit: { label: "Rabbit", category: "specialized" },
        hamster: { label: "Hamster", category: "specialized" },
        guinea_pig: { label: "Guinea Pig", category: "specialized" },
        turtle: { label: "Turtle", category: "specialized" },
        snake: { label: "Snake", category: "specialized" },
        lizard: { label: "Lizard", category: "specialized" },
        other: { label: "Other", category: "specialized" },
    };
    
    return petTypes[type as keyof typeof petTypes] || { label: "Unknown", category: "other" };
};

// --- Field Validators ---

function validatePetType(type: string) {
    if (!type || !type.trim()) return { error: "Pet type is required" };
    return { value: type.trim() };
}

function validatePetName(name: string) {
    if (!name || !name.trim()) return { value: "" }; // Optional
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(name, "text", 50);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (sanitizedValue.trim().length > 50) return { error: "Pet name cannot exceed 50 characters" };
    return { value: sanitizedValue };
}

function validatePetPhoto(photo?: File) {
    if (!photo) return { isValid: true };
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (photo.size > maxSize) return { isValid: false, error: "Pet photo file size must be less than 5MB" };
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(photo.type)) return { isValid: false, error: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)" };
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar'];
    const fileName = photo.name.toLowerCase();
    if (suspiciousExtensions.some(ext => fileName.includes(ext))) return { isValid: false, error: "Invalid file type detected" };
    return { isValid: true };
}

// --- Main Validation ---

export function validateStep5(data: Step5Data): Step5ValidationResult {
    const errors: Record<string, string> = {};
    const petErrors: Record<string, Record<string, string>> = {};
    const sanitizedPets: Pet[] = [];
    let hasValidPets = false;

    // If no pets or has_pets is false, it's valid (optional step)
    if (!data.has_pets || !data.pets || data.pets.length === 0) {
        return {
            isValid: true,
            errors: {},
            petErrors: {},
            sanitizedData: {
                ...data,
                pets: [],
                pets_data: JSON.stringify([]),
                pets_photos: []
            },
            hasData: false
        };
    }

    // Validate each pet
    data.pets.forEach((pet) => {
        const pErrors: Record<string, string> = {};
        const sanitizedPet: Partial<Pet> = { id: pet.id };

        // Type (required)
        const typeResult = validatePetType(pet.type);
        if (typeResult.error) pErrors.type = typeResult.error;
        else sanitizedPet.type = typeResult.value;

        // Name (optional)
        const nameResult = validatePetName(pet.name);
        if (nameResult.error) pErrors.name = nameResult.error;
        else sanitizedPet.name = nameResult.value || "";

        // Photo (optional)
        if (pet.photo) {
            const photoResult = validatePetPhoto(pet.photo);
            if (!photoResult.isValid) pErrors.photo = photoResult.error!;
            else sanitizedPet.photo = pet.photo;
        }

        // If any field is filled, consider this pet as having data
        const hasData = !!(pet.type || pet.name.trim() || pet.photo);
        if (hasData) hasValidPets = true;

        if (Object.keys(pErrors).length > 0) {
            petErrors[pet.id] = pErrors;
        } else {
            sanitizedPets.push(sanitizedPet as Pet);
        }
    });

    // Limit
    if (data.pets.length > 20) {
        errors.general = "Maximum of 20 pets can be added";
    }

    // Prepare sanitized data
    const petsData = sanitizedPets.map(pet => ({
        type: pet.type,
        name: pet.name,
        photo_url: null,
    }));

    const photoFiles = sanitizedPets
        .map(pet => pet.photo)
        .filter((photo): photo is File => !!photo);

    return {
        isValid: Object.keys(errors).length === 0 && Object.keys(petErrors).length === 0,
        errors,
        petErrors,
        sanitizedData: {
            has_pets: hasValidPets,
            pets: sanitizedPets,
            pets_data: JSON.stringify(petsData),
            pets_photos: photoFiles
        },
        hasData: hasValidPets
    };
}