import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    ArrowUp,
    ArrowDown,
    Eye,
    GripVertical,
    MoveVertical,
    User,
    Percent,
} from "lucide-react";
import { getInitials } from "@/utils/useGeneralUtils";
import axios from "axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    calculateMaidJobMatch,
    getMatchColorClass,
    MatchResult,
} from "@/utils/matchingUtils";

// Define interfaces for our data types
interface ApplicantMaid {
    id: number;
    user: {
        avatar?: string;
        profile: {
            first_name: string;
            last_name: string;
        };
    };

    experience_level: string;
    years_experience: number;
    status: string;
}

interface Application {
    id: number;
    maid: ApplicantMaid;
    ranking_position: number;
}

interface Applicant {
    application: Application;
    job_posting_id: number;
    job_title: string;
    agency_name?: string;
}

interface ApplicantWithMatch extends Applicant {
    matchScore: MatchResult | null;
}

interface ShortlistTableProps {
    jobId: number;
    jobTitle: string;
    applicants: Applicant[];
    onViewDetails: (maid: any, jobPosting?: any) => void;
    jobPosting: any;
}

export default function ShortlistTable({
    jobId,
    jobTitle,
    applicants,
    onViewDetails,
    jobPosting,
}: ShortlistTableProps) {
    console.log("Applicants:", applicants);
    const [isRanking, setIsRanking] = useState(false);
    const [localApplicants, setLocalApplicants] = useState<Applicant[]>([]);
    const [applicantsWithMatch, setApplicantsWithMatch] = useState<
        ApplicantWithMatch[]
    >([]);

    // Initialize applicants with match scores
    useEffect(() => {
        if (!applicants || applicants.length === 0) {
            setLocalApplicants([]);
            setApplicantsWithMatch([]);
            return;
        }

        const sortedApplicants = [...applicants].sort(
            (a, b) =>
                a.application.ranking_position - b.application.ranking_position
        );

        setLocalApplicants(sortedApplicants);

        // Calculate match scores for all applicants
        const withMatches = sortedApplicants.map((applicant) => {
            const matchScore = jobPosting
                ? calculateMaidJobMatch(applicant.application.maid, jobPosting)
                : null;

            return {
                ...applicant,
                matchScore,
            };
        });

        setApplicantsWithMatch(withMatches);
    }, [applicants, jobPosting]);

    // Start ranking mode
    const startRanking = () => {
        setIsRanking(true);
    };

    // Cancel ranking changes
    const cancelRanking = () => {
        const sortedApplicants = [...applicants].sort(
            (a, b) =>
                a.application.ranking_position - b.application.ranking_position
        );

        setLocalApplicants(sortedApplicants);

        // Recalculate match scores
        const withMatches = sortedApplicants.map((applicant) => {
            const matchScore = jobPosting
                ? calculateMaidJobMatch(applicant.application.maid, jobPosting)
                : null;

            return {
                ...applicant,
                matchScore,
            };
        });

        setApplicantsWithMatch(withMatches);
        setIsRanking(false);
    };

    // Save ranking changes
    const saveRanking = async () => {
        try {
            const rankings = applicantsWithMatch.map((app, index) => ({
                application_id: app.application.id,
                position: index + 1,
            }));

            await axios.post(route("employer.shortlist-ranking.update"), {
                job_id: jobId,
                rankings,
            });

            toast.success("Rankings updated successfully");
            setIsRanking(false);
        } catch (error) {
            console.error("Error updating rankings:", error);
            toast.error("Failed to update rankings. Please try again.");
        }
    };

    // Move an applicant up in ranking
    const moveUp = (index: number) => {
        if (index === 0) return;

        // Update both arrays to keep them in sync
        const newApplicants = [...applicantsWithMatch];
        [newApplicants[index - 1], newApplicants[index]] = [
            newApplicants[index],
            newApplicants[index - 1],
        ];

        setApplicantsWithMatch(newApplicants);
    };

    // Move an applicant down in ranking
    const moveDown = (index: number) => {
        if (index === applicantsWithMatch.length - 1) return;

        // Update both arrays to keep them in sync
        const newApplicants = [...applicantsWithMatch];
        [newApplicants[index], newApplicants[index + 1]] = [
            newApplicants[index + 1],
            newApplicants[index],
        ];

        setApplicantsWithMatch(newApplicants);
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{jobTitle}</CardTitle>
                        <Badge variant="outline">
                            {applicantsWithMatch.length} Shortlisted
                        </Badge>
                    </div>

                    {isRanking ? (
                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelRanking}
                            >
                                Cancel
                            </Button>
                            <Button size="sm" onClick={saveRanking}>
                                Save Rankings
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={startRanking}
                            className="flex items-center gap-1 self-end sm:self-auto"
                        >
                            <MoveVertical className="h-4 w-4" />
                            <span>Adjust Rankings</span>
                        </Button>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {/* Desktop view - Table */}
                <div className="hidden md:block border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Candidate</TableHead>
                                {jobPosting && (
                                    <TableHead className="w-24">
                                        Match
                                    </TableHead>
                                )}
                                <TableHead>Experience</TableHead>
                                <TableHead>Agency</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {applicantsWithMatch.map((applicant, index) => (
                                <TableRow
                                    key={applicant.application.id}
                                    className={cn(
                                        isRanking &&
                                            "hover:bg-accent/30 transition-colors"
                                    )}
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {isRanking && (
                                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                            )}
                                            <span>{index + 1}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage
                                                    src={
                                                        applicant.application
                                                            .maid.user.avatar
                                                            ? `/storage/${applicant.application.maid.user.avatar}`
                                                            : undefined
                                                    }
                                                    alt={`${applicant.application.maid.user.profile.first_name} ${applicant.application.maid.user.profile.last_name}`}
                                                />
                                                <AvatarFallback>
                                                    {getInitials(
                                                        `${applicant.application.maid.user.profile.first_name} ${applicant.application.maid.user.profile.last_name}`
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium">
                                                {`${applicant.application.maid.user.profile.first_name} ${applicant.application.maid.user.profile.last_name}`}
                                            </div>
                                        </div>
                                    </TableCell>

                                    {jobPosting && (
                                        <TableCell>
                                            {applicant.matchScore ? (
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-xs font-medium",
                                                        getMatchColorClass(
                                                            applicant.matchScore
                                                                .percentage
                                                        )
                                                    )}
                                                >
                                                    <Percent className="h-3 w-3 mr-1" />
                                                    {
                                                        applicant.matchScore
                                                            .percentage
                                                    }
                                                    %
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    No match
                                                </span>
                                            )}
                                        </TableCell>
                                    )}

                                    <TableCell>
                                        {applicant.application.maid
                                            .experience_level || "N/A"}
                                        {applicant.application.maid
                                            .years_experience > 0 && (
                                            <span className="text-muted-foreground">
                                                {" "}
                                                (
                                                {
                                                    applicant.application.maid
                                                        .years_experience
                                                }{" "}
                                                {applicant.application.maid
                                                    .years_experience === 1
                                                    ? "year"
                                                    : "years"}
                                                )
                                            </span>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {applicant.agency_name || "Independent"}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant={
                                                applicant.application.maid
                                                    .status === "available"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className="capitalize"
                                        >
                                            {applicant.application.maid.status}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {isRanking ? (
                                                <>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    disabled={
                                                                        index ===
                                                                        0
                                                                    }
                                                                    onClick={() =>
                                                                        moveUp(
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    <ArrowUp className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Move up</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    disabled={
                                                                        index ===
                                                                        applicantsWithMatch.length -
                                                                            1
                                                                    }
                                                                    onClick={() =>
                                                                        moveDown(
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    <ArrowDown className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Move down</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            onViewDetails(
                                                                applicant.application,
                                                                jobPosting
                                                            )
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile view - Card-based list */}
                <div className="md:hidden space-y-3">
                    {applicantsWithMatch.map((applicant, index) => (
                        <div
                            key={applicant.application.id}
                            className={cn(
                                "border rounded-lg p-3 relative",
                                isRanking && "bg-accent/5"
                            )}
                        >
                            {/* Rank number indicator */}
                            <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-primary text-primary-foreground font-medium text-xs flex items-center justify-center">
                                {index + 1}
                            </div>

                            <div className="flex justify-between items-start pt-1">
                                <div className="space-y-1.5">
                                    {/* Candidate name and match score */}
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-base leading-none">
                                            {`${applicant.application.maid.user.profile.first_name} ${applicant.application.maid.user.profile.last_name}`}
                                        </h3>
                                        {jobPosting && applicant.matchScore && (
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "text-xs",
                                                    getMatchColorClass(
                                                        applicant.matchScore
                                                            .percentage
                                                    )
                                                )}
                                            >
                                                <Percent className="h-3 w-3 mr-0.5" />
                                                {
                                                    applicant.matchScore
                                                        .percentage
                                                }
                                                %
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Experience and agency */}
                                    <div className="text-sm text-muted-foreground capitalize">
                                        {applicant.application.maid
                                            .experience_level || "N/A"}
                                        {applicant.application.maid
                                            .years_experience > 0 && (
                                            <span>
                                                (
                                                {
                                                    applicant.application.maid
                                                        .years_experience
                                                }{" "}
                                                {applicant.application.maid
                                                    .years_experience === 1
                                                    ? "year"
                                                    : "years"}
                                                )
                                            </span>
                                        )}
                                        {" • "}
                                        {applicant.agency_name || "Independent"}
                                    </div>

                                    {/* Status badge */}
                                    <Badge
                                        variant={
                                            applicant.application.maid
                                                .status === "available"
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="capitalize mt-1"
                                    >
                                        {applicant.application.maid.status}
                                    </Badge>
                                </div>

                                {/* Actions */}
                                <div className="flex">
                                    {isRanking ? (
                                        <div className="flex flex-col">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-1.5"
                                                disabled={index === 0}
                                                onClick={() => moveUp(index)}
                                            >
                                                <ArrowUp className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 px-1.5"
                                                disabled={
                                                    index ===
                                                    applicantsWithMatch.length -
                                                        1
                                                }
                                                onClick={() => moveDown(index)}
                                            >
                                                <ArrowDown className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8"
                                            onClick={() =>
                                                onViewDetails(
                                                    applicant.application,
                                                    jobPosting
                                                )
                                            }
                                        >
                                            <Eye className="h-3.5 w-3.5 mr-1" />
                                            View
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state for mobile */}
                {applicantsWithMatch.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                        <User className="mx-auto h-10 w-10 opacity-20 mb-2" />
                        <p>No shortlisted candidates yet</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
