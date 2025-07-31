import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { Link, router } from "@inertiajs/react";
import {
    Calendar,
    MapPin,
    Award,
    Check,
    ArrowUpRight,
    Building2,
    CheckCircle,
    XCircle,
    Percent,
    AlertCircle,
    ThumbsUp,
    ThumbsDown,
    Mail,
    Phone,
    CircleAlert,
} from "lucide-react";
import { getInitials } from "@/utils/useGeneralUtils";
import {
    calculateMaidJobMatch,
    getMatchColorClass,
    getMatchQualityLabel,
} from "@/utils/matchingUtils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Progress } from "@/Components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

interface MaidDetailsModalProps {
    maid: any;
    open: boolean;
    onClose: () => void;
    jobPosting?: any;
}

export default function MaidDetailsModal({
    maid,
    open,
    onClose,
    jobPosting,
}: MaidDetailsModalProps) {
    if (!maid) return null;

    const maidData = maid.maid;
    const userData = maidData.user;
    const agency = maidData.agency;

    // State for action confirmation dialogs
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<"hire" | "reject" | null>(
        null
    );
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate match score if we have a job posting
    const matchResult = jobPosting
        ? calculateMaidJobMatch(maidData, jobPosting)
        : null;
    const matchColorClass = matchResult
        ? getMatchColorClass(matchResult.percentage)
        : "";
    const matchQuality = matchResult
        ? getMatchQualityLabel(matchResult.percentage)
        : "";

    // Check if maid can be hired
    const canBeHired = maidData.status === "available";
    const isEmployed = maidData.status === "employed";

    // Skills and language matching helpers
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

    // Handle status change
    const handleStatusChange = async (status: "accepted" | "rejected") => {
        setIsSubmitting(true);
        try {
            const serverStatus = status === "accepted" ? "hired" : "rejected";

            await router.patch(
                route("employer.job-applications.update-status", maid.id),
                { status: serverStatus },
                {
                    onSuccess: () => {
                        toast.success(
                            status === "accepted"
                                ? "Candidate has been hired! They will be notified."
                                : "Application rejected. The candidate will be notified."
                        );

                        // Close both dialogs
                        setConfirmDialogOpen(false);
                        onClose();

                        // Refresh the page after a short delay
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    },
                    onError: (errors: any) => {
                        console.error(
                            "Error updating application status:",
                            errors
                        );
                        toast.error(
                            "Failed to update application status. Please try again."
                        );
                    },
                    onFinish: () => setIsSubmitting(false),
                    preserveScroll: true,
                }
            );
        } catch (error) {
            console.error("Error updating application status:", error);
            toast.error(
                "Failed to update application status. Please try again."
            );
            setIsSubmitting(false);
        }
    };

    const openConfirmDialog = (type: "hire" | "reject") => {
        setActionType(type);
        setConfirmDialogOpen(true);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Shortlisted Candidate Details</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Basic Info */}
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src={
                                        userData.avatar
                                            ? `/storage/${userData.avatar}`
                                            : undefined
                                    }
                                    alt={maidData.full_name}
                                />
                                <AvatarFallback className="text-lg">
                                    {getInitials(maidData.full_name)}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <h3 className="text-xl font-semibold">
                                    {maidData.full_name}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                        variant={
                                            maidData.status === "available"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {maidData.status}
                                    </Badge>
                                    {maidData.is_verified && (
                                        <Badge
                                            variant="accent"
                                            className="flex items-center gap-1"
                                        >
                                            <Check className="h-3 w-3" />
                                            Verified
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Match Score - Show only if we have job posting data */}
                        {matchResult && (
                            <div className="bg-muted rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-medium">Match Score</h4>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "font-medium",
                                            matchColorClass
                                        )}
                                    >
                                        <Percent className="h-3 w-3 mr-1" />
                                        {matchResult.percentage}% Match
                                    </Badge>
                                </div>

                                <Progress
                                    value={matchResult.percentage}
                                    className="h-2 mb-3"
                                />

                                <p className="text-sm text-muted-foreground mb-3">
                                    {matchQuality} for this position
                                </p>

                                <div className="space-y-2">
                                    {/* Match strengths */}
                                    {matchResult.matchStrengths.length > 0 && (
                                        <div className="space-y-1">
                                            <h5 className="text-xs font-medium flex items-center text-green-600">
                                                <ThumbsUp className="h-3 w-3 mr-1" />
                                                Strengths
                                            </h5>
                                            <ul className="text-xs space-y-1">
                                                {matchResult.matchStrengths
                                                    .slice(0, 3)
                                                    .map((strength, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start"
                                                        >
                                                            <span className="text-green-500 mr-1">
                                                                ✓
                                                            </span>
                                                            {strength}
                                                        </li>
                                                    ))}
                                                {matchResult.matchStrengths
                                                    .length > 3 && (
                                                    <li className="text-xs text-muted-foreground">
                                                        +
                                                        {matchResult
                                                            .matchStrengths
                                                            .length - 3}{" "}
                                                        more strengths
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Match weaknesses */}
                                    {matchResult.matchWeaknesses.length > 0 && (
                                        <div className="space-y-1">
                                            <h5 className="text-xs font-medium flex items-center text-amber-600">
                                                <ThumbsDown className="h-3 w-3 mr-1" />
                                                Areas of Concern
                                            </h5>
                                            <ul className="text-xs space-y-1">
                                                {matchResult.matchWeaknesses
                                                    .slice(0, 2)
                                                    .map((weakness, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex items-start"
                                                        >
                                                            <span className="text-amber-500 mr-1">
                                                                !
                                                            </span>
                                                            {weakness}
                                                        </li>
                                                    ))}
                                                {matchResult.matchWeaknesses
                                                    .length > 2 && (
                                                    <li className="text-xs text-muted-foreground">
                                                        +
                                                        {matchResult
                                                            .matchWeaknesses
                                                            .length - 2}{" "}
                                                        more concerns
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Contact Information */}
                        <div>
                            <h4 className="font-medium mb-2">
                                Contact Information
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{userData.email}</span>
                                </div>
                                {userData.profile?.phone_number && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {userData.profile.phone_number}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{maidData.nationality || "Unknown"}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                    {maidData.years_experience > 0
                                        ? `${maidData.years_experience} ${
                                              maidData.years_experience === 1
                                                  ? "year"
                                                  : "years"
                                          } exp.`
                                        : "New"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-muted-foreground" />
                                <span className="capitalize">
                                    {maidData.experience_level ||
                                        "Not specified"}
                                </span>
                            </div>

                            {userData.profile?.address &&
                                jobPosting?.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {userData.profile.address.city},{" "}
                                            {userData.profile.address.province}
                                            {userData.profile.address.city?.toLowerCase() ===
                                                jobPosting.location.city?.toLowerCase() &&
                                            userData.profile.address.province?.toLowerCase() ===
                                                jobPosting.location.province?.toLowerCase() ? (
                                                <span className="ml-2 text-green-600 font-semibold text-xs">
                                                    (Same Address)
                                                </span>
                                            ) : userData.profile.address.city?.toLowerCase() ===
                                              jobPosting.location.city?.toLowerCase() ? (
                                                <span className="ml-2 text-green-600 font-semibold text-xs">
                                                    (Same City)
                                                </span>
                                            ) : userData.profile.address.province?.toLowerCase() ===
                                              jobPosting.location.province?.toLowerCase() ? (
                                                <span className="ml-2 text-green-600 font-semibold text-xs">
                                                    (Same Province)
                                                </span>
                                            ) : null}
                                        </span>
                                    </div>
                                )}
                        </div>

                        <Separator />

                        {/* Bio */}
                        {maidData.bio && (
                            <div>
                                <h4 className="font-medium mb-2">About</h4>
                                <p className="text-sm text-muted-foreground">
                                    {maidData.bio}
                                </p>
                            </div>
                        )}

                        {/* Languages with match indicators */}
                        {maidData.languages?.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">Languages</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {maidData.languages.map(
                                        (language: string, index: number) => {
                                            const isMatched =
                                                isMatchingLanguage(language);
                                            return (
                                                <Badge
                                                    key={index}
                                                    variant={
                                                        isMatched
                                                            ? "default"
                                                            : "secondary"
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
                                        }
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Skills with match indicators */}
                        {maidData.skills?.length > 0 && (
                            <div>
                                <h4 className="font-medium mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {maidData.skills.map(
                                        (skill: string, index: number) => {
                                            const isMatched =
                                                isMatchingSkill(skill);
                                            return (
                                                <Badge
                                                    key={index}
                                                    variant={
                                                        isMatched
                                                            ? "default"
                                                            : "outline"
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
                                                    {skill}
                                                </Badge>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Agency */}
                        {agency && (
                            <div>
                                <h4 className="font-medium mb-2">Agency</h4>
                                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                    <Avatar>
                                        <AvatarImage
                                            src={
                                                agency.user?.avatar
                                                    ? `/storage/${agency.user.avatar}`
                                                    : undefined
                                            }
                                            alt={agency.name}
                                        />
                                        <AvatarFallback>
                                            {getInitials(agency.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {agency.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {agency.address?.city},{" "}
                                            {agency.address?.province}
                                        </div>
                                        {agency.website && (
                                            <div className="text-xs mt-1">
                                                <a
                                                    href={agency.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline text-blue-600"
                                                >
                                                    {agency.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={route(
                                                "browse.agencies.show",
                                                agency.id
                                            )}
                                        >
                                            <Building2 className="h-4 w-4 mr-1" />
                                            View
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Application Details */}
                        <div>
                            <h4 className="font-medium mb-2">
                                Application Details
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Applied on:
                                    </span>
                                    <span className="font-medium">
                                        {format(
                                            new Date(maid.created_at),
                                            "MMM d, yyyy"
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Shortlisted on:
                                    </span>
                                    <span className="font-medium">
                                        {format(
                                            new Date(maid.updated_at),
                                            "MMM d, yyyy"
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Ranking:
                                    </span>
                                    <span className="font-medium">
                                        #{maid.ranking_position || "Unranked"}
                                    </span>
                                </div>

                                {maid.proposed_salary && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">
                                            Proposed Salary:
                                        </span>
                                        <span className="font-medium">
                                            ₱
                                            {parseFloat(
                                                maid.proposed_salary
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* View Full Profile Alert */}
                        <Alert variant="default" className="">
                            <CircleAlert className="h-4 w-4" />
                            <AlertTitle>More Information Available</AlertTitle>
                            <AlertDescription className="text-sm">
                                You can view {maidData.full_name}'s full
                                profile, documents, and social media links on
                                their profile page.
                            </AlertDescription>
                        </Alert>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        {isEmployed ? (
                            <div className="w-full bg-amber-50 text-amber-700 p-3 rounded-md text-sm flex items-start mb-2">
                                <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                                <p>
                                    This candidate is already employed and
                                    cannot be hired at this time.
                                </p>
                            </div>
                        ) : (
                            <div className="w-full grid grid-cols-2 gap-2 mb-2">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => openConfirmDialog("reject")}
                                >
                                    <XCircle className="h-4 w-4 mr-1.5" />
                                    Reject
                                </Button>
                                <Button
                                    className="w-full"
                                    disabled={!canBeHired}
                                    onClick={() => openConfirmDialog("hire")}
                                >
                                    <CheckCircle className="h-4 w-4 mr-1.5" />
                                    Hire
                                </Button>
                            </div>
                        )}

                        <div className="flex w-full gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={onClose}
                            >
                                Close
                            </Button>

                            <Button
                                className="flex-1 flex items-center gap-1"
                                variant="secondary"
                                asChild
                            >
                                <Link
                                    href={route(
                                        "browse.maids.show",
                                        maidData.id
                                    )}
                                    target="_blank"
                                >
                                    <span>View Full Profile</span>
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <AlertDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {actionType === "hire"
                                ? "Hire this candidate?"
                                : "Reject this application?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {actionType === "hire"
                                ? `You're about to hire ${maidData.full_name}. This will mark the job as filled and notify the candidate.`
                                : `You're about to reject ${maidData.full_name}'s application. The candidate will be notified.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                handleStatusChange(
                                    actionType === "hire"
                                        ? "accepted"
                                        : "rejected"
                                )
                            }
                            disabled={isSubmitting}
                            className={
                                actionType === "hire"
                                    ? "bg-primary"
                                    : "bg-destructive"
                            }
                        >
                            {isSubmitting
                                ? "Processing..."
                                : actionType === "hire"
                                ? "Confirm Hire"
                                : "Confirm Rejection"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
