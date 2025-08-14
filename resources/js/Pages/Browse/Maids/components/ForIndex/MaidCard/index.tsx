import { CompactCard } from "./CompactCard";
import { RegularCard } from "./RegularCard";
import { useBookmark } from "./hooks/useBookmark";
import { MaidCardProps } from "./types";

export default function MaidCard({
    maid,
    showMatchBadge = false,
    showLocationBadge = false,
    showNewBadge = false,
    featured = false,
    compact = false,
    useComputedMatch = true,
    selectedJobId = null,
    showBookmarked = false, // Add default value
}: MaidCardProps) {
    // Early return if maid is undefined or null
    if (!maid) {
        return null;
    }

    // Use the bookmark hook
    const {
        isBookmarked,
        isLoading: isBookmarkLoading,
        toggleBookmark,
    } = useBookmark(maid.id);

    // Extract maid data
    const fullName = maid.full_name || "";
    const userPhotos = maid.user?.photos || [];
    const avatar = maid.user?.avatar || null;

    // Get primary photo from user photos if available
    let mainPhoto = null;
    if (avatar) {
        mainPhoto = `/storage/${avatar}`;
    }
    // const primaryPhoto = userPhotos.find((photo: any) => photo.is_primary);

    // If no primary photo, just use the first one
    // if (primaryPhoto) {
    //     mainPhoto = `/storage/${primaryPhoto.url}`;
    // } else if (userPhotos.length > 0) {
    //     mainPhoto = `/storage/${userPhotos[0].url}`;
    // } else if (avatar) {
    //     mainPhoto = `/storage/${avatar}`;
    // }

    // Check if address is private by examining the profile directly
    const profile = maid.user?.profile || {};
    const isAddressPrivate = profile.is_address_private === true;

    // Get location components
    const address = profile.address || {};
    const city = address.city || null;
    const province = address.province || null;
    const barangay = address.barangay || null;

    // Format location for display
    let formattedLocation = "Location not specified";
    if (city || province) {
        const locationParts = [];
        if (city) locationParts.push(city);
        if (province) locationParts.push(province);
        formattedLocation = locationParts.join(", ");
    }

    // Other maid data
    const skills = maid.skills || [];
    const languages = maid.languages || [];
    const createdAt = maid.created_at;
    const agencyName =
        maid.agency_name || (maid.agency ? maid.agency.name : null);

    // Determine which match information to use based on props
    let matchInfo = maid.best_match;

    // If a specific job is selected, prioritize the match for that job
    if (selectedJobId) {
        if (
            useComputedMatch &&
            maid.computed_match &&
            maid.computed_match.job_id?.toString() === selectedJobId
        ) {
            matchInfo = maid.computed_match;
        } else if (
            maid.best_match &&
            maid.best_match.job_id?.toString() === selectedJobId
        ) {
            matchInfo = maid.best_match;
        } else if (maid.matches && Array.isArray(maid.matches)) {
            const specificMatch = maid.matches.find(
                (match: any) => match.job_id?.toString() === selectedJobId
            );
            if (specificMatch) {
                matchInfo = specificMatch;
            }
        }
    }

    // Calculate initials for avatar fallback
    const initials = fullName
        ? fullName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
        : "MA";

    // Check if the maid was added recently (within 3 days)
    const isRecent =
        createdAt &&
        new Date(createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    // Always show match badge when a job is selected
    const shouldShowMatchBadge =
        showMatchBadge || (!!selectedJobId && !!matchInfo?.match_percentage);

    // Unified data object for the card components
    const maidData = {
        id: maid.id,
        fullName,
        mainPhoto,
        initials,
        isAddressPrivate,
        formattedLocation,
        city,
        province,
        barangay,
        skills,
        languages,
        createdAt,
        agencyName,
        matchInfo,
        isRecent,
        years_experience: maid.years_experience,
    };

    // Return the appropriate card type based on props
    return compact ? (
        <CompactCard
            maidData={maidData}
            isBookmarked={isBookmarked}
            isBookmarkLoading={isBookmarkLoading}
            toggleBookmark={toggleBookmark}
            showMatchBadge={shouldShowMatchBadge}
            showLocationBadge={showLocationBadge}
            showNewBadge={showNewBadge}
            showBookmarked={showBookmarked} // Pass it to CompactCard
        />
    ) : (
        <RegularCard
            maidData={maidData}
            isBookmarked={isBookmarked}
            isBookmarkLoading={isBookmarkLoading}
            toggleBookmark={toggleBookmark}
            showMatchBadge={shouldShowMatchBadge}
            showLocationBadge={showLocationBadge}
            showNewBadge={showNewBadge}
            featured={featured}
            showBookmarked={showBookmarked} // Pass it to RegularCard
        />
    );
}
