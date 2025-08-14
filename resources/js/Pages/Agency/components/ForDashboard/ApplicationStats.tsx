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
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Skeleton } from "@/Components/ui/skeleton";
import { Link } from "@inertiajs/react";
import { PieChart } from "@/Components/ui/chart";
import { FileText, CheckCircle, List, Briefcase, Award } from "lucide-react";

interface ApplicationStatsProps {
    stats: any;
    recentApplications: any[];
    isLoading: boolean;
}

export default function ApplicationStats({
    stats,
    recentApplications,
    isLoading,
}: ApplicationStatsProps) {
    // Prepare chart data
    const chartData =
        !isLoading && stats
            ? [
                  { name: "Pending", value: stats.pendingApplications },
                  { name: "Reviewed", value: stats.reviewedApplications },
                  { name: "Shortlisted", value: stats.shortlistedApplications },
                  { name: "Hired", value: stats.hiredApplications },
                  { name: "Rejected", value: stats.rejectedApplications },
                  { name: "Withdrawn", value: stats.withdrawnApplications },
              ].filter((item) => item.value > 0)
            : [];

    return (
        <div className="space-y-6">
            {/* Application Statistics */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                    title="Total"
                    value={stats?.totalApplications || 0}
                    icon={<FileText className="h-4 w-4" />}
                    isLoading={isLoading}
                />
                <StatCard
                    title="Shortlisted"
                    value={stats?.shortlistedApplications || 0}
                    icon={<List className="h-4 w-4" />}
                    isLoading={isLoading}
                />
                <StatCard
                    title="Hired"
                    value={stats?.hiredApplications || 0}
                    icon={<Award className="h-4 w-4" />}
                    isLoading={isLoading}
                />
                <StatCard
                    title="Success Rate"
                    value={`${stats?.successRate || 0}%`}
                    icon={<CheckCircle className="h-4 w-4" />}
                    isLoading={isLoading}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Application Status Chart */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">
                            Application Status
                        </CardTitle>
                        <CardDescription>
                            Distribution of application statuses
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <Skeleton className="h-48 w-full" />
                        ) : chartData.length > 0 ? (
                            <div className="w-auto mx-auto">
                                <PieChart
                                    data={chartData}
                                    category="value"
                                    index="name"
                                    valueFormatter={(value: any) =>
                                        `${value} applications`
                                    }
                                    colors={[
                                        "sky",
                                        "indigo",
                                        "violet",
                                        "emerald",
                                        "rose",
                                        "amber",
                                    ]}
                                    className="h-42 sm:h-72"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-center">
                                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">
                                    No application data
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Start applying to job postings
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Applications */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold">
                            Recent Applications
                        </CardTitle>
                        <CardDescription>
                            Latest job applications submitted
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-3"
                                    >
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-36" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : recentApplications &&
                          recentApplications.length > 0 ? (
                            <div className="space-y-4">
                                {recentApplications.slice(0, 3).map((app) => (
                                    <ApplicationListItem
                                        key={app.id}
                                        application={app}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <Briefcase className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">
                                    No applications yet
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Apply to job postings to get started
                                </p>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/agency/applications">
                                View All Applications
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

// Helper Components
function StatCard({ title, value, icon, isLoading }: any) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                        {title}
                    </span>
                    <span className="text-muted-foreground">{icon}</span>
                </div>
                {isLoading ? (
                    <Skeleton className="h-7 w-14" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    );
}

function ApplicationListItem({ application }: any) {
    const jobTitle = application.job_posting?.title || "Unknown Job";
    const maidName = application.maid?.full_name || "Unknown Maid";
    const status = application.status_label || application.status;

    // Helper function to get status badge variant
    const getStatusVariant = (
        status: any
    ): "default" | "destructive" | "outline" | "secondary" | "accent" => {
        switch (status.toLowerCase()) {
            case "pending":
                return "secondary";
            case "shortlisted":
                return "accent";
            case "hired":
                return "default";
            case "rejected":
                return "destructive";
            case "withdrawn":
            default:
                return "outline";
        }
    };

    // Format date
    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
        }).format(date);
    };

    let avatarPath =
        application.maid?.user?.avatar ||
        application.maid?.user?.profile?.avatar ||
        application.maid?.primary_photo ||
        null;
    const avatarUrl = avatarPath ? `/storage/${avatarPath}` : undefined;

    return (
        <div className="flex items-start gap-3">
            <Avatar>
                <AvatarImage src={avatarUrl} alt={maidName} />
                <AvatarFallback>
                    {maidName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{jobTitle}</p>
                    <Badge variant={getStatusVariant(application.status)}>
                        {status}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {maidName} • Applied{" "}
                    {formatDate(
                        application.applied_at || application.created_at
                    )}
                </p>
                {application.job_posting?.employer?.user?.profile
                    ?.full_name && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Employer:{" "}
                        {
                            application.job_posting.employer.user.profile
                                .full_name
                        }
                    </p>
                )}
            </div>
        </div>
    );
}
