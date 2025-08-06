import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { MatchCircle } from "./MatchCircle";
import { MatchBadge } from "./MatchBadge";
import { LocationDisplay } from "./LocationDisplay";
import { Button } from "@/Components/ui/button";
import { Bookmark, BookmarkCheck, Lock, Badge } from "lucide-react";
import { Badge as UIBadge } from "@/Components/ui/badge";

interface CardImageProps {
    mainPhoto: string | null;
    fullName: string;
    initials: string;
    isAddressPrivate: boolean;
    city: string | null;
    province: string | null;
    formattedLocation: string;
    isRecent: boolean;
    showMatchBadge: boolean;
    showLocationBadge: boolean;
    showNewBadge: boolean;
    matchPercentage?: number;
    isBookmarked: boolean;
    isBookmarkLoading?: boolean;
    toggleBookmark: (e: React.MouseEvent) => void;
    compact?: boolean;
}

export function CardImage({
    mainPhoto,
    fullName,
    initials,
    isAddressPrivate,
    city,
    province,
    formattedLocation,
    isRecent,
    showMatchBadge,
    showLocationBadge,
    showNewBadge,
    matchPercentage,
    isBookmarked,
    isBookmarkLoading = false, // Default to false
    toggleBookmark,
    compact = false,
}: CardImageProps) {
    // Set aspect ratio based on card type
    const aspectRatio = compact ? "aspect-[3/4]" : "aspect-[4/5]";
    const avatarSize = compact ? "h-16 w-16" : "h-24 w-24";
    const avatarTextSize = compact ? "text-xl" : "text-2xl";
    const nameSize = compact ? "text-sm" : "text-lg";
    const nameFontWeight = compact ? "font-medium" : "font-bold";

    // Only show match badge when we have a percentage
    const shouldShowMatchBadge =
        showMatchBadge && typeof matchPercentage === "number";

    return (
        <div className={`relative ${aspectRatio} overflow-hidden bg-muted`}>
            {/* Main image or avatar fallback */}
            {mainPhoto ? (
                <img
                    src={mainPhoto}
                    alt={fullName}
                    className="object-cover w-full h-full"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-primary/10 to-muted">
                    <Avatar className={avatarSize}>
                        <AvatarFallback className={avatarTextSize}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}

            {/* Badges overlay */}
            <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
                <div className="space-y-1">
                    {shouldShowMatchBadge && (
                        <MatchBadge
                            percentage={matchPercentage!}
                            compact={compact}
                        />
                    )}

                    {showLocationBadge &&
                        !isAddressPrivate &&
                        (city || province) && (
                            <LocationDisplay
                                isPrivate={isAddressPrivate}
                                city={city}
                                province={province}
                                formattedLocation={formattedLocation}
                                showAsBadge={true}
                            />
                        )}

                    {isAddressPrivate && (
                        <UIBadge
                            variant="outline"
                            className="bg-background/80 backdrop-blur-sm px-2 py-1 text-xs"
                        >
                            <Lock className="h-3 w-3 mr-1" />
                            {compact ? "Private" : "Private Address"}
                        </UIBadge>
                    )}

                    {showNewBadge && isRecent && (
                        <UIBadge
                            variant="default"
                            className="px-2 py-1 text-sm font-medium bg-green-500"
                        >
                            <Badge className="h-3 w-3 mr-1" />
                            New
                        </UIBadge>
                    )}
                </div>

                {/* Bookmark button */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleBookmark}
                    disabled={isBookmarkLoading}
                    className={`${
                        compact ? "h-6 w-6" : "h-8 w-8"
                    } rounded-full bg-background/80 backdrop-blur-sm`}
                >
                    {isBookmarkLoading ? (
                        // Show loading spinner
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : isBookmarked ? (
                        <BookmarkCheck
                            className={`${
                                compact ? "h-3 w-3" : "h-4 w-4"
                            } text-rose-500`}
                        />
                    ) : (
                        <Bookmark className={compact ? "h-3 w-3" : "h-4 w-4"} />
                    )}
                </Button>
            </div>

            {/* Match percentage circle */}
            {shouldShowMatchBadge && (
                <div
                    className={`absolute ${
                        compact ? "top-2 right-8" : "top-12 right-3"
                    } z-10`}
                >
                    <MatchCircle
                        percentage={matchPercentage!}
                        compact={compact}
                    />
                </div>
            )}

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h3 className={`${nameFontWeight} ${nameSize} leading-tight`}>
                    {fullName}
                </h3>
                <LocationDisplay
                    isPrivate={isAddressPrivate}
                    city={city}
                    province={province}
                    formattedLocation={formattedLocation}
                    compact={compact}
                    isOverImage={true}
                />
            </div>
        </div>
    );
}
