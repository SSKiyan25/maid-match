import type { Agency, AgencyPhoto } from "./Agency";

export interface Role {
    id: number;
    name: string;
    display_name?: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: string;
    created_at?: string;
    updated_at?: string;
    avatar?: string;
}

export type Agency = Agency;
export type AgencyPhoto = AgencyPhoto;

interface MaidData {
    id: number;
    maid: {
        id: number;
        bio: string;
        skills: string[];
        languages: string[];
        banner_photo?: string;
        status: string;
        expected_salary: string;
        years_experience: number;
        nationality: string;
        marital_status: string;
        has_children: boolean;
        status: string;
        preferred_accommodation: string;
        earliest_start_date: string;
        assigned_at: string;
        documents: any[];
        social_media_links?: Record<string, string>;
        emergency_contact_name: string;
        emergency_contact_phone: string;
        agency_notes: string;
        is_willing_to_relocate: boolean;
        user: {
            id: number;
            email: string;
            avatar: string;
            profile: {
                first_name: string;
                last_name: string;
                phone_number: string;
                birth_date: string;
                address: {
                    street: string;
                    barangay: string;
                    city: string;
                    province: string;
                };
            };
        };
    };
    is_premium: boolean;
    is_trained: boolean;
    is_phone_private: boolean;
    is_address_private: boolean;
    agency_fee: string;
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
