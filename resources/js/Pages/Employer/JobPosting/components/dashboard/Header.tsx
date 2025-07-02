import { Link } from "@inertiajs/react";
import { Plus, Briefcase, Users, Archive, FileText } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";

interface JobPostingHeaderProps {
    stats: {
        total: number;
        active: number;
        archived: number;
        totalApplications: number;
    };
}

export default function JobPostingHeader({ stats }: JobPostingHeaderProps) {
    return (
        <div className="space-y-6 mb-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <Briefcase className="w-8 h-8 text-primary" />
                        My Job Postings
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and track your job postings and applications
                    </p>
                </div>
                <Link href={route("employer.job-postings.create")}>
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Job Posting
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Jobs
                                </p>
                                <p className="text-2xl font-bold">
                                    {stats.total}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Briefcase className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Active
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {stats.active}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Archive className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Archived
                                </p>
                                <p className="text-2xl font-bold text-gray-600">
                                    {stats.archived}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Applications
                                </p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {stats.totalApplications}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
