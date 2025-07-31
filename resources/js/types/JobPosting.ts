export type JobPostingStatus =
    | "active"
    | "inactive"
    | "filled"
    | "expired"
    | "draft";
export type AccommodationType = "live_in" | "live_out" | "flexible";
export type DayOffType = "weekly" | "monthly" | "flexible" | "none";

export type JobBonusStatus = "active" | "pending" | "conditional";
export type JobBonusType =
    | "monetary"
    | "13th_month"
    | "performance"
    | "holiday"
    | "loyalty"
    | "completion"
    | "referral"
    | "overtime"
    | "other";
export type JobBonusFrequency =
    | "one_time"
    | "weekly"
    | "monthly"
    | "quarterly"
    | "yearly"
    | "upon_completion"
    | "performance_based";

export interface JobBonus {
    id: number;
    job_posting_id: number;
    title: string;
    amount?: number | null;
    status: JobBonusStatus;
    description?: string | null;
    type: JobBonusType;
    frequency?: JobBonusFrequency | null;
    conditions?: string | null;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export type JobPhotoType =
    | "interior"
    | "exterior"
    | "room"
    | "kitchen"
    | "bathroom"
    | "garden"
    | "general";

export interface JobPhoto {
    id: number;
    job_posting_id: number;
    url: string;
    caption?: string | null;
    type: JobPhotoType;
    sort_order: number;
    is_primary: boolean;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export interface JobLocation {
    id: number;
    job_posting_id: number;
    brgy: string;
    city: string;
    landmark?: string | null;
    is_hidden: boolean;
    province?: string | null;
    postal_code?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    directions?: string | null;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export type JobApplicationStatus =
    | "pending"
    | "reviewed"
    | "shortlisted"
    | "rejected"
    | "accepted"
    | "withdrawn";

export interface JobApplication {
    id: number;
    job_posting_id: number;
    maid_id: number;
    status: JobApplicationStatus;
    ranking_position?: number | null;
    employer_notes?: string | null;
    description?: string | null;
    proposed_salary?: number | null;
    applied_at: string;
    reviewed_at?: string | null;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    maid?: any;
    job_posting?: JobPosting;
}

export type JobInterviewStatus =
    | "scheduled"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "rescheduled"
    | "absent";

export type JobInterviewType =
    | "video_call"
    | "phone_call"
    | "in_person"
    | "home_visit";

export interface JobInterviewSchedule {
    id: number;
    job_posting_id: number;
    maid_id: number;
    job_application_id: number;
    title: string;
    interview_date: string;
    time_start: string;
    time_end: string;
    status: JobInterviewStatus;
    description?: string | null;
    type: JobInterviewType;
    location?: string | null;
    meeting_link?: string | null;
    employer_notes?: string | null;
    maid_notes?: string | null;
    employer_rating?: number | null;
    maid_rating?: number | null;
    confirmed_at?: string | null;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
}

export interface JobPosting {
    id: number;
    employer_id: number;
    title: string;
    work_types?: string[]; // JSON array
    provides_toiletries: boolean;
    provides_food: boolean;
    accommodation_type?: AccommodationType | null;
    min_salary?: number | null;
    max_salary?: number | null;
    day_off_preference?: string | null;
    day_off_type: DayOffType;
    language_preferences?: string[]; // JSON array
    description?: string | null;
    status: JobPostingStatus;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    bonuses?: JobBonus[];
    photos?: JobPhoto[];
    location?: JobLocation;
    applications?: JobApplication[];
    interview_schedules?: JobInterviewSchedule[];
}
