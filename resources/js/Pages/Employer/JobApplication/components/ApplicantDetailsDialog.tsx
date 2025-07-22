import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { format } from "date-fns";
import { getInitials } from "@/utils/useGeneralUtils";
import {
    Briefcase,
    Percent,
    Globe,
    MapPin,
    Mail,
    Phone,
    Check,
    CircleAlert,
} from "lucide-react";
import { getMatchColorClass } from "@/utils/matchingUtils";
import { Link } from "@inertiajs/react";
import ApplicantStatusActions from "./ApplicantStatusActions";

export default function ApplicantDetailsDialog({
    applicant,
    open,
    onClose,
    matchScore,
    onStatusChange,
}: any) {
    const { application, job_title } = applicant;
    const {
        id: applicationId,
        maid,
        status,
        applied_at,
        description,
    } = application;
    const { user, skills, languages, nationality, years_experience } = maid;
    const { profile } = user;
    const jobPosting = matchScore?.jobPosting;

    const isMatchingSkill = (skill: string) => {
        if (!jobPosting?.work_types) return false;

        // Convert job work types to normalized skills for comparison
        const jobSkills = jobPosting.work_types.map((type: string) =>
            type.toLowerCase().replace("_", " ")
        );

        return jobSkills.some(
            (jobSkill: string) =>
                jobSkill.includes(skill.toLowerCase()) ||
                skill.toLowerCase().includes(jobSkill)
        );
    };

    const isMatchingLanguage = (language: string) => {
        if (!jobPosting?.language_preferences) return false;

        return jobPosting.language_preferences.some(
            (jobLang: string) =>
                jobLang.toLowerCase() === language.toLowerCase()
        );
    };

    // Get status badge variant
    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "pending":
                return "secondary";
            case "shortlisted":
                return "blue";
            case "hired":
                return "success";
            case "rejected":
                return "destructive";
            case "withdrawn":
                return "outline";
            default:
                return "secondary";
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        Applicant Details
                    </DialogTitle>
                </DialogHeader>

                {/* Header with basic info */}
                <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage
                            src={
                                user.avatar
                                    ? `/storage/${user.avatar}`
                                    : undefined
                            }
                            alt={`${profile.first_name} ${profile.last_name}`}
                        />
                        <AvatarFallback className="text-lg">
                            {getInitials(
                                `${profile.first_name} ${profile.last_name}`
                            )}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <h2 className="text-xl font-semibold">
                            {profile.first_name} {profile.last_name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Applied for{" "}
                            <span className="font-medium">{job_title}</span>
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                            <Badge variant="default" className="capitalize">
                                {status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(applied_at), "MMM d, yyyy")}
                            </span>
                        </div>
                    </div>
                </div>

                <Separator />

                {matchScore && (
                    <div>
                        <h3 className="text-sm font-medium mb-2">
                            Match Details
                        </h3>
                        <div
                            className={`flex items-center gap-2 text-sm ${getMatchColorClass(
                                matchScore.percentage
                            )}`}
                        >
                            <Percent className="h-4 w-4" />
                            <span className="font-semibold">
                                {matchScore.percentage}% match
                            </span>
                        </div>

                        {/* Match strengths */}
                        {matchScore.matchStrengths.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs font-medium text-green-600 mb-1">
                                    Strengths:
                                </p>
                                <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                                    {matchScore.matchStrengths.map(
                                        (strength: any, i: number) => (
                                            <li key={i}>{strength}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                        {/* Match weaknesses */}
                        {matchScore.matchWeaknesses.length > 0 && (
                            <div className="mt-2">
                                <p className="text-xs font-medium text-red-600 mb-1">
                                    Areas for consideration:
                                </p>
                                <ul className="text-xs space-y-1 list-disc list-inside text-muted-foreground">
                                    {matchScore.matchWeaknesses.map(
                                        (weakness: any, i: number) => (
                                            <li key={i}>{weakness}</li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <Separator />

                {/* Contact Info */}
                <div>
                    <h3 className="text-sm font-medium mb-2">
                        Contact Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{user.email}</span>
                        </div>
                        {profile.phone_number && (
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{profile.phone_number}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Basic details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Agency */}
                    {applicant.agency_id && applicant.agency_name && (
                        <div>
                            <h3 className="text-sm font-medium mb-2">Agency</h3>
                            <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 text-sm">
                                <Badge variant="secondary">
                                    {applicant.agency_name}
                                </Badge>
                                <Link
                                    href={route(
                                        "browse.agencies.show",
                                        applicant.agency_id
                                    )}
                                    className="ml-2 sm:ml-0"
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                    >
                                        View Agency
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    )}
                    <div>
                        <h3 className="text-sm font-medium mb-2">Experience</h3>
                        <div className="flex items-center gap-2 text-sm">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {years_experience || 0}{" "}
                                {years_experience === 1 ? "year" : "years"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2">
                            Nationality
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span>{nationality}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium mb-2">Languages</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {languages?.map((language: any, index: any) => {
                                const isMatched = isMatchingLanguage(language);
                                return (
                                    <Badge
                                        key={index}
                                        variant={
                                            isMatched ? "default" : "secondary"
                                        }
                                        className={
                                            isMatched
                                                ? "flex items-center gap-1"
                                                : ""
                                        }
                                    >
                                        {isMatched && (
                                            <Check className="h-3 w-3" />
                                        )}
                                        {language}
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>

                    {profile.address && jobPosting?.location && (
                        <div>
                            <h3 className="text-sm font-medium mb-2">
                                Location
                            </h3>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {profile.address.city},{" "}
                                    {profile.address.province}
                                    {/* Matching logic */}
                                    {profile.address.city?.toLowerCase() ===
                                        jobPosting.location.city?.toLowerCase() &&
                                    profile.address.province?.toLowerCase() ===
                                        jobPosting.location.province?.toLowerCase() ? (
                                        <span className="ml-2 text-green-600 font-semibold text-xs">
                                            (Same Address)
                                        </span>
                                    ) : profile.address.city?.toLowerCase() ===
                                      jobPosting.location.city?.toLowerCase() ? (
                                        <span className="ml-2 text-green-600 font-semibold text-xs">
                                            (Same City)
                                        </span>
                                    ) : profile.address.province?.toLowerCase() ===
                                      jobPosting.location.province?.toLowerCase() ? (
                                        <span className="ml-2 text-green-600 font-semibold text-xs">
                                            (Same Province)
                                        </span>
                                    ) : null}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Skills */}
                <div>
                    <h3 className="text-sm font-medium mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {skills?.map((skill: any, index: any) => {
                            const isMatched = isMatchingSkill(skill);
                            return (
                                <Badge
                                    key={index}
                                    variant={
                                        isMatched ? "default" : "secondary"
                                    }
                                    className={
                                        isMatched
                                            ? "flex items-center gap-1"
                                            : ""
                                    }
                                >
                                    {isMatched && <Check className="h-3 w-3" />}
                                    {skill}
                                </Badge>
                            );
                        })}
                        {!skills?.length && (
                            <span className="text-sm text-muted-foreground">
                                No skills listed
                            </span>
                        )}
                    </div>
                </div>

                {/* Application Note */}
                {description && (
                    <div>
                        <h3 className="text-sm font-medium mb-2">
                            Application Note
                        </h3>
                        <p className="text-sm">{description}</p>
                    </div>
                )}

                <div>
                    <Alert variant="default" className="mt-2 mb-4">
                        <CircleAlert className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription className="text-xs text-muted-foreground">
                            You can view this maid's documents and full profile
                            by clicking the button "Learn More" below.
                        </AlertDescription>
                    </Alert>
                    <Link href={route("browse.maids.show", maid.id)}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                        >
                            Learn more about this Maid
                        </Button>
                    </Link>
                </div>

                <DialogFooter className="sm:justify-between">
                    <ApplicantStatusActions
                        applicationId={applicationId}
                        currentStatus={status}
                        onStatusChange={onStatusChange}
                        onClose={onClose}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
