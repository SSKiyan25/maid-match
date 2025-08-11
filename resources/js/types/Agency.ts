export interface AgencyPhoto {
    id: number;
    agency_id: number;
    url: string;
    caption?: string | null;
    type: "logo" | "office" | "team" | "certificate" | "other";
    sort_order?: number | null;
    is_primary: boolean;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    type_label?: string;
    display_caption?: string;
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
    contact_person: any;
    address: any;
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
    photos?: AgencyPhoto[];
    credits?: {
        available: number;
        recent_transactions: any[];
    };
}
