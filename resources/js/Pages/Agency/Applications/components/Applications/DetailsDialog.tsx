import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { format } from "date-fns";
import {
    Briefcase,
    Calendar,
    MapPin,
    Building2,
    Phone,
    Info,
    Mail,
    PhilippinePeso,
    User,
    Clock,
    ExternalLink,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    getInitials,
    getStatusVariant,
    getMaidStatusLabel,
    getMaidStatusVariant,
} from "@/utils/useGeneralUtils";
import { Link } from "@inertiajs/react";

interface ApplicationDetailsDialogProps {
    application: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ApplicationDetailsDialog({
    application,
    open,
    onOpenChange,
}: ApplicationDetailsDialogProps) {
    const { maid, job_posting, status, status_label, applied_at, description } =
        application;
    const { user } = maid;
    const profile = user?.profile || {};

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Application Details</DialogTitle>
                </DialogHeader>

                {/* Application overview */}
                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage
                                src={
                                    user?.avatar
                                        ? `/storage/${user.avatar}`
                                        : undefined
                                }
                                alt={`${profile.first_name || ""} ${
                                    profile.last_name || ""
                                }`}
                            />
                            <AvatarFallback>
                                {getInitials(
                                    `${profile.first_name || ""} ${
                                        profile.last_name || ""
                                    }`
                                )}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg">
                                {profile.first_name} {profile.last_name}
                            </h3>
                            <div className="flex flex-col gap-1 mt-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        Application:
                                    </span>
                                    <Badge variant={getStatusVariant(status)}>
                                        {status_label}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        Maid Status:
                                    </span>
                                    <Badge
                                        variant={getMaidStatusVariant(
                                            maid.status
                                        )}
                                    >
                                        {getMaidStatusLabel(maid.status)}
                                    </Badge>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span>
                                                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-[300px]">
                                                <div className="space-y-2 p-1">
                                                    <p className="font-semibold">
                                                        Status Information
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Application Status:
                                                        </strong>{" "}
                                                        Shows the status of this
                                                        specific job
                                                        application.
                                                    </p>
                                                    <p>
                                                        <strong>
                                                            Maid Status:
                                                        </strong>{" "}
                                                        Shows the overall
                                                        employment status of the
                                                        maid in the system.
                                                    </p>
                                                    <div className="mt-2 pt-2 border-t border-border">
                                                        <p className="text-xs text-muted">
                                                            If a maid is hired,
                                                            their status will
                                                            change to "Employed"
                                                            and other
                                                            applications may be
                                                            automatically
                                                            cancelled.
                                                        </p>
                                                    </div>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    Applied{" "}
                                    {format(
                                        new Date(applied_at),
                                        "MMM d, yyyy"
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job details */}
                <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">
                            {job_posting?.title || "Untitled Job"}
                        </h3>
                    </div>

                    <div className="text-sm">
                        {/* Employer & Job Posting Info */}
                        <div className="flex flex-col sm:flex-row justify-between space-y-4">
                            {/* Employer Info */}
                            <div className="flex items-start gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Employer
                                    </p>
                                    <span>
                                        {job_posting?.employer?.user?.full_name}
                                    </span>
                                    {/* Employer Contact Info */}
                                    {job_posting?.employer?.user?.email && (
                                        <div className="flex items-center gap-2 mt-1 text-xs">
                                            <Mail className="h-3 w-3 text-muted-foreground" />
                                            <span>
                                                {
                                                    job_posting.employer.user
                                                        .email
                                                }
                                            </span>
                                        </div>
                                    )}
                                    {job_posting?.employer?.user?.profile
                                        ?.phone_number && (
                                        <div className="flex items-center gap-2 mt-1 text-xs">
                                            <Phone className="h-3 w-3 text-muted-foreground" />
                                            <span>
                                                {
                                                    job_posting.employer.user
                                                        .profile.phone_number
                                                }
                                            </span>
                                        </div>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2"
                                        asChild
                                    >
                                        <Link
                                            href={route(
                                                "browse.employers.show",
                                                job_posting.employer.id
                                            )}
                                            target="_blank"
                                            className="inline-flex items-center"
                                        >
                                            <ExternalLink className="h-4 w-4 mr-1.5" />
                                            More About Employer
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            {/* Job Posting Info */}
                            <div className="flex items-start gap-2">
                                <Briefcase className="h-4 w-4 text-primary mt-0.5" />
                                <div>
                                    <p className="text-muted-foreground text-xs">
                                        Job Posting
                                    </p>
                                    {job_posting?.location && (
                                        <div className="flex items-center gap-2 mt-1 text-xs">
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            <span>
                                                {job_posting.location.city},{" "}
                                                {job_posting.location.province}
                                            </span>
                                        </div>
                                    )}
                                    {job_posting?.min_salary &&
                                    job_posting?.max_salary ? (
                                        <div className="flex items-center gap-2 mt-1 text-xs">
                                            <PhilippinePeso className="h-3 w-3 text-muted-foreground" />
                                            <span>
                                                {`${Number(
                                                    job_posting.min_salary
                                                ).toLocaleString()} - ${Number(
                                                    job_posting.max_salary
                                                ).toLocaleString()} (PHP)`}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 mt-1 text-xs">
                                            <PhilippinePeso className="h-3 w-3 text-muted-foreground" />
                                            <span>Salary undisclosed</span>
                                        </div>
                                    )}
                                    {job_posting?.accomodation_type && (
                                        <div className="flex items-center gap-2 mt-1 text-xs">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            <span>
                                                {job_posting.accomodation_type}
                                            </span>
                                        </div>
                                    )}

                                    <Link
                                        href={route(
                                            "browse.job-applications.show",
                                            job_posting.id
                                        )}
                                        target="_blank"
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-background hover:bg-accent text-sm mt-2"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-1.5" />
                                        View Job Post
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Application note */}
                {description && (
                    <div>
                        <h3 className="text-sm font-medium mb-2">
                            Application Note
                        </h3>
                        <p className="text-sm">{description}</p>
                    </div>
                )}

                {/* Maid contact info */}
                <div>
                    <h3 className="text-sm font-medium mb-2">
                        Contact Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {user?.email && (
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>
                        )}
                        {profile.phone_number && (
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{profile.phone_number}</span>
                            </div>
                        )}
                    </div>
                </div>

                <Separator />

                <div className="flex justify-between">
                    <Link
                        href={route("browse.maids.show", maid.id)}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-background hover:bg-accent text-sm"
                    >
                        <User className="h-4 w-4 mr-1.5" />
                        View Maid Profile
                    </Link>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
