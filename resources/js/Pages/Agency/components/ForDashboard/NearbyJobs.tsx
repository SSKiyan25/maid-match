import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import { Link } from "@inertiajs/react";
import {
    MapPin,
    Clock,
    PhilippinePeso,
    Briefcase,
    CalendarDays,
    User,
} from "lucide-react";

interface NearbyJobsProps {
    jobs: any[];
    isLoading: boolean;
}

export default function NearbyJobs({ jobs, isLoading }: NearbyJobsProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                    Nearby Job Opportunities
                </CardTitle>
                <CardDescription>
                    Jobs that may match your maids' skills
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-32 w-full" />
                        ))}
                    </div>
                ) : jobs && jobs.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {jobs.slice(0, 4).map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <Briefcase className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">
                            No jobs available nearby
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Check back later for new opportunities
                        </p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="border-t pt-4">
                <Button variant="outline" className="w-full" asChild>
                    <Link href="/browse/job-posts">Browse All Jobs</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}

function JobCard({ job }: any) {
    const formatDate = (date: any) => {
        if (!date) return "";
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
        }).format(new Date(date));
    };

    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">{job.title}</h3>
                        <Badge
                            variant={
                                job.status === "active" ? "default" : "outline"
                            }
                        >
                            {job.status}
                        </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <User className="h-3.5 w-3.5 mr-1" />
                            <span className="truncate">
                                {job.employer?.user?.profile?.full_name ||
                                    "Employer"}
                            </span>
                        </div>

                        {job.location && (
                            <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1" />
                                <span className="truncate">
                                    {job.location.city}, {job.location.province}
                                </span>
                            </div>
                        )}

                        <div className="flex items-center">
                            <PhilippinePeso className="h-3.5 w-3.5 mr-1" />
                            <span>{job.salary_range || "Negotiable"}</span>
                        </div>

                        <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>Posted {formatDate(job.created_at)}</span>
                        </div>
                    </div>

                    {job.work_types_list && job.work_types_list.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {job.work_types_list
                                .slice(0, 2)
                                .map((type: any, i: number) => (
                                    <Badge
                                        key={i}
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        {type}
                                    </Badge>
                                ))}
                            {job.work_types_list.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{job.work_types_list.length - 2}
                                </Badge>
                            )}
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        asChild
                    >
                        <Link href={`/browse/job-applications/${job.id}`}>
                            View Details
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
