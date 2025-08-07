import { CompactCard } from "./CompactCard";
import { RegularCard } from "./RegularCard";
import { AgencyCardProps } from "./types";

export default function AgencyCard({
    agency,
    compact = false,
    featured = false,
    highlightPremium = false,
    highlightVerified = false,
    highlightMaidCount = false,
    highlightNew = false,
}: AgencyCardProps) {
    // Early return if agency is undefined or null
    if (!agency) {
        return null;
    }

    // Extract agency data
    const name = agency.name || "";
    const description = agency.description || "";
    const mainPhoto = agency.main_photo || null;
    const formattedAddress =
        agency.formatted_address || "Address not specified";
    const maidsCount = agency.maids_count || 0;
    const isPremium = agency.is_premium || false;
    const isVerified = agency.is_verified || false;
    const createdAt = agency.created_at;
    const website = agency.website || null;

    // Check if the agency was added recently (within 7 days)
    const isRecent =
        createdAt &&
        new Date(createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Unified data object for the card components
    const agencyData = {
        id: agency.id,
        name,
        mainPhoto,
        description,
        formattedAddress,
        maidsCount,
        isPremium,
        isVerified,
        createdAt,
        website,
    };

    // Return the appropriate card type based on props
    return compact ? (
        <CompactCard
            agencyData={agencyData}
            highlightPremium={highlightPremium}
            highlightVerified={highlightVerified}
            highlightMaidCount={highlightMaidCount}
            highlightNew={highlightNew && isRecent}
        />
    ) : (
        <RegularCard
            agencyData={agencyData}
            featured={featured}
            highlightPremium={highlightPremium}
            highlightVerified={highlightVerified}
            highlightMaidCount={highlightMaidCount}
            highlightNew={highlightNew && isRecent}
        />
    );
}
