import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { getInitials } from "@/utils/useGeneralUtils";
import {
    calculateMaidJobMatch,
    getMatchColorClass,
    getMatchQualityLabel,
} from "@/utils/matchingUtils";
import { Briefcase, MapPin, Building2, Eye, Percent } from "lucide-react";
import ApplicantDetailsDialog from "./ApplicantDetailsDialog";

export default function ApplicantCard({ applicant, jobPostings }: any) {
    const [showDetails, setShowDetails] = useState(false);

    const { application, job_title, job_posting_id } = applicant;
    const { maid, status, applied_at } = application;
    const { user, skills, languages, years_experience } = maid;
    const { profile } = user;

    // Get the full job posting data for match calculation
    const jobPosting = jobPostings?.find(
        (job: any) => job.id === job_posting_id
    );

    // Calculate match score if we have the job posting data
    const matchScore = jobPosting
        ? calculateMaidJobMatch(maid, jobPosting)
        : null;
    const matchPercentage = matchScore?.percentage || 0;
    const matchColorClass = getMatchColorClass(matchPercentage);
    const matchQualityLabel = getMatchQualityLabel(matchPercentage);

    const getStatusColor = (status: any) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "shortlisted":
                return "bg-blue-100 text-blue-800";
            case "interviewed":
                return "bg-purple-100 text-purple-800";
            case "hired":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <>
            <Card className="overflow-hidden h-full">
                <CardContent className="p-0">
                    {/* Header */}
                    <div className="p-3 border-b flex items-start gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage
                                src={
                                    user.avatar
                                        ? `/storage/${user.avatar}`
                                        : undefined
                                }
                                alt={`${profile.first_name} ${profile.last_name}`}
                            />
                            <AvatarFallback>
                                {getInitials(
                                    `${profile.first_name} ${profile.last_name}`
                                )}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-1">
                                <h3 className="font-medium text-sm truncate">
                                    {profile.first_name} {profile.last_name}
                                </h3>
                                <Badge
                                    className={`text-xs capitalize ${getStatusColor(
                                        status
                                    )}`}
                                    variant="outline"
                                >
                                    {status}
                                </Badge>
                            </div>

                            <p className="text-xs text-muted-foreground mt-0.5">
                                Applied{" "}
                                {formatDistanceToNow(new Date(applied_at), {
                                    addSuffix: true,
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Match score - display above other details */}
                    {matchScore && (
                        <div
                            className={`px-3 pt-3 pb-1 flex items-center gap-1.5 ${matchColorClass}`}
                        >
                            <Percent className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="text-xs font-semibold">
                                {matchPercentage}% - {matchQualityLabel}
                            </span>
                        </div>
                    )}

                    {/* Body */}
                    <div className="p-3 pt-1">
                        {/* Experience */}
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                            <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>
                                {years_experience || 0}{" "}
                                {years_experience === 1 ? "year" : "years"}{" "}
                                experience
                            </span>
                        </div>

                        {/* Agency */}
                        {applicant.agency_id && applicant.agency_name && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                                <span>{applicant.agency_name}</span>
                            </div>
                        )}

                        {/* Location if available */}
                        {profile.address && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">
                                    {profile.address.city},{" "}
                                    {profile.address.province}
                                </span>
                            </div>
                        )}

                        {/* Skills */}
                        <div className="flex flex-wrap gap-1 mt-3 mb-3">
                            {skills
                                ?.slice(0, 3)
                                .map((skill: any, index: any) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs font-normal"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            {skills?.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                    +{skills.length - 3} more
                                </span>
                            )}
                        </div>

                        {/* View Details Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-1 text-xs h-8"
                            onClick={() => setShowDetails(true)}
                        >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            View & Take Action
                        </Button>
                        <span className="block text-[9px] text-muted-foreground mt-1 text-center">
                            You can review, shortlist, reject, or hire from the
                            clicking the button above.
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Details Dialog */}
            {showDetails && (
                <ApplicantDetailsDialog
                    applicant={applicant}
                    matchScore={{
                        ...matchScore,
                        jobPosting: jobPosting,
                    }}
                    open={showDetails}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    );
}
