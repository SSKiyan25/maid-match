import { useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter,
} from "@/Components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Calendar, MapPin, Briefcase, User } from "lucide-react";
import StatusInfo from "./StatusInfo";
import DetailsDialog from "./DetailsDialog";
import ActionMenu from "./ActionMenu";
import { formatDistance } from "date-fns";

interface ApplicationCardProps {
    application: any;
    viewMode?: "grid" | "list";
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
}

export default function ApplicationCard({
    application,
    viewMode = "grid",
}: ApplicationCardProps) {
    const [showDetails, setShowDetails] = useState(false);

    // Access the maid data correctly
    const profile = application.maid.user?.profile || {};
    const maidName =
        `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
        "Unnamed Maid";

    // Fix the avatar URL to include /storage/ prefix
    const avatarPath = application.maid.user?.avatar || "";
    const avatarUrl = avatarPath ? `/storage/${avatarPath}` : "";

    // Access job posting data correctly
    const jobTitle = application.job_posting?.title || "Untitled Job";
    const employerName =
        application.job_posting?.employer?.user?.name || "Unknown Employer";
    const location =
        application.job_posting?.location?.city || "Location not specified";

    // Format date properly using applied_at instead of created_at
    const applicationDate = application.applied_at
        ? formatDistance(new Date(application.applied_at), new Date(), {
              addSuffix: true,
          })
        : "Unknown date";

    if (viewMode === "list") {
        return (
            <Card className="overflow-hidden transition-all hover:border-primary/50">
                <div className="flex flex-col md:flex-row">
                    {/* Maid/Applicant Section with Header */}
                    <div className="p-4 md:p-6 md:w-1/4 bg-muted/30 border-b md:border-b-0 md:border-r border-border/60">
                        <div className="flex items-start gap-2 mb-3">
                            <Badge variant="outline" className="bg-background">
                                <User className="mr-1 h-3.5 w-3.5" /> Applicant
                            </Badge>
                            <StatusInfo
                                status={application.maid.status}
                                type="maid"
                                size="sm"
                            />
                        </div>

                        <div className="flex items-center">
                            <Avatar className="h-12 w-12 mr-4">
                                <AvatarImage src={avatarUrl} alt={maidName} />
                                <AvatarFallback>
                                    {getInitials(maidName)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold line-clamp-1">
                                    {maidName}
                                </h3>
                            </div>
                        </div>
                    </div>

                    {/* Job Posting Section */}
                    <div className="flex-1 p-4 md:p-6">
                        <div className="flex items-start gap-2 mb-3">
                            <Badge variant="outline" className="bg-background">
                                <Briefcase className="mr-1 h-3.5 w-3.5" /> Job
                                Post
                            </Badge>
                            <StatusInfo status={application.status} />
                        </div>

                        <div className="flex flex-wrap justify-between items-start gap-2">
                            <div>
                                <h3 className="font-semibold text-lg line-clamp-1 mb-1">
                                    {jobTitle}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    <span className="text-xs text-muted-foreground mr-1">
                                        Employer:
                                    </span>
                                    {employerName}
                                </p>

                                <div className="flex flex-wrap gap-3 mt-3">
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <MapPin size={14} className="mr-1" />
                                        {location}
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                        <Calendar size={14} className="mr-1" />
                                        Applied {applicationDate}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-3 md:mt-0">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setShowDetails(true)}
                                >
                                    View Details
                                </Button>
                                <ActionMenu
                                    applicationId={application.id}
                                    maidName={maidName}
                                    application={application}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <DetailsDialog
                    open={showDetails}
                    onOpenChange={setShowDetails}
                    application={application}
                />
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden transition-all hover:border-primary/50">
            {/* Job Posting Section */}
            <CardHeader className="p-4 pb-3 border-b bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline" className="bg-background">
                        <Briefcase className="mr-1 h-3.5 w-3.5" /> Job Post
                    </Badge>
                    <StatusInfo status={application.status} />
                </div>

                <div className="space-y-1">
                    <h3 className="font-semibold text-lg leading-none line-clamp-1">
                        {jobTitle}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        <span className="text-xs text-muted-foreground mr-1">
                            Employer:
                        </span>
                        {employerName}
                    </p>
                </div>
            </CardHeader>

            {/* Maid/Applicant Section */}
            <CardContent className="p-4 pt-5">
                <div className="flex items-start gap-2 mb-3">
                    <Badge variant="outline" className="bg-background">
                        <User className="mr-1 h-3.5 w-3.5" /> Applicant
                    </Badge>
                    <StatusInfo
                        status={application.maid.status}
                        type="maid"
                        size="sm"
                    />
                </div>

                <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={avatarUrl} alt={maidName} />
                        <AvatarFallback>{getInitials(maidName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-medium">{maidName}</h4>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {location}
                    </div>
                    <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        Applied {applicationDate}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-2 flex justify-between border-t">
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full mr-2"
                    onClick={() => setShowDetails(true)}
                >
                    View Details
                </Button>
                <ActionMenu
                    applicationId={application.id}
                    maidName={maidName}
                    application={application}
                />
            </CardFooter>

            <DetailsDialog
                open={showDetails}
                onOpenChange={setShowDetails}
                application={application}
            />
        </Card>
    );
}
