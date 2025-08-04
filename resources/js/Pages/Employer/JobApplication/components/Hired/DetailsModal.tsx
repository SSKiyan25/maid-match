import { Link } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Separator } from "@/Components/ui/separator";
import { getInitials } from "@/utils/useGeneralUtils";
import { format } from "date-fns";
import {
    Mail,
    Phone,
    MapPin,
    Calendar,
    Award,
    Building2,
    CheckCircle,
    ArrowUpRight,
    Flag,
} from "lucide-react";

interface HiredApplicantDetailsModalProps {
    applicant: any;
    isOpen: boolean;
    onClose: () => void;
}

export default function HiredApplicantDetailsModal({
    applicant,
    isOpen,
    onClose,
}: HiredApplicantDetailsModalProps) {
    if (!applicant) return null;

    const maid = applicant.application.maid;
    const user = maid.user;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Hired Applicant Details</DialogTitle>
                    <DialogDescription>
                        View detailed information about this hired applicant
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage
                                src={
                                    user.avatar
                                        ? `/storage/${user.avatar}`
                                        : undefined
                                }
                                alt={maid.full_name}
                            />
                            <AvatarFallback className="text-lg">
                                {getInitials(maid.full_name)}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <h3 className="text-xl font-semibold">
                                {maid.full_name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="default">Hired</Badge>
                                {maid.is_verified && (
                                    <Badge
                                        variant="accent"
                                        className="flex items-center gap-1"
                                    >
                                        <CheckCircle className="h-3 w-3" />
                                        Verified
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Position Info */}
                    <div className="bg-muted rounded-lg p-4">
                        <h4 className="font-medium mb-2">Job Information</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Position:
                                </span>
                                <span className="font-medium">
                                    {applicant.job_title}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Hired on:
                                </span>
                                <span className="font-medium">
                                    {format(
                                        new Date(applicant.hired_at),
                                        "MMMM d, yyyy"
                                    )}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Applied on:
                                </span>
                                <span className="font-medium">
                                    {format(
                                        new Date(
                                            applicant.application.applied_at
                                        ),
                                        "MMMM d, yyyy"
                                    )}
                                </span>
                            </div>
                            {applicant.application.proposed_salary && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Proposed Salary:
                                    </span>
                                    <span className="font-medium">
                                        ₱
                                        {parseFloat(
                                            applicant.application
                                                .proposed_salary
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h4 className="font-medium mb-2">
                            Contact Information
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{user.email}</span>
                            </div>
                            {user.profile?.phone_number && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{user.profile.phone_number}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{maid.nationality || "Unknown"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {maid.years_experience > 0
                                    ? `${maid.years_experience} ${
                                          maid.years_experience === 1
                                              ? "year"
                                              : "years"
                                      } exp.`
                                    : "New"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">
                                {maid.experience_level || "Not specified"}
                            </span>
                        </div>
                    </div>

                    <Separator />

                    {/* Bio */}
                    {maid.bio && (
                        <div>
                            <h4 className="font-medium mb-2">About</h4>
                            <p className="text-sm text-muted-foreground">
                                {maid.bio}
                            </p>
                        </div>
                    )}

                    {/* Skills */}
                    {maid.skills?.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {maid.skills.map(
                                    (skill: string, index: number) => (
                                        <Badge key={index} variant="outline">
                                            {skill}
                                        </Badge>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {maid.languages?.length > 0 && (
                        <div>
                            <h4 className="font-medium mb-2">Languages</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {maid.languages.map(
                                    (language: string, index: number) => (
                                        <Badge key={index} variant="secondary">
                                            {language}
                                        </Badge>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Agency Information */}
                    {maid.agency && (
                        <div>
                            <h4 className="font-medium mb-2">Agency</h4>
                            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                <Avatar>
                                    <AvatarImage
                                        src={
                                            applicant.agency_user?.avatar
                                                ? `/storage/${applicant.agency_user.avatar}`
                                                : undefined
                                        }
                                        alt={applicant.agency_name}
                                    />
                                    <AvatarFallback>
                                        {getInitials(applicant.agency_name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div className="font-medium">
                                        {applicant.agency_name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {maid.agency.address?.city},{" "}
                                        {maid.agency.address?.province}
                                    </div>
                                    {maid.agency.website && (
                                        <div className="text-xs mt-1">
                                            <a
                                                href={maid.agency.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="underline text-blue-600"
                                            >
                                                {maid.agency.website}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={route(
                                            "browse.agencies.show",
                                            applicant.agency_id
                                        )}
                                    >
                                        <Building2 className="h-4 w-4 mr-1" />
                                        View
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="gap-2 flex flex-col sm:flex-row">
                    <Button
                        variant="destructive"
                        className="flex-1 flex items-center gap-1"
                        asChild
                    >
                        <Link href={route("report.user.create", maid.user_id)}>
                            <Flag className="h-4 w-4" />
                            Report Issue
                        </Link>
                    </Button>

                    <div className="flex gap-2 w-full sm:w-auto">
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
                                href={route("browse.maids.show", maid.id)}
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
    );
}
