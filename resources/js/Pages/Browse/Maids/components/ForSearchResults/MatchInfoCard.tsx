import { Progress } from "@/Components/ui/progress";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { ThumbsUp, ThumbsDown, ArrowUpRight, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import {
    getMatchColorClass,
    getMatchQualityLabel,
} from "@/utils/matchingUtils";

interface MatchInfoCardProps {
    maid: any;
    jobPosting: any;
    showJobDetails?: boolean;
}

export default function MatchInfoCard({
    maid,
    jobPosting,
    showJobDetails = true,
}: MatchInfoCardProps) {
    console.log("MatchInfoCard Props:", { maid, jobPosting });
    const matchData = maid.computed_match || maid.best_match;
    if (!matchData) return null;

    const matchPercentage = matchData.match_percentage;
    const matchColorClass = getMatchColorClass(matchPercentage);
    const matchQualityLabel = getMatchQualityLabel(matchPercentage);
    console.log("Match Data:", matchData);
    // Extract strengths and weaknesses if available
    const strengths = maid.match_details?.strengths || [];
    const weaknesses = maid.match_details?.weaknesses || [];

    return (
        <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex flex-col space-y-4">
                {/* Match percentage header */}
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Match Score
                    </h3>
                    <div className="flex items-center">
                        <span
                            className={cn(
                                "text-lg font-bold mr-2",
                                matchColorClass
                            )}
                        >
                            {matchPercentage}%
                        </span>
                        <Badge
                            variant="secondary"
                            className={cn(
                                "bg-primary/10 text-primary border-none",
                                matchPercentage >= 80 &&
                                    "bg-primary/10 text-primary",
                                matchPercentage < 60 &&
                                    "bg-amber-100 text-amber-800",
                                matchPercentage < 40 &&
                                    "bg-slate-100 text-slate-800"
                            )}
                        >
                            {matchQualityLabel}
                        </Badge>
                    </div>
                </div>

                {/* Progress bar */}
                <Progress
                    value={matchPercentage}
                    className={cn(
                        "h-2",
                        matchPercentage >= 80 && "bg-primary/20",
                        matchPercentage < 60 && "bg-amber-100",
                        matchPercentage < 40 && "bg-slate-100"
                    )}
                />

                {/* Job details */}
                {showJobDetails && (
                    <div className="rounded-md bg-muted/50 p-3">
                        <div className="flex items-center mb-2">
                            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                            <h4 className="text-sm font-medium">
                                {matchData.job_title || "Job Posting"}
                            </h4>
                        </div>
                        <Link
                            href={route("browse.maids.match-details", {
                                maidId: maid.id,
                                jobId: matchData.job_id,
                            })}
                            className="text-xs text-primary flex items-center"
                        >
                            View detailed match analysis
                            <ArrowUpRight className="h-3 w-3 ml-1" />
                        </Link>
                    </div>
                )}

                {/* Match strengths and weaknesses */}
                {(strengths.length > 0 || weaknesses.length > 0) && (
                    <div className="space-y-3">
                        {strengths.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-1">
                                    Strengths
                                </h4>
                                <ul className="space-y-1">
                                    {strengths
                                        .slice(0, 2)
                                        .map((strength: any, i: number) => (
                                            <li
                                                key={i}
                                                className="text-xs flex items-start"
                                            >
                                                <ThumbsUp className="h-3 w-3 mr-1 text-green-600 mt-0.5" />
                                                <span>{strength}</span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}

                        {weaknesses.length > 0 && (
                            <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-1">
                                    Considerations
                                </h4>
                                <ul className="space-y-1">
                                    {weaknesses
                                        .slice(0, 2)
                                        .map((weakness: any, i: number) => (
                                            <li
                                                key={i}
                                                className="text-xs flex items-start"
                                            >
                                                <ThumbsDown className="h-3 w-3 mr-1 text-amber-600 mt-0.5" />
                                                <span>{weakness}</span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* View details button */}
                <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link
                        href={route("browse.maids.match-details", {
                            maidId: maid.id,
                            jobId: matchData.job_id,
                        })}
                    >
                        View Full Match Details
                    </Link>
                </Button>
            </div>
        </div>
    );
}
