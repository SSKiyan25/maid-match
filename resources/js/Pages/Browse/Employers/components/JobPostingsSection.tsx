import { useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import {
    Briefcase,
    Clock,
    MapPin,
    CircleDollarSign,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";

export default function JobPostingsSection({ jobPostings }: any) {
    const [showAll, setShowAll] = useState(false);

    // Initially show only 3 job postings
    const displayedJobs = showAll ? jobPostings : jobPostings.slice(0, 3);

    return (
        <div className="space-y-4">
            {jobPostings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                    <Briefcase className="h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">
                        No active job postings
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mt-1">
                        This employer doesn't have any active job postings at
                        the moment.
                    </p>
                </div>
            ) : (
                <>
                    {displayedJobs.map((job: any, index: any) => (
                        <JobPostCard key={job.id} job={job} />
                    ))}

                    {jobPostings.length > 3 && (
                        <div className="flex justify-center px-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowAll(!showAll)}
                                className="w-full"
                            >
                                {showAll ? (
                                    <>
                                        <PanelLeftClose className="h-4 w-4 mr-2" />
                                        Show Less
                                    </>
                                ) : (
                                    <>
                                        <PanelLeftOpen className="h-4 w-4 mr-2" />
                                        Show All Jobs ({jobPostings.length})
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function JobPostCard({ job }: any) {
    return (
        <Card className="overflow-hidden">
            <Link
                href={route("browse.job-applications.show", job.id)}
                className="block hover:bg-muted/50 transition-colors"
            >
                <CardContent className="p-4">
                    <div className="flex flex-col space-y-3">
                        {/* Job Title and Status */}
                        <div className="flex items-start justify-between">
                            <h3 className="font-semibold text-lg">
                                {job.title}
                            </h3>
                            <Badge
                                variant={
                                    job.status === "active"
                                        ? "default"
                                        : "secondary"
                                }
                            >
                                {job.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                            </Badge>
                        </div>

                        {/* Work Types */}
                        <div className="flex flex-wrap gap-2">
                            {job.work_types_list?.map((type: any) => (
                                <Badge key={type} variant="outline">
                                    {type}
                                </Badge>
                            ))}
                        </div>

                        {/* Job Details */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <CircleDollarSign className="h-3.5 w-3.5" />
                                <span>{job.salary_range}</span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                <span>
                                    {job.accommodation_type === "live_in"
                                        ? "Live-in"
                                        : "Live-out"}
                                </span>
                            </div>

                            {job.location && (
                                <div className="flex items-start gap-2 text-muted-foreground col-span-2">
                                    <MapPin className="h-3.5 w-3.5 mt-0.5" />
                                    <span>
                                        {[
                                            job.location.city,
                                            job.location.province,
                                        ]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Posted Date */}
                        <div className="text-xs text-muted-foreground">
                            Posted{" "}
                            {format(new Date(job.created_at), "MMM d, yyyy")}
                        </div>

                        {/* Click to Apply Notice */}
                        <div className="mt-3 text-xs text-primary font-medium flex items-center gap-1">
                            <span>Click to view and apply for this job</span>
                            <span aria-hidden>→</span>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}
