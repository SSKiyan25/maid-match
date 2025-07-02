import { Link } from "@inertiajs/react";
import { useState } from "react";
import {
    Edit2,
    Archive,
    MapPin,
    Users,
    Calendar,
    PhilippinePeso,
    Eye,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { JobPosting } from "../../utils/types";
import JobViewModal from "./JobViewModal";
import JobArchiveModal from "./JobArchiveModal";

interface JobPostingListProps {
    jobPostings: JobPosting[];
}

export default function JobPostingList({ jobPostings }: JobPostingListProps) {
    const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

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

    const handleViewJob = (job: JobPosting) => {
        setSelectedJob(job);
        setIsViewModalOpen(true);
    };

    const handleArchiveJob = (job: JobPosting) => {
        setSelectedJob(job);
        setIsArchiveModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedJob(null);
    };

    const handleCloseArchiveModal = () => {
        setIsArchiveModalOpen(false);
        setSelectedJob(null);
    };

    if (jobPostings.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <div className="text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No job postings found
                        </h3>
                        <p>Create your first job posting to get started!</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobPostings.map((job) => (
                    <Card
                        key={job.id}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg line-clamp-2">
                                    {job.title}
                                </CardTitle>
                                <Badge
                                    variant={
                                        job.is_archived
                                            ? "secondary"
                                            : "default"
                                    }
                                >
                                    {job.is_archived ? "Archived" : "Active"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Work Types */}
                            <div className="flex flex-wrap gap-1">
                                {job.work_types
                                    .slice(0, 3)
                                    .map((type, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="text-xs capitalize"
                                        >
                                            {type}
                                        </Badge>
                                    ))}
                                {job.work_types.length > 3 && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs"
                                    >
                                        +{job.work_types.length - 3} more
                                    </Badge>
                                )}
                            </div>

                            {/* Location */}
                            {job.location && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {job.location.city}, {job.location.province}
                                </div>
                            )}

                            {/* Salary */}
                            <div className="flex items-center text-sm text-muted-foreground">
                                <PhilippinePeso className="w-4 h-4 mr-1" />
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
                            </div>

                            {/* Bonuses */}
                            {job.bonuses && job.bonuses.length > 0 && (
                                <div className="flex flex-wrap gap-1 items-center text-xs text-secondary-foreground">
                                    <span className="font-medium">
                                        Bonuses:
                                    </span>
                                    {job.bonuses.map((bonus, idx) => (
                                        <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="bg-secondary/70 text-secondary-foreground border-secondary"
                                        >
                                            {bonus.title}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {job.applications_count || 0} Applications
                                </div>
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {formatDate(job.created_at)}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                {/* Edit Button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 max-w-[80px] justify-center"
                                    asChild
                                >
                                    <Link
                                        href={route(
                                            "employer.job-postings.edit",
                                            job.id
                                        )}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span className="text-xs">Edit</span>
                                    </Link>
                                </Button>
                                {/* View Button */}
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="flex-1 min-w-[100px] justify-center"
                                    onClick={() => handleViewJob(job)}
                                >
                                    <Eye className="w-5 h-5" />
                                    <span>View</span>
                                </Button>
                                {/* Archive Button */}
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="flex-1 max-w-[80px] justify-center"
                                    onClick={() => handleArchiveJob(job)}
                                >
                                    <Archive className="w-4 h-4" />
                                    <span className="text-xs">Archive</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Modals */}
            <JobViewModal
                job={selectedJob}
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
            />

            <JobArchiveModal
                job={selectedJob}
                isOpen={isArchiveModalOpen}
                onClose={handleCloseArchiveModal}
            />
        </>
    );
}
