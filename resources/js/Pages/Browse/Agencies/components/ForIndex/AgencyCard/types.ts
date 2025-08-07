export interface AgencyCardProps {
    agency: any;
    compact?: boolean;
    featured?: boolean;
    highlightPremium?: boolean;
    highlightVerified?: boolean;
    highlightMaidCount?: boolean;
    highlightNew?: boolean;
}

export interface AgencyDisplayData {
    id: string | number;
    name: string;
    mainPhoto: string | null;
    description: string | null;
    formattedAddress: string;
    maidsCount: number;
    isPremium: boolean;
    isVerified: boolean;
    createdAt: string;
    website: string | null;
}
