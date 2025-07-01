export type JobBonus = {
    title: string;
    amount?: number | null;
    type: string;
    frequency: string;
    status?: string;
    description?: string | null;
    conditions?: string | null;
};

export type JobLocation = {
    brgy: string;
    city: string;
    province: string;
    postal_code?: string;
    landmark?: string;
    directions?: string;
    latitude?: number | null;
    longitude?: number | null;
    is_hidden?: boolean;
};

export type JobPhoto = {
    url: string;
    caption?: string;
    type: string;
    sort_order?: number;
    is_primary?: boolean;
};

export type JobPostingForm = {
    title: string;
    work_types: string[];
    provides_toiletries?: boolean;
    provides_food?: boolean;
    accommodation_type: string;
    min_salary?: number | null;
    max_salary?: number | null;
    day_off_preference?: string;
    day_off_type: string;
    language_preferences?: string[];
    description: string;
};