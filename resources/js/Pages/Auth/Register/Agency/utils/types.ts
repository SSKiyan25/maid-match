export interface AgencyUserStep {
    email: string;
    password: string;
    password_confirmation: string;
    avatar?: File | null;
}

export interface AgencyContactPerson {
    name?: string;
    phone?: string;
    email?: string;
    facebook?: string;
}

export interface AgencyInfoStep {
    name: string;
    license_number: string;
    license_photo_front?: File | null;
    license_photo_back?: File | null;
    description?: string;
    established_at?: string;
    business_email?: string;
    business_phone?: string;
    contact_person?: AgencyContactPerson;
}

export interface AgencyAddressStep {
    street?: string;
    barangay?: string;
    city?: string;
    province?: string;
}

export interface AgencyOtherInfoStep {
    website?: string;
    facebook_page?: string;
    placement_fee?: number | null;
    show_fee_publicly?: boolean;
}