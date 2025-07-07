import { Head, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import EmployerLayout from "../../../Layouts/EmployerLayout";
import JobPostingHeader from "./components/dashboard/Header";
import JobPostingFilters from "./components/dashboard/Filters";
import JobPostingList from "./components/dashboard/List";
import { JobPosting } from "./utils/types";

export default function JobPostingIndex() {
    const { props } = usePage();
    const flash = (props as { flash?: { success?: string } }).flash || {};
    const jobPostings = (usePage().props as any).jobPostings as JobPosting[];
    console.log("Job Postings:", jobPostings);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<
        "all" | "active" | "archived"
    >("all");
    const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">(
        "newest"
    );

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
    }, [flash.success]);

    // Filter and sort job postings
    const filteredAndSortedJobs = jobPostings
        .filter((job) => {
            // Search filter
            const matchesSearch =
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.work_types.some((type) =>
                    type.toLowerCase().includes(searchTerm.toLowerCase())
                );

            // Status filter
            let matchesStatus = false;
            if (statusFilter === "all") {
                matchesStatus = !job.is_archived; // Only active jobs
            } else if (statusFilter === "archived") {
                matchesStatus = job.is_archived;
            } else if (statusFilter === "active") {
                matchesStatus = !job.is_archived;
            }

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return (
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    );
                case "oldest":
                    return (
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                    );
                case "title":
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });

    const stats = {
        total: jobPostings.length,
        active: jobPostings.filter((job) => !job.is_archived).length,
        archived: jobPostings.filter((job) => job.is_archived).length,
        totalApplications: jobPostings.reduce(
            (sum, job) => sum + (job.applications_count || 0),
            0
        ),
    };

    return (
        <>
            <EmployerLayout>
                <Head title="Job Postings" />
                <div className="w-full mx-auto px-6 sm:px-6 lg:px-8 pb-28 pt-12">
                    <div className="flex flex-col space-y-4">
                        <JobPostingHeader stats={stats} />

                        <JobPostingFilters
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            statusFilter={statusFilter}
                            onStatusChange={setStatusFilter}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />

                        <JobPostingList jobPostings={filteredAndSortedJobs} />
                    </div>
                </div>
            </EmployerLayout>
        </>
    );
}
