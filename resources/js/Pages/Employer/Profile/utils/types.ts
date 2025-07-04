export interface User {
    id: number;
    email: string;
    avatar: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProfileAddress {
    street?: string | null;
    barangay?: string | null;
    city?: string | null;
    province?: string | null;
}

export interface Profile {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    phone_number?: string | null;
    is_phone_private: boolean;
    birth_date?: string | null;
    address?: ProfileAddress | null;
    is_address_private: boolean;
    is_archived: boolean;
    preferred_contact_methods?: string[] | null;
    preferred_language?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Employer {
    id: number;
    user_id: number;
    household_description?: string | null;
    family_size?: number | null;
    has_children: boolean;
    has_pets: boolean;
    status: 'active' | 'looking' | 'fulfilled';
    maid_preferences?: string[] | null;
    is_verified: boolean;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    children?: EmployerChild[];
    pets?: EmployerPet[];   
}

export interface EmployerChild {
    id: number;
    employer_id: number;
    name?: string | null;
    birth_date: string;
    photo_url?: string | null;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export interface EmployerPet {
    id: number;
    employer_id: number;
    type: string;
    name?: string | null;
    photo_url?: string | null;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}
