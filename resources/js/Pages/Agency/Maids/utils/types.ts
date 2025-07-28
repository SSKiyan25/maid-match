import { User } from "@/types";

export interface MaidDocumentInput {
    type: string;
    title: string;
    file?: File; // For upload
    url?: string; // For already uploaded
    description?: string | null;
    is_archived?: boolean;
}

export interface AddressInput {
    street: string;
    barangay: string;
    city: string;
    province: string;
}

export interface MaidProfileInput {
    first_name: string;
    last_name: string;
    phone_number?: string | null;
    birth_date?: string | null;
    address?: AddressInput | null; // Will be stored as JSON
    is_phone_private?: boolean;
    is_address_private?: boolean;
    is_archived?: boolean;
    preferred_contact_methods?: string[];
    preferred_language?: string;
}

export interface MaidInput {
    bio?: string | null;
    skills?: string[];
    nationality?: string | null;
    languages?: string[];
    social_media_links?: Record<string, string>;
    marital_status?: "single" | "married" | "divorced" | "widowed" | null;
    has_children?: boolean;
    expected_salary?: number | null;
    is_willing_to_relocate?: boolean;
    preferred_accommodation?: "live_in" | "live_out" | "either" | null;
    earliest_start_date?: string | null;
    years_experience?: number;
    status?: "available" | "employed" | "unavailable" | null;
    availability_schedule?: any[];
    emergency_contact_name?: string | null;
    emergency_contact_phone?: string | null;
    verification_badges?: string[];
    is_verified?: boolean;
    is_archived?: boolean;
}

export interface AgencyMaidInput {
    status?: string;
    is_premium?: boolean;
    is_trained?: boolean;
    agency_notes?: string | null;
    agency_fee?: number | null;
    assigned_at?: string;
    status_changed_at?: string;
    is_archived?: boolean;
}

export interface MaidUserInput {
    email: string;
    password: string;
    password_confirmation?: string;
}

export interface CreateMaidFormData {
    user: MaidUserInput;
    profile: MaidProfileInput;
    maid: MaidInput;
    agency_maid: AgencyMaidInput;
    documents: MaidDocumentInput[];
    [key: string]: any;
}

export interface EditMaidPageProps {
    auth: { user: User };
    agencyMaid: any;
    [key: string]: any;
}
