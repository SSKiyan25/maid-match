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

export interface Agency {
    id: number;
    user_id: number;
    name: string;
    license_number: string | null;
    license_photo_front: string | null;
    license_photo_back: string | null;
    description: string | null;
    established_at: string | null;
    business_email: string | null;
    business_phone: string | null;
    contact_person: any; // You can define a more specific type if needed
    address: any; // You can define a more specific type if needed
    website: string | null;
    facebook_page: string | null;
    placement_fee: number | null;
    show_fee_publicly: boolean;
    status: "active" | "inactive" | "suspended" | "pending_verification";
    is_premium: boolean;
    premium_at: string | null;
    premium_expires_at: string | null;
    is_verified: boolean;
    verified_at: string | null;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
