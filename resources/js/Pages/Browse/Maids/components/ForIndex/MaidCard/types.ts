export interface MaidCardProps {
    maid: any;
    showMatchBadge?: boolean;
    showLocationBadge?: boolean;
    showNewBadge?: boolean;
    featured?: boolean;
    compact?: boolean;
    useComputedMatch?: boolean;
    selectedJobId?: string | null;
    showBookmarked?: boolean;
}

export interface MatchInfo {
    job_id?: string | number;
    job_title?: string;
    match_percentage?: number;
}

export interface MaidDisplayData {
    id: string | number;
    fullName: string;
    mainPhoto: string | null;
    initials: string;
    isAddressPrivate: boolean;
    formattedLocation: string;
    city: string | null;
    province: string | null;
    barangay: string | null;
    skills: string[];
    languages: string[];
    createdAt: string;
    agencyName: string | null;
    matchInfo: MatchInfo | null;
    isRecent: boolean;
    years_experience?: number;
}
