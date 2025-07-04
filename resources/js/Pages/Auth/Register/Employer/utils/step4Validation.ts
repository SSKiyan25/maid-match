import { validateAndSanitizeInput, validateFormSecurity } from './securityValidation';

export interface Child {
    id: string;
    name: string;
    birth_date: string;
    photo?: File;
}

export interface Step4Data {
    has_children: boolean;
    children: Child[];
    children_data?: string;
    children_photos?: File[];
}

export const validateChildName = (name: string): { isValid: boolean; error?: string; sanitizedValue?: string } => {
    if (!name || !name.trim()) {
        return { isValid: true, sanitizedValue: '' }; // Name is optional
    }

    const security = validateAndSanitizeInput(name, 'text', 50);
    
    if (!security.isValid) {
        return { isValid: false, error: security.securityIssues.join(', ') };
    }

    const sanitizedName = security.sanitizedValue;
    
    if (sanitizedName.trim().length < 2) {
        return { isValid: false, error: "Child's name must be at least 2 characters long" };
    }
    
    return { isValid: true, sanitizedValue: sanitizedName };
};

export const validateBirthDate = (birthDate: string): { isValid: boolean; error?: string; sanitizedValue?: string } => {
    if (!birthDate || !birthDate.trim()) {
        return { isValid: true, sanitizedValue: '' }; // Birth date is optional
    }

    const security = validateAndSanitizeInput(birthDate, 'text', 20);
    
    if (!security.isValid) {
        return { isValid: false, error: security.securityIssues.join(', ') };
    }

    const date = new Date(birthDate);
    const today = new Date();
    
    // Check if it's a valid date
    if (isNaN(date.getTime())) {
        return { isValid: false, error: "Please enter a valid birth date" };
    }
    
    // Check if birth date is not in the future
    if (date > today) {
        return { isValid: false, error: "Birth date cannot be in the future" };
    }
    
    // Check if birth date is reasonable (not too old)
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear() - 100);
    
    if (date < hundredYearsAgo) {
        return { isValid: false, error: "Please enter a valid birth date" };
    }
    
    return { isValid: true, sanitizedValue: birthDate };
};

export const validatePhoto = (photo: File): { isValid: boolean; error?: string } => {
    if (!photo) {
        return { isValid: true }; // Photo is optional
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (photo.size > maxSize) {
        return { isValid: false, error: "Photo file size must be less than 5MB" };
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

    return { isValid: true };
};

export const validateChild = (child: Child): { isValid: boolean; errors: Record<string, string>; sanitizedChild?: Child } => {
    const errors: Record<string, string> = {};
    const sanitizedChild: Partial<Child> = { id: child.id };

    // Validate name
    const nameValidation = validateChildName(child.name);
    if (!nameValidation.isValid) {
        errors.name = nameValidation.error!;
    } else {
        sanitizedChild.name = nameValidation.sanitizedValue || '';
    }

    // Validate birth date
    const birthDateValidation = validateBirthDate(child.birth_date);
    if (!birthDateValidation.isValid) {
        errors.birth_date = birthDateValidation.error!;
    } else {
        sanitizedChild.birth_date = birthDateValidation.sanitizedValue || '';
    }

    // Validate photo
    if (child.photo) {
        const photoValidation = validatePhoto(child.photo);
        if (!photoValidation.isValid) {
            errors.photo = photoValidation.error!;
        } else {
            sanitizedChild.photo = child.photo;
        }
    }

    // Check if child has meaningful data
    const hasData = !!(child.name.trim() || child.birth_date || child.photo);
    
    // If child has some data but is missing critical info, provide guidance
    if (hasData && !child.birth_date && !child.name.trim()) {
        errors.general = "Please provide either a name or birth date for this child";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedChild: sanitizedChild as Child
    };
};

export const validateStep4 = (data: Step4Data) => {
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

    // Validate each child
    data.children.forEach((child, index) => {
        const childValidation = validateChild(child);
        
        if (!childValidation.isValid) {
            childErrors[child.id] = childValidation.errors;
        } else if (childValidation.sanitizedChild) {
            sanitizedChildren.push(childValidation.sanitizedChild);
            hasValidChildren = true;
        }
    });

    // Check if there are too many children (reasonable limit)
    if (data.children.length > 10) {
        errors.general = "Maximum of 10 children can be added";
    }

    // Prepare sanitized data
    const childrenData = sanitizedChildren.map(child => ({
        name: child.name,
        birth_date: child.birth_date,
        photo_url: null, // Will be set by backend after upload
    }));

    const photoFiles = sanitizedChildren
        .map(child => child.photo)
        .filter((photo): photo is File => photo !== undefined);

    return {
        isValid: Object.keys(errors).length === 0 && Object.keys(childErrors).length === 0,
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
};

export const calculateAge = (birthDate: string): number | null => {
    if (!birthDate) return null;
    
    const today = new Date();
    const birth = new Date(birthDate);
    
    if (isNaN(birth.getTime())) return null;
    
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age >= 0 ? age : null;
};

export const getAgeGroup = (age: number | null): string => {
    if (age === null) return "Unknown";
    if (age < 1) return "Infant (0-1 year)";
    if (age <= 3) return "Toddler (1-3 years)";
    if (age <= 5) return "Preschooler (4-5 years)";
    if (age <= 12) return "School Age (6-12 years)";
    if (age <= 17) return "Teenager (13-17 years)";
    return "Adult (18+ years)";
};

export const generateChildId = (): string => {
    return `child_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getChildCompletionPercentage = (children: Child[]): number => {
    if (!children || children.length === 0) return 0;
    
    let totalFields = 0;
    let completedFields = 0;
    
    children.forEach(child => {
        totalFields += 3; // name, birth_date, photo
        
        if (child.name && child.name.trim()) completedFields++;
        if (child.birth_date) completedFields++;
        if (child.photo) completedFields++;
    });
    
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
};