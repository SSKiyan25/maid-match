import { MapPin, Calendar, Home, PhilippinePeso, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { formatCurrency } from "@/utils/useGeneralUtils";
import { getAccommodationLabel, getDayOffLabel } from "../../utils/jobUtils";
import { Button } from "@/Components/ui/button";

export default function JobPostSummary({ job }: { job: any }) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Job Details</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Job Image */}
                <div className="relative w-full h-48 rounded-md overflow-hidden">
                    {job.photos && job.photos.length > 0 ? (
                        <img
                            src={`/storage/${job.photos[0].url}`}
                            alt={job.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <p className="text-muted-foreground">No image</p>
                        </div>
                    )}
                </div>

                {/* Title and Status */}
                <div>
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <Badge
                        variant={
                            job.status === "active" ? "default" : "secondary"
                        }
                        className="mt-1"
                    >
                        {job.status}
                    </Badge>
                </div>

                {/* Location */}
                <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                        {job.location?.city}, {job.location?.brgy},{" "}
                        {job.location?.province}
                    </span>
                </div>

                {/* Key job details */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <PhilippinePeso className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                            ₱{formatCurrency(job.min_salary)} - ₱
                            {formatCurrency(job.max_salary)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Home className="h-4 w-4 text-primary" />
                        <span>
                            <span className="text-muted-foreground">
                                Accommodation:
                            </span>{" "}
                            {getAccommodationLabel(job.accommodation_type)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                            <span className="text-muted-foreground">
                                Day Off:
                            </span>{" "}
                            {getDayOffLabel(job.day_off_type) || "Flexible"}
                        </span>
                    </div>
                </div>

                {/* Work Types */}
                <div>
                    <h4 className="text-sm font-medium mb-1">Work Types:</h4>
                    <div className="flex flex-wrap gap-1">
                        {(job.work_types ?? []).map(
                            (type: any, index: number) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="capitalize text-xs"
                                >
                                    {type.replace("_", " ")}
                                </Badge>
                            )
                        )}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h4 className="text-sm font-medium mb-1">Description:</h4>
                    <p className="text-sm text-muted-foreground">
                        {job.description}
                    </p>
                </div>

                {/* Employer Info */}
                <div>
                    <h4 className="text-sm font-medium mb-1">Employer:</h4>
                    <span className="font-medium text-sm block mb-2">
                        {job.employer?.user?.profile
                            ? `${job.employer.user.profile.first_name} ${job.employer.user.profile.last_name}`
                            : "N/A"}
                    </span>
                    <div className="text-sm mb-2">
                        <p>Family Size: {job.employer?.family_size || "N/A"}</p>
                        <p>Has Pets: {job.employer?.has_pets ? "Yes" : "No"}</p>
                        <p>
                            Has Children:{" "}
                            {job.employer?.has_children ? "Yes" : "No"}
                        </p>
                    </div>
                </div>

                {/* See Employer Profile Button at the bottom */}
                <Button
                    variant="outline"
                    className="w-full"
                    // onClick={() => ...}
                >
                    <User className="h-4 w-4 mr-2" />
                    See Employer Profile
                </Button>
            </CardContent>
        </Card>
    );
}
