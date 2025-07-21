import {
    X,
    MapPin,
    Calendar,
    Home,
    Check,
    Heart,
    User,
    Phone,
    Gift,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { formatCurrency } from "@/utils/useGeneralUtils";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Link } from "@inertiajs/react";
import { Separator } from "@/Components/ui/separator";
import { getInitials } from "@/utils/useGeneralUtils";
import { getAccommodationLabel, getDayOffLabel } from "../utils/jobUtils";

interface JobDetailsModalProps {
    job: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function JobDetailsModal({
    job,
    isOpen,
    onClose,
}: JobDetailsModalProps) {
    const userName = job.employer?.user?.profile
        ? `${job.employer.user.profile.first_name} ${job.employer.user.profile.last_name}`.trim()
        : job.employer?.user?.name || "Unknown";

    // Format bonus frequency to be more readable
    const formatBonusFrequency = (frequency: string) => {
        switch (frequency) {
            case "yearly":
                return "Annual";
            case "monthly":
                return "Monthly";
            case "quarterly":
                return "Quarterly";
            case "weekly":
                return "Weekly";
            default:
                return frequency;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0"
                aria-describedby="job-details-description"
            >
                <DialogHeader className="p-4 sm:p-6 sticky top-0 bg-background z-10 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <DialogTitle className="text-lg">
                                Job Details
                            </DialogTitle>
                            <DialogDescription
                                id="job-details-description"
                                className="text-xs"
                            >
                                Detailed information about the job posting
                                including description, salary, benefits, and
                                employer details
                            </DialogDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                {/* Job Header */}
                <div className="relative w-full h-40 sm:h-56">
                    {job.photos && job.photos.length > 0 ? (
                        <img
                            src={`/storage/${job.photos[0].url}`}
                            alt={job.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">
                                No image available
                            </p>
                        </div>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                </div>

                {/* Job Content */}
                <div className="p-4 sm:p-6 space-y-5">
                    {/* Basic Job Info */}
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg sm:text-xl">
                                {job.title}
                            </h3>
                            <Badge
                                variant={
                                    job.status === "active"
                                        ? "default"
                                        : "secondary"
                                }
                                className="capitalize"
                            >
                                {job.status}
                            </Badge>
                        </div>

                        <div className="flex gap-2 text-sm text-muted-foreground items-center mb-3">
                            <MapPin className="h-4 w-4" />
                            <span>
                                {job.location?.city}, {job.location?.brgy},{" "}
                                {job.location?.province}
                                {job.location?.landmark && (
                                    <span className="block text-[11px] text-muted-foreground ">
                                        Landmark: {job.location.landmark}
                                    </span>
                                )}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 mb-2">
                            <div className="flex items-center bg-muted/50 rounded px-2 py-1">
                                <Home className="h-4 w-4 mr-2 text-primary" />
                                <span className="font-semibold">
                                    Accommodation:
                                </span>
                                <span className="ml-2">
                                    {getAccommodationLabel(
                                        job.accommodation_type
                                    ) || "None Specified"}
                                </span>
                            </div>
                            <div className="flex items-center bg-muted/50 rounded px-2 py-1">
                                <Calendar className="h-4 w-4 mr-2 text-primary" />
                                <span className="font-semibold">Day Off:</span>
                                <span className="ml-2">
                                    {getDayOffLabel(job.day_off_preference) ||
                                        "None Specified"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Salary & Benefits */}
                    <div>
                        <h4 className="font-medium mb-2">Salary & Benefits</h4>
                        <p className="text-base font-medium mb-3">
                            ₱{formatCurrency(job.min_salary)} - ₱
                            {formatCurrency(job.max_salary)}
                        </p>

                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="flex items-center">
                                <span className="mr-2">Accommodation:</span>
                                <Badge variant="outline">
                                    {job.accommodation_type === "live_out"
                                        ? "Live Out"
                                        : "Live In"}
                                </Badge>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2">Food Provided:</span>
                                <Badge
                                    variant={
                                        job.provides_food
                                            ? "default"
                                            : "outline"
                                    }
                                >
                                    {job.provides_food ? "Yes" : "No"}
                                </Badge>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2">Toiletries:</span>
                                <Badge
                                    variant={
                                        job.provides_toiletries
                                            ? "default"
                                            : "outline"
                                    }
                                >
                                    {job.provides_toiletries ? "Yes" : "No"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Bonuses Section */}
                    {job.bonuses && job.bonuses.length > 0 && (
                        <>
                            <Separator />
                            <div>
                                <h4 className="font-medium mb-2">Bonuses</h4>
                                <div className="space-y-3">
                                    {job.bonuses.map(
                                        (bonus: any, index: number) => (
                                            <div
                                                key={index}
                                                className="flex items-start"
                                            >
                                                <Gift className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {bonus.title}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {formatBonusFrequency(
                                                                bonus.frequency
                                                            )}
                                                        </Badge>
                                                        {bonus.amount && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                ₱
                                                                {formatCurrency(
                                                                    bonus.amount
                                                                )}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {bonus.description && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {bonus.description}
                                                        </p>
                                                    )}
                                                    {bonus.conditions && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            <span className="font-medium">
                                                                Conditions:
                                                            </span>{" "}
                                                            {bonus.conditions}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <Separator />

                    {/* Work Types */}
                    <div>
                        <h4 className="font-medium mb-2">Work Types</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {job.work_types?.map(
                                (type: string, index: number) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="capitalize"
                                    >
                                        {type}
                                    </Badge>
                                )
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    <div>
                        <h4 className="font-medium mb-2">Job Description</h4>
                        <p className="text-sm text-muted-foreground">
                            {job.description}
                        </p>
                    </div>

                    <Separator />

                    {/* Language Preferences */}
                    <div>
                        <h4 className="font-medium mb-2">
                            Language Preferences
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {job.language_preferences?.map(
                                (lang: string, index: number) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="capitalize"
                                    >
                                        {lang}
                                    </Badge>
                                )
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Employer Info */}
                    <div>
                        <h4 className="font-medium mb-3">Employer</h4>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                                <AvatarImage
                                    src={
                                        job.employer?.user?.profile?.avatar
                                            ? `/storage/${job.employer.user.profile.avatar}`
                                            : undefined
                                    }
                                />
                                <AvatarFallback>
                                    {getInitials(userName)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{userName}</p>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Check className="h-3.5 w-3.5 mr-1" />
                                    <span>
                                        {job.employer?.is_verified
                                            ? "Verified"
                                            : "Unverified"}{" "}
                                        Employer
                                    </span>
                                </div>

                                {/* Phone number (if not private) */}
                                {job.employer?.user?.profile?.phone_number &&
                                    !job.employer?.user?.profile
                                        ?.is_phone_private && (
                                        <div className="flex items-center text-sm mt-1">
                                            <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                            <span>
                                                {
                                                    job.employer.user.profile
                                                        .phone_number
                                                }
                                            </span>
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* Household info */}
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">
                                    Family Size:
                                </span>{" "}
                                <span>{job.employer?.family_size}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Has Children:
                                </span>{" "}
                                <span>
                                    {job.employer?.has_children ? "Yes" : "No"}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Has Pets:
                                </span>{" "}
                                <span>
                                    {job.employer?.has_pets ? "Yes" : "No"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Footer */}
                <DialogFooter className="p-4 gap-4 sm:p-6 border-t bg-background sticky bottom-0">
                    <Button variant="outline" className="w-full mt-2 sm:mt-0">
                        <Link
                            href={route(
                                "browse.employers.show",
                                job.employer?.id
                            )}
                            className="flex items-center gap-2"
                        >
                            <User className="h-4 w-4 mr-2" />
                            See Employer Profile
                        </Link>
                    </Button>
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="w-full"
                        >
                            Close
                        </Button>
                        <Button asChild className="w-full">
                            <Link
                                href={route("browse.job-applications.show", {
                                    jobPost: job.id,
                                })}
                            >
                                Apply Now
                            </Link>
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
