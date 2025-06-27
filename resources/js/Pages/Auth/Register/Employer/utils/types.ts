export interface Step1Data {
    email: string;
    password: string;
    password_confirmation: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    birth_date: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

// Step 2 Types
export interface AddressData {
    street: string;
    barangay: string;
    city: string;
    province: string;
}

export interface Step2Data {
    address: string;
    family_size: number;
    household_description: string;
}

export interface Step2HouseholdInfoProps {
    data: Step2Data;
    onChange: (updates: Partial<Step2Data>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
}

// Step 3 Types
export interface Step3Data {
    work_type: string;
    accommodation: string;
    budget_min: number;
    budget_max: number;
    schedule: string;
    experience_needed: string;
    special_requirements: string;
    maid_preferences?: string;
}

export interface Step3RequirementsProps {
    data: Step3Data;
    onChange: (updates: Partial<Step3Data>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
}

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

export interface Step4ChildrenProps {
    data: Step4Data;
    onChange: (updates: Partial<Step4Data>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
}

// Step 5 Types
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

export interface Step5PetsProps {
    data: Step5Data;
    onChange: (updates: Partial<Step5Data>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
}

export interface Step6Data {
    // Step 1 - Basic Info
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number: string;
    birth_date: string;

    // Step 2 - Household Info
    address: string;
    family_size: number;
    household_description?: string;

    // Step 3 - Requirements (all optional)
    work_type?: string;
    accommodation?: string;
    budget_min?: number;
    budget_max?: number;
    schedule?: string;
    experience_needed?: string;
    special_requirements?: string;
    maid_preferences?: string;

    // Step 4 - Children (optional)
    has_children: boolean;
    children?: Child[];
    children_data?: string;
    children_photos?: File[];

    // Step 5 - Pets (optional)
    has_pets: boolean;
    pets?: Pet[];
    pets_data?: string;
    pets_photos?: File[];
}

export interface Step6ReviewProps {
    data: Step6Data;
    onEdit: (step: number) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    errors: Record<string, string>;
    submissionErrors: Record<string, string> | null;
}

