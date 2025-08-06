import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import {
    MapPin,
    Bookmark,
    BookmarkCheck,
    MoreHorizontal,
    Heart,
    MessageCircle,
    Share,
    ClockIcon,
    ChevronRight,
    Lock,
    CheckCircle2,
    AlertCircle,
    PercentIcon,
} from "lucide-react";
import {
    getMatchColorClass,
    getMatchQualityLabel,
} from "@/utils/matchingUtils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Progress } from "@/Components/ui/progress";

interface MaidCardProps {
    maid: any;
    showMatchBadge?: boolean;
    showLocationBadge?: boolean;
    showNewBadge?: boolean;
    featured?: boolean;
    compact?: boolean;
    useComputedMatch?: boolean;
    selectedJobId?: string | null;
}

export default function MaidCard({
    maid,
    showMatchBadge = false,
    showLocationBadge = false,
    showNewBadge = false,
    featured = false,
    compact = false,
    useComputedMatch = true,
    selectedJobId = null,
}: MaidCardProps) {
    // Early return if maid is undefined or null
    if (!maid) {
        return null;
    }

    const [isBookmarked, setIsBookmarked] = useState(false);

    // Extract maid data
    const fullName = maid.full_name || "";
    const userPhotos = maid.user?.photos || [];
    const avatar = maid.user?.avatar || null;

    // Get primary photo from user photos if available
    let mainPhoto = null;
    const primaryPhoto = userPhotos.find((photo: any) => photo.is_primary);

    // If no primary photo, just use the first one
    if (primaryPhoto) {
        mainPhoto = `/storage/${primaryPhoto.url}`;
    } else if (userPhotos.length > 0) {
        mainPhoto = `/storage/${userPhotos[0].url}`;
    } else if (avatar) {
        mainPhoto = `/storage/${avatar}`;
    }

    // Check if address is private by examining the profile directly
    const profile = maid.user?.profile || {};
    const isAddressPrivate = profile.is_address_private === true;

    // Get location components
    const address = profile.address || {};
    const city = address.city || null;
    const province = address.province || null;
    const barangay = address.barangay || null;
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
            // If we have a matches array, try to find the selected job
            const specificMatch = maid.matches.find(
                (match: any) => match.job_id?.toString() === selectedJobId
            );
            if (specificMatch) {
                matchInfo = specificMatch;
            }
        }
    }

    const matchPercentage = matchInfo?.match_percentage;
    const jobTitle = matchInfo?.job_title;
    const jobId = matchInfo?.job_id;

    // Always show match badge when a job is selected
    const shouldShowMatchBadge =
        showMatchBadge || (!!selectedJobId && !!matchPercentage);

    // Calculate initials for avatar fallback
    const initials = fullName
        ? fullName
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .toUpperCase()
              .substring(0, 2)
        : "MA";

    // Format location display based on privacy settings
    let locationDisplay;
    if (isAddressPrivate) {
        locationDisplay = (
            <>
                <Lock className="h-2.5 w-2.5 mr-0.5 flex-shrink-0" />
                <span>Address is private</span>
            </>
        );
    } else if (city || province) {
        locationDisplay = (
            <>
                <MapPin className="h-2.5 w-2.5 mr-0.5 flex-shrink-0" />
                <span className="truncate">{formattedLocation}</span>
            </>
        );
    } else {
        locationDisplay = (
            <>
                <MapPin className="h-2.5 w-2.5 mr-0.5 flex-shrink-0" />
                <span>Location not specified</span>
            </>
        );
    }

    // Get match color class and label based on percentage
    const matchColorClass = getMatchColorClass(matchPercentage || 0);
    const matchQualityLabel = getMatchQualityLabel(matchPercentage || 0);

    // Check if the maid was added recently (within 3 days)
    const isRecent =
        createdAt &&
        new Date(createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const toggleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsBookmarked(!isBookmarked);
        // Will call here an API to save the bookmark
    };

    // Generate a badge variant based on match percentage
    const getMatchBadgeVariant = (percentage: number) => {
        if (percentage >= 80) return "default";
        if (percentage >= 60) return "secondary";
        return "outline";
    };

    // If compact mode, render a simpler card
    if (compact) {
        return (
            <Card className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-sm hover:cursor-pointer">
                {/* Image section - shorter in compact mode */}
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    {mainPhoto ? (
                        <img
                            src={mainPhoto}
                            alt={fullName}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-primary/10 to-muted">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="text-xl">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}

                    {/* Badges overlay */}
                    <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
                        <div className="space-y-1">
                            {shouldShowMatchBadge && matchPercentage && (
                                <Badge
                                    className={`px-2 py-1 text-sm font-bold`}
                                    variant={getMatchBadgeVariant(
                                        matchPercentage
                                    )}
                                >
                                    <PercentIcon className="h-3 w-3 mr-1" />
                                    {matchPercentage}% Match
                                </Badge>
                            )}

                            {/* Add privacy badge if address is private */}
                            {isAddressPrivate && (
                                <Badge
                                    variant="outline"
                                    className="bg-background/80 backdrop-blur-sm px-2 py-1 text-[10px]"
                                >
                                    <Lock className="h-2 w-2 mr-1" />
                                    Private
                                </Badge>
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleBookmark}
                            className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm"
                        >
                            {isBookmarked ? (
                                <BookmarkCheck className="h-3 w-3 text-primary" />
                            ) : (
                                <Bookmark className="h-3 w-3" />
                            )}
                        </Button>
                    </div>

                    {/* Match percentage circle */}
                    {shouldShowMatchBadge && matchPercentage && (
                        <div className="absolute top-2 right-8 z-10">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center bg-white border-2 ${matchColorClass.replace(
                                    "text-",
                                    "border-"
                                )}`}
                            >
                                <div className="text-center">
                                    <div
                                        className={`text-lg font-bold ${matchColorClass}`}
                                    >
                                        {matchPercentage}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Bottom gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                        <h3 className="font-medium text-sm leading-tight">
                            {fullName}
                        </h3>
                        <div className="flex items-center text-white/90 text-xs">
                            {locationDisplay}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col p-2 text-xs flex-1">
                    {/* Agency info */}
                    {agencyName && (
                        <div className="text-xs text-muted-foreground mb-1">
                            <span className="font-medium">Agency:</span>{" "}
                            {agencyName}
                        </div>
                    )}

                    {/* Match info with score visualization */}
                    {matchPercentage ? (
                        <div className="space-y-1.5 mb-2">
                            <div className="text-xs flex items-center">
                                <span className="font-medium">Match:</span>{" "}
                                <span
                                    className={`${matchColorClass} font-bold ml-1 text-base`}
                                >
                                    {matchPercentage}%
                                </span>
                                <span className="ml-1">
                                    ({matchQualityLabel})
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Progress
                                    value={matchPercentage}
                                    className="h-2"
                                />
                            </div>
                            {jobTitle && (
                                <div className="text-xs truncate text-muted-foreground">
                                    for{" "}
                                    {jobTitle.length > 20
                                        ? `${jobTitle.substring(0, 20)}...`
                                        : jobTitle}
                                </div>
                            )}
                        </div>
                    ) : skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mb-1">
                            {skills.slice(0, 2).map((skill: string) => (
                                <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-[10px] px-1 py-0"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                    ) : null}

                    <Link
                        href={route("browse.maids.show", maid.id)}
                        className="mt-auto pt-1"
                    >
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full h-7 text-xs"
                        >
                            View <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                    </Link>
                </div>
            </Card>
        );
    }

    // Full location display for regular cards
    let fullLocationDisplay;
    if (isAddressPrivate) {
        fullLocationDisplay = (
            <div className="flex items-center text-white/90 text-sm">
                <Lock className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">Address is private</span>
            </div>
        );
    } else if (city || province) {
        fullLocationDisplay = (
            <div className="flex items-center text-white/90 text-sm">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{formattedLocation}</span>
            </div>
        );
    } else {
        fullLocationDisplay = (
            <div className="flex items-center text-white/90 text-sm">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">Location not specified</span>
            </div>
        );
    }

    // Original card design for featured sections
    return (
        <Card
            className={cn(
                "overflow-hidden h-full flex flex-col transition-all duration-200",
                featured ? "hover:shadow-lg hover:-translate-y-1" : ""
            )}
        >
            {/* Image section */}
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                {mainPhoto ? (
                    <img
                        src={mainPhoto}
                        alt={fullName}
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-primary/10 to-muted">
                        <Avatar className="h-24 w-24">
                            <AvatarFallback className="text-2xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                )}

                {/* Badges overlay */}
                <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start">
                    <div className="space-y-1">
                        {shouldShowMatchBadge && matchPercentage && (
                            <Badge
                                className={`px-2 py-1 text-sm font-medium `}
                                variant={getMatchBadgeVariant(matchPercentage)}
                            >
                                {matchPercentage >= 80 && (
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                )}
                                {matchPercentage >= 40 &&
                                    matchPercentage < 80 && (
                                        <PercentIcon className="h-3 w-3 mr-1" />
                                    )}
                                {matchPercentage < 40 && (
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                )}
                                {matchPercentage}% Match
                            </Badge>
                        )}

                        {showLocationBadge &&
                            !isAddressPrivate &&
                            (city || province) && (
                                <Badge
                                    variant="secondary"
                                    className="px-2 py-1 text-sm font-medium"
                                >
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {city || province}
                                </Badge>
                            )}

                        {/* Show privacy badge if address is private */}
                        {isAddressPrivate && (
                            <Badge
                                variant="outline"
                                className="bg-background/80 backdrop-blur-sm px-2 py-1 text-xs"
                            >
                                <Lock className="h-3 w-3 mr-1" />
                                Private Address
                            </Badge>
                        )}

                        {showNewBadge && isRecent && (
                            <Badge
                                variant="default"
                                className="px-2 py-1 text-sm font-medium bg-green-500"
                            >
                                New
                            </Badge>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleBookmark}
                        className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                    >
                        {isBookmarked ? (
                            <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                            <Bookmark className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Match percentage circle */}
                {shouldShowMatchBadge && matchPercentage && (
                    <div className="absolute top-12 right-3 z-10">
                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center bg-white border-2 ${matchColorClass.replace(
                                "text-",
                                "border-"
                            )}`}
                        >
                            <div className="text-center">
                                <div
                                    className={`text-xl font-bold ${matchColorClass}`}
                                >
                                    {matchPercentage}%
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom gradient overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="font-bold text-lg leading-tight">
                        {fullName}
                    </h3>
                    {fullLocationDisplay}
                </div>
            </div>

            <CardContent className="p-3 pt-3 flex-1">
                {/* Skills and Languages */}
                <div className="space-y-3">
                    {/* Agency */}
                    {agencyName && (
                        <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Agency:</span>{" "}
                            {agencyName}
                        </div>
                    )}

                    {/* Experience */}
                    {maid.years_experience && (
                        <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Experience:</span>{" "}
                            {maid.years_experience} years
                        </div>
                    )}

                    {/* Job Match with enhanced visualization */}
                    {matchPercentage && (
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium">Match:</span>{" "}
                                <span className={matchColorClass}>
                                    {matchQualityLabel}
                                </span>
                                {jobTitle && (
                                    <>
                                        {" for "}
                                        <Link
                                            href={`/employer/job-posts/${jobId}`}
                                            className="text-primary hover:underline"
                                        >
                                            {jobTitle}
                                        </Link>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress
                                    value={matchPercentage}
                                    className="h-2 flex-1"
                                />
                                <span
                                    className={`text-sm font-medium ${matchColorClass}`}
                                >
                                    {matchPercentage}%
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {skills.slice(0, 3).map((skill: string) => (
                                <Badge
                                    key={skill}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {skill}
                                </Badge>
                            ))}
                            {skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                    +{skills.length - 3}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-3 pt-0 flex justify-between items-center">
                <Link
                    href={route("browse.maids.show", maid.id)}
                    className="flex-1"
                >
                    <Button size="sm" className="w-full">
                        View Profile
                    </Button>
                </Link>

                {matchPercentage && jobId && (
                    <Link
                        href={route("browse.maids.match-details", {
                            maidId: maid.id,
                            jobId: jobId,
                        })}
                    >
                        <Button size="sm" variant="outline" className="ml-2">
                            Match Details
                        </Button>
                    </Link>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Heart className="mr-2 h-4 w-4" /> Add to Favorites
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <MessageCircle className="mr-2 h-4 w-4" /> Contact
                            Agency
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Share className="mr-2 h-4 w-4" /> Share Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <ClockIcon className="mr-2 h-4 w-4" /> View History
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    );
}
