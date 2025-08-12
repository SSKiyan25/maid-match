import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Bookmark,
    BookmarkCheck,
    MapPin,
    Languages,
    Briefcase,
    Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import MatchInfoCard from "./MatchInfoCard";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { useBookmark } from "../ForIndex/MaidCard/hooks/useBookmark";

interface SearchResultCardProps {
    maid: any;
    selectedJobId?: string | null;
}

export default function SearchResultCard({ maid }: SearchResultCardProps) {
    const [showMatchDetails, setShowMatchDetails] = useState(false);

    // Ensure maid.id is properly converted to a string
    const maidId = String(maid.id);

    // Use the existing bookmark hook with the correct ID format
    const {
        isBookmarked,
        isLoading: isBookmarkLoading,
        toggleBookmark,
    } = useBookmark(maidId);

    // Helper function to format skills
    const formatSkills = (skills: string[]) => {
        if (!skills || skills.length === 0) return "No skills listed";
        return skills.slice(0, 3).join(", ") + (skills.length > 3 ? "..." : "");
    };

    // Get user's initials for avatar fallback
    const getInitials = (name: string) => {
        if (!name) return "MA";
        return name
            .split(" ")
            .map((part) => part[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    // Get avatar URL
    const getAvatarUrl = (): string | undefined => {
        if (maid.user?.avatar) {
            return `/storage/${maid.user.avatar}`;
        }
        return undefined;
    };

    return (
        <div className="overflow-hidden hover:shadow-md transition-all duration-200 border rounded-lg">
            <div className="flex flex-col md:flex-row">
                {/* Left column - Photo and basic info */}
                <div className="md:w-2/5">
                    <div className="relative h-full bg-muted flex items-center justify-center">
                        {getAvatarUrl() ? (
                            <img
                                src={getAvatarUrl()}
                                alt={maid.full_name}
                                className="w-full h-48 object-cover object-center rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                                style={{
                                    minHeight: "12rem",
                                    maxHeight: "12rem",
                                }}
                            />
                        ) : (
                            <div className="w-full h-48 flex items-center justify-center">
                                <Avatar className="h-32 w-32">
                                    <AvatarImage
                                        src={getAvatarUrl()}
                                        alt={maid.full_name}
                                    />
                                    <AvatarFallback className="text-4xl">
                                        {getInitials(maid.full_name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                        <div className="absolute top-2 right-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleBookmark}
                                disabled={isBookmarkLoading}
                                className="bg-background/80 backdrop-blur-sm rounded-full hover:bg-white/90"
                            >
                                {isBookmarkLoading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                ) : isBookmarked ? (
                                    <BookmarkCheck className="h-5 w-5 text-rose-500 fill-rose-500" />
                                ) : (
                                    <Bookmark className="h-5 w-5 text-primary" />
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right column - Details */}
                <div className="md:w-3/5 p-4 flex flex-col">
                    {/* Header section */}
                    <div className="mb-3">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold">
                                {maid.full_name}
                            </h3>
                            {maid.rating && (
                                <div className="flex items-center text-amber-500">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="ml-1 text-sm font-medium">
                                        {maid.rating}
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {maid.agency_name || "Independent"}
                        </p>
                    </div>

                    {/* Key attributes */}
                    <div className="space-y-2 mb-4">
                        {maid.formatted_location && (
                            <div className="flex items-center text-xs">
                                <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                <span>{maid.formatted_location}</span>
                            </div>
                        )}
                        {maid.languages && maid.languages.length > 0 && (
                            <div className="flex items-center text-xs">
                                <Languages className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                <span>
                                    {maid.languages
                                        .slice(0, 2)
                                        .map(
                                            (lang: string) =>
                                                lang.charAt(0).toUpperCase() +
                                                lang.slice(1)
                                        )
                                        .join(", ")}
                                    {maid.languages.length > 2 && "..."}
                                </span>
                            </div>
                        )}
                        {maid.skills && maid.skills.length > 0 && (
                            <div className="flex items-start text-xs">
                                <Briefcase className="h-3.5 w-3.5 mr-2 text-muted-foreground mt-0.5" />
                                <span>{formatSkills(maid.skills)}</span>
                            </div>
                        )}
                    </div>

                    {/* Skills tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                        {maid.skills &&
                            maid.skills.slice(0, 4).map((skill: string) => (
                                <Badge
                                    key={skill}
                                    variant="secondary"
                                    className="text-xs py-0 px-2"
                                >
                                    {skill}
                                </Badge>
                            ))}
                    </div>

                    {/* Match percentage or view profile button */}
                    {!showMatchDetails &&
                        (maid.computed_match || maid.best_match) && (
                            <div className="mt-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowMatchDetails(true)}
                                    className={cn(
                                        "text-sm font-medium w-full border-primary/30",
                                        "bg-primary/5 hover:bg-primary/10 hover:border-primary/50"
                                    )}
                                >
                                    <span className="mr-2 font-bold">
                                        {Math.round(
                                            maid.computed_match
                                                ?.match_percentage ||
                                                maid.best_match
                                                    ?.match_percentage ||
                                                0
                                        )}
                                        %
                                    </span>
                                    Match - View Details
                                </Button>
                            </div>
                        )}

                    {/* Match details expanded view */}
                    {showMatchDetails && (
                        <div className="mt-auto">
                            <MatchInfoCard
                                maid={maid}
                                jobPosting={{
                                    id:
                                        maid.computed_match?.job_id ||
                                        maid.best_match?.job_id,
                                    title:
                                        maid.computed_match?.job_title ||
                                        maid.best_match?.job_title,
                                }}
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowMatchDetails(false)}
                                className="mt-2 w-full text-xs"
                            >
                                Hide Details
                            </Button>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mr-2"
                        >
                            Contact
                        </Button>
                        <Button size="sm" className="w-full" asChild>
                            <Link href={route("browse.maids.show", maid.id)}>
                                View Profile
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
