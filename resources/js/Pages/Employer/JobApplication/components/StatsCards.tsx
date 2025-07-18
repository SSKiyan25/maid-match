import { Card, CardContent } from "@/Components/ui/card";
import { Users, Briefcase, Star, UserCheck, X, Clock } from "lucide-react";

interface StatsCardsProps {
    applicants: any[];
    jobPostings: any[];
}

export default function StatsCards({
    applicants,
    jobPostings,
}: StatsCardsProps) {
    // Calculate stats
    const totalApplicants = applicants.length;
    const totalJobs = jobPostings.length;

    // Count applications by status
    const statusCounts = applicants.reduce(
        (counts: Record<string, number>, applicant: any) => {
            const status = applicant.application.status;
            counts[status] = (counts[status] || 0) + 1;
            return counts;
        },
        {}
    );

    const stats = [
        {
            title: "Total Applicants",
            value: totalApplicants,
            icon: Users,
            color: "text-blue-500",
            bgColor: "bg-blue-50",
        },
        {
            title: "Job Postings",
            value: totalJobs,
            icon: Briefcase,
            color: "text-indigo-500",
            bgColor: "bg-indigo-50",
        },
        {
            title: "Shortlisted",
            value: statusCounts.shortlisted || 0,
            icon: Star,
            color: "text-yellow-500",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Hired",
            value: statusCounts.hired || 0,
            icon: UserCheck,
            color: "text-green-500",
            bgColor: "bg-green-50",
        },
        {
            title: "Rejected",
            value: statusCounts.rejected || 0,
            icon: X,
            color: "text-red-500",
            bgColor: "bg-red-50",
        },
        {
            title: "Pending",
            value: statusCounts.pending || 0,
            icon: Clock,
            color: "text-orange-500",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {stats.map((stat, index) => (
                <Card key={index} className="border shadow-sm">
                    <CardContent className="p-4 flex flex-col items-center">
                        <div
                            className={`${stat.bgColor} ${stat.color} p-2 rounded-full mb-2`}
                        >
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div className="text-2xl font-semibold">
                            {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground text-center">
                            {stat.title}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
