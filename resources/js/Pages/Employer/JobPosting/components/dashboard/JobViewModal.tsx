import {
    MapPin,
    Users,
    Calendar,
    PhilippinePeso,
    Home,
    Clock,
    Globe,
    Gift,
    Camera,
    MessageSquare,
    UserCheck,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Separator } from "@/Components/ui/separator";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { JobPosting } from "../../utils/types";

interface JobViewModalProps {
    job: JobPosting | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function JobViewModal({
    job,
    isOpen,
    onClose,
}: JobViewModalProps) {
    const formatSalary = (min?: number, max?: number) => {
        if (!min && !max) return "Negotiable";
        if (min && max)
            return `₱${min.toLocaleString()} - ₱${max.toLocaleString()}`;
        if (min) return `₱${min.toLocaleString()}+`;
        return `Up to ₱${max?.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (!job) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl font-bold">
                                {job.title}
                            </DialogTitle>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={
                                        job.is_archived
                                            ? "secondary"
                                            : "default"
                                    }
                                >
                                    {job.is_archived ? "Archived" : "Active"}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    Posted {formatDate(job.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-120px)]">
                    <div className="p-6 space-y-6">
                        {/* Work Types */}
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Work Types
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {job.work_types.map((type, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="capitalize"
                                    >
                                        {type}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Salary & Benefits */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <PhilippinePeso className="w-4 h-4" />
                                    Salary Range
                                </h3>
                                <p className="text-2xl font-bold text-primary">
                                    {formatSalary(
                                        job.min_salary != null &&
                                            job.min_salary !== ""
                                            ? typeof job.min_salary === "number"
                                                ? job.min_salary
                                                : parseFloat(job.min_salary)
                                            : undefined,
                                        job.max_salary != null &&
                                            job.max_salary !== ""
                                            ? typeof job.max_salary === "number"
                                                ? job.max_salary
                                                : parseFloat(job.max_salary)
                                            : undefined
                                    )}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Home className="w-4 h-4" />
                                    Accommodation
                                </h3>
                                <Badge variant="outline" className="capitalize">
                                    {job.accommodation_type}
                                </Badge>
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            Food:
                                        </span>
                                        <Badge
                                            variant={
                                                job.provides_food
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {job.provides_food
                                                ? "Provided"
                                                : "Not Provided"}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                            Toiletries:
                                        </span>
                                        <Badge
                                            variant={
                                                job.provides_toiletries
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {job.provides_toiletries
                                                ? "Provided"
                                                : "Not Provided"}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Location */}
                        {job.location && (
                            <>
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p>
                                                <span className="font-medium">
                                                    Address:
                                                </span>{" "}
                                                {job.location.brgy},{" "}
                                                {job.location.city},{" "}
                                                {job.location.province}{" "}
                                                {job.location.postal_code}
                                            </p>
                                            {job.location.landmark && (
                                                <p>
                                                    <span className="font-medium">
                                                        Landmark:
                                                    </span>{" "}
                                                    {job.location.landmark}
                                                </p>
                                            )}
                                        </div>
                                        {job.location.directions && (
                                            <div>
                                                <p>
                                                    <span className="font-medium">
                                                        Directions:
                                                    </span>{" "}
                                                    {job.location.directions}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Schedule */}
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Schedule & Time Off
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p>
                                        <span className="font-medium">
                                            Day Off Type:
                                        </span>{" "}
                                        <Badge
                                            variant="outline"
                                            className="capitalize"
                                        >
                                            {job.day_off_type}
                                        </Badge>
                                    </p>
                                </div>
                                {job.day_off_preference && (
                                    <div>
                                        <p>
                                            <span className="font-medium">
                                                Preferred Day Off:
                                            </span>{" "}
                                            {job.day_off_preference}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Languages */}
                        {job.language_preferences &&
                            job.language_preferences.length > 0 && (
                                <>
                                    <div className="space-y-2">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Globe className="w-4 h-4" />
                                            Language Preferences
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {job.language_preferences.map(
                                                (lang, index) => (
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
                                </>
                            )}

                        {/* Bonuses */}
                        {job.bonuses && job.bonuses.length > 0 && (
                            <>
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Gift className="w-4 h-4" />
                                        Bonuses & Benefits
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {job.bonuses.map((bonus, index) => (
                                            <div
                                                key={index}
                                                className="p-3 border rounded-lg"
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-medium">
                                                        {bonus.title}
                                                    </h4>
                                                    <Badge
                                                        variant={
                                                            bonus.status ===
                                                            "active"
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {bonus.status}
                                                    </Badge>
                                                </div>
                                                {bonus.amount && (
                                                    <p className="text-sm text-muted-foreground">
                                                        ₱
                                                        {typeof bonus.amount ===
                                                        "number"
                                                            ? bonus.amount.toLocaleString()
                                                            : parseFloat(
                                                                  bonus.amount ??
                                                                      "0"
                                                              ).toLocaleString()}
                                                    </p>
                                                )}
                                                {bonus.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {bonus.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Photos */}
                        {job.photos && job.photos.length > 0 && (
                            <>
                                <div className="space-y-2">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Camera className="w-4 h-4" />
                                        Photos
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {job.photos.map((photo, index) => (
                                            <div
                                                key={index}
                                                className="aspect-square bg-muted rounded-lg overflow-hidden"
                                            >
                                                <img
                                                    src={`/storage/${photo.url}`}
                                                    alt={
                                                        photo.caption ||
                                                        "Job photo"
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Separator />
                            </>
                        )}

                        {/* Description */}
                        <div className="space-y-2">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Job Description
                            </h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {job.description}
                            </p>
                        </div>

                        <Separator />

                        {/* Applications & Interviews */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Applications
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">
                                        {job.applications_count || 0}
                                    </span>
                                    <Button variant="outline" size="sm">
                                        View Applications
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <UserCheck className="w-4 h-4" />
                                    Interviews
                                </h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold">
                                        {job.interviews_count || 0}
                                    </span>
                                    <Button variant="outline" size="sm">
                                        View Interviews
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
