import { validateAndSanitizeInput, validateSelectValue, validateFormSecurity } from './securityValidation';

export interface Pet {
    id: string;
    type: string;
    name: string;
    photo?: File;
}

export interface Step5Data {
    has_pets: boolean;
    pets: Pet[];
    pets_data?: string;
    pets_photos?: File[];
}

// Define allowed pet types for security validation
const ALLOWED_PET_TYPES = [
    'dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 
    'guinea_pig', 'turtle', 'snake', 'lizard', 'other'
];

export const validatePetName = (name: string): { isValid: boolean; error?: string; sanitizedValue?: string } => {
    if (!name || !name.trim()) {
        return { isValid: true, sanitizedValue: '' }; // Name is optional
    }

    const security = validateAndSanitizeInput(name, 'text', 50);
    
    if (!security.isValid) {
        return { isValid: false, error: security.securityIssues.join(', ') };
    }

    const sanitizedName = security.sanitizedValue;
    
    if (sanitizedName.trim().length < 1) {
        return { isValid: false, error: "Pet name must be at least 1 character long" };
    }

    if (sanitizedName.trim().length > 50) {
        return { isValid: false, error: "Pet name cannot exceed 50 characters" };
    }
    
    return { isValid: true, sanitizedValue: sanitizedName };
};

export const validatePetType = (petType: string): { isValid: boolean; error?: string; sanitizedValue?: string } => {
    if (!petType || !petType.trim()) {
        return { isValid: false, error: "Pet type is required when adding a pet" };
    }

    const typeValidation = validateSelectValue(petType, ALLOWED_PET_TYPES);
    if (!typeValidation.isValid) {
        return { isValid: false, error: typeValidation.error! };
    }

    return { isValid: true, sanitizedValue: petType };
};

export const validatePetPhoto = (photo: File): { isValid: boolean; error?: string } => {
    if (!photo) {
        return { isValid: true }; // Photo is optional
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (photo.size > maxSize) {
        return { isValid: false, error: "Pet photo file size must be less than 5MB" };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(photo.type)) {
        return { isValid: false, error: "Please upload a valid image file (JPEG, PNG, GIF, or WebP)" };
    }

    // Check for potentially malicious files
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar'];
    const fileName = photo.name.toLowerCase();
    
    if (suspiciousExtensions.some(ext => fileName.includes(ext))) {
        return { isValid: false, error: "Invalid file type detected" };
    }

    // Additional security: check if file name contains suspicious patterns
    const suspiciousPatterns = [
        /[<>{}[\]\\\/]/g, // Special characters
        /(%[0-9a-f]{2}){3,}/gi, // URL encoding chains
        /(\.\.\/|\.\.\\)/g, // Path traversal
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(fileName))) {
        return { isValid: false, error: "Invalid characters in file name" };
    }

    return { isValid: true };
};

export const validatePet = (pet: Pet): { isValid: boolean; errors: Record<string, string>; sanitizedPet?: Pet } => {
    const errors: Record<string, string> = {};
    const sanitizedPet: Partial<Pet> = { id: pet.id };

    // Validate pet type (required if pet is being added)
    const typeValidation = validatePetType(pet.type);
    if (!typeValidation.isValid) {
        errors.type = typeValidation.error!;
    } else {
        sanitizedPet.type = typeValidation.sanitizedValue!;
    }

    // Validate pet name (optional)
    const nameValidation = validatePetName(pet.name);
    if (!nameValidation.isValid) {
        errors.name = nameValidation.error!;
    } else {
        sanitizedPet.name = nameValidation.sanitizedValue || '';
    }

    // Validate photo (optional)
    if (pet.photo) {
        const photoValidation = validatePetPhoto(pet.photo);
        if (!photoValidation.isValid) {
            errors.photo = photoValidation.error!;
        } else {
            sanitizedPet.photo = pet.photo;
        }
    }

    // Check if pet has meaningful data
    const hasData = !!(pet.type || pet.name.trim() || pet.photo);
    
    // If pet entry exists but has no type, require it
    if (hasData && !pet.type) {
        errors.general = "Please select a pet type or remove this pet entry";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedPet: sanitizedPet as Pet
    };
};

export const validateStep5 = (data: Step5Data) => {
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
    data.pets.forEach((pet, index) => {
        const petValidation = validatePet(pet);
        
        if (!petValidation.isValid) {
            petErrors[pet.id] = petValidation.errors;
        } else if (petValidation.sanitizedPet) {
            sanitizedPets.push(petValidation.sanitizedPet);
            hasValidPets = true;
        }
    });

    // Check if there are too many pets (reasonable limit)
    if (data.pets.length > 20) {
        errors.general = "Maximum of 20 pets can be added";
    }

    // Prepare sanitized data
    const petsData = sanitizedPets.map(pet => ({
        type: pet.type,
        name: pet.name,
        photo_url: null, // Will be set by backend after upload
    }));

    const photoFiles = sanitizedPets
        .map(pet => pet.photo)
        .filter((photo): photo is File => photo !== undefined);

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
};

export const generatePetId = (): string => {
    return `pet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getPetCompletionPercentage = (pets: Pet[]): number => {
    if (!pets || pets.length === 0) return 0;
    
    let totalFields = 0;
    let completedFields = 0;
    
    pets.forEach(pet => {
        totalFields += 3; // type, name, photo
        
        if (pet.type) completedFields++;
        if (pet.name && pet.name.trim()) completedFields++;
        if (pet.photo) completedFields++;
    });
    
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};

// Simplified pet type info - just for basic helper matching
export const getPetTypeInfo = (petType: string): {
    category: 'common' | 'specialized' | 'unknown';
    label: string;
} => {
    const petTypeMap: Record<string, any> = {
        dog: { category: 'common', label: 'Dog' },
        cat: { category: 'common', label: 'Cat' },
        bird: { category: 'common', label: 'Bird' },
        fish: { category: 'common', label: 'Fish' },
        rabbit: { category: 'common', label: 'Rabbit' },
        hamster: { category: 'common', label: 'Hamster' },
        guinea_pig: { category: 'common', label: 'Guinea Pig' },
        turtle: { category: 'common', label: 'Turtle' },
        snake: { category: 'specialized', label: 'Snake' },
        lizard: { category: 'specialized', label: 'Lizard' },
        other: { category: 'unknown', label: 'Other' }
    };

    return petTypeMap[petType] || petTypeMap.other;
};