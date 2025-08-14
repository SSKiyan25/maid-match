import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import { CardImage } from "./CardImage";
import { CardActions } from "./CardActions";
import { MaidDisplayData } from "./types";
import {
    getMatchColorClass,
    getMatchQualityLabel,
} from "@/utils/matchingUtils";

interface CompactCardProps {
    maidData: MaidDisplayData;
    isBookmarked: boolean;
    isBookmarkLoading?: boolean;
    toggleBookmark: (e: React.MouseEvent) => void;
    showMatchBadge: boolean;
    showLocationBadge: boolean;
    showNewBadge: boolean;
    showBookmarked?: boolean;
    showMatchDetails?: boolean;
}

export function CompactCard({
    maidData,
    isBookmarked,
    isBookmarkLoading,
    toggleBookmark,
    showMatchBadge = false,
    showLocationBadge = false,
    showNewBadge = false,
    showBookmarked = false,
    showMatchDetails = false,
}: CompactCardProps) {
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

    const cardClasses = `overflow-hidden h-full flex flex-col transition-all ${
        showBookmarked && isBookmarked ? "ring-2 ring-primary/50" : ""
    }`;

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
                compact={true}
            />

            <div className="flex flex-col p-2 text-xs flex-1">
                {/* Agency info */}
                {agencyName && (
                    <div className="text-xs text-muted-foreground mb-1">
                        <span className="font-medium">Agency:</span>{" "}
                        {agencyName}
                    </div>
                )}

                {/* Match info with score visualization or skills */}
                {matchPercentage ? (
                    <div className="space-y-1.5 mb-2">
                        <div className="text-xs flex items-center">
                            <span className="font-medium">Match:</span>{" "}
                            <span
                                className={`${matchColorClass} font-bold ml-1 text-base`}
                            >
                                {matchPercentage}%
                            </span>
                            <span className="ml-1">({matchQualityLabel})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Progress value={matchPercentage} className="h-2" />
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

                <CardActions
                    maidId={id}
                    jobId={jobId}
                    matchPercentage={matchPercentage}
                    compact={true}
                    showMatchDetails={showMatchDetails}
                />
            </div>
        </Card>
    );
}
