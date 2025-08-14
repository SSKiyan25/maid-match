import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { Link } from "@inertiajs/react";
import { CardImage } from "./CardImage";
import { CardActions } from "./CardActions";
import { MaidDisplayData } from "./types";
import {
    getMatchColorClass,
    getMatchQualityLabel,
} from "@/utils/matchingUtils";
import { cn } from "@/lib/utils";

interface RegularCardProps {
    maidData: MaidDisplayData;
    isBookmarked: boolean;
    toggleBookmark: (e: React.MouseEvent) => void;
    showMatchBadge: boolean;
    isBookmarkLoading?: boolean;
    showLocationBadge: boolean;
    showNewBadge: boolean;
    featured?: boolean;
    showBookmarked?: boolean;
    showMatchDetails?: boolean;
}

export function RegularCard({
    maidData,
    isBookmarked,
    isBookmarkLoading,
    toggleBookmark,
    showMatchBadge,
    showLocationBadge,
    showNewBadge,
    featured = false,
    showBookmarked = false,
    showMatchDetails = false,
}: RegularCardProps) {
    const {
        id,
        fullName,
        mainPhoto,
        initials,
        isAddressPrivate,
        formattedLocation,
        city,
        province,
        skills,
        agencyName,
        matchInfo,
        isRecent,
        years_experience,
    } = maidData;

    const matchPercentage = matchInfo?.match_percentage;
    const jobTitle = matchInfo?.job_title;
    const jobId = matchInfo?.job_id;

    // Get match styling if we have match data
    const matchColorClass = matchPercentage
        ? getMatchColorClass(matchPercentage)
        : "";
    const matchQualityLabel = matchPercentage
        ? getMatchQualityLabel(matchPercentage)
        : "";

    const cardClasses = cn(
        "overflow-hidden h-full flex flex-col transition-all duration-200",
        featured ? "hover:shadow-lg hover:-translate-y-1" : "",
        showBookmarked && isBookmarked ? "ring-2 ring-primary/50" : ""
    );

    return (
        <Card className={cardClasses}>
            <CardImage
                mainPhoto={mainPhoto}
                fullName={fullName}
                initials={initials}
                isAddressPrivate={isAddressPrivate}
                city={city}
                province={province}
                formattedLocation={formattedLocation}
                isRecent={isRecent}
                showMatchBadge={showMatchBadge}
                showLocationBadge={showLocationBadge}
                showNewBadge={showNewBadge}
                matchPercentage={matchPercentage}
                isBookmarked={isBookmarked}
                isBookmarkLoading={isBookmarkLoading}
                toggleBookmark={toggleBookmark}
            />

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
                    {years_experience && (
                        <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Experience:</span>{" "}
                            {years_experience} years
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

            <CardFooter className="p-3 pt-0">
                <CardActions
                    maidId={id}
                    jobId={jobId}
                    matchPercentage={matchPercentage}
                    showMatchDetails={showMatchDetails}
                />
            </CardFooter>
        </Card>
    );
}
