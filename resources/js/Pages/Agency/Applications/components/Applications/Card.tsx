import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import { format } from "date-fns";
import { Eye, Briefcase, Building2, MapPin, Info, User } from "lucide-react";
import ApplicationDetailsDialog from "./DetailsDialog";
import ActionMenu from "./ActionMenu";
import {
    getInitials,
    getStatusVariant,
    getMaidStatusLabel,
    getMaidStatusVariant,
} from "@/utils/useGeneralUtils";
import StatusInfo from "./StatusInfo";

interface ApplicationCardProps {
    application: any;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
    const [showDetails, setShowDetails] = useState(false);

    // Extract data
    const { maid, job_posting, status, status_label, applied_at, id } =
        application;
    const { user, status: maidStatus } = maid;
    const profile = user?.profile || {};

    return (
        <>
            <Card className="overflow-hidden h-full transition-all hover:shadow-md">
                <CardContent className="p-0">
                    {/* Job title header */}
                    <div className="bg-muted p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-medium text-sm truncate underline underline-offset-4">
                                    {job_posting?.title || "Untitled Job"}
                                </h3>
                            </div>
                            <Badge
                                variant={getStatusVariant(status)}
                                className="gap-2"
                            >
                                {status_label}
                                <StatusInfo />
                            </Badge>
                        </div>
                    </div>

                    {/* Maid info */}
                    <div className="p-4">
                        <div className="flex gap-3 items-start">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={
                                        user?.avatar
                                            ? `/storage/${user.avatar}`
                                            : undefined
                                    }
                                    alt={maid.full_name}
                                />
                                <AvatarFallback>
                                    {getInitials(maid.full_name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-medium">
                                        {maid.full_name}
                                    </h4>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Applied on{" "}
                                    {format(
                                        new Date(applied_at),
                                        "MMM d, yyyy"
                                    )}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-muted-foreground">
                                        Maid Status:
                                    </span>
                                    <Badge
                                        variant={getMaidStatusVariant(
                                            maidStatus
                                        )}
                                        className="text-[10px] py-0 px-2"
                                    >
                                        <User className="h-2.5 w-2.5 mr-1" />
                                        {getMaidStatusLabel(maidStatus)}
                                    </Badge>
                                    <StatusInfo />
                                </div>
                            </div>
                        </div>

                        {/* Job details */}
                        <div className="mt-4 space-y-2">
                            <span className="text-[11px] text-muted-foreground">
                                Employer Details
                            </span>
                            <div className="flex items-start text-xs text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5 mr-2 mt-0.5 flex-shrink-0" />
                                <span>
                                    {job_posting?.employer?.user?.full_name}
                                </span>
                            </div>

                            {job_posting?.location && (
                                <div className="flex items-start text-xs text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>
                                        {job_posting.location.city},{" "}
                                        {job_posting.location.province}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-3 border-t bg-muted">
                    <div className="flex w-full gap-2 items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-[2] text-xs"
                            onClick={() => setShowDetails(true)}
                        >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            View More Details
                        </Button>

                        {/* Action Menu with Confirmation Dialogs */}
                        <ActionMenu
                            applicationId={id}
                            maidName={maid.full_name}
                        />
                    </div>
                </CardFooter>
            </Card>

            {showDetails && (
                <ApplicationDetailsDialog
                    application={application}
                    open={showDetails}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    );
}
