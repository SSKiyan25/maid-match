import { useState, useEffect } from "react";
import { Head, usePage, Link } from "@inertiajs/react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import ApplicationsHeader from "./components/Applications/Header";
import ApplicationsFilters from "./components/Applications/Filters";
import ApplicationCard from "./components/Applications/Card";
import EmptyState from "./components/Applications/EmptyState";
import StatsCard from "./components/Applications/StatsCard";
import { Separator } from "@/Components/ui/separator";
import { Button } from "@/Components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { ChevronLeft, ChevronRight, Grid, List } from "lucide-react";

export default function AgencyApplicationsPage({ applications }: any) {
    const [filteredApplications, setFilteredApplications] = useState(
        applications.data || []
    );
    const { props } = usePage();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [jobPostingFilter, setJobPostingFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const itemsPerPage = viewMode === "grid" ? 9 : 6;

    // Stats calculations
    const totalApplications = applications.data?.length || 0;
    const pendingApplications =
        applications.data?.filter(
            (app: any) =>
                app.status === "pending" || app.status === "pending_review"
        ).length || 0;
    const shortlistedApplications =
        applications.data?.filter((app: any) => app.status === "shortlisted")
            .length || 0;
    const rejectedApplications =
        applications.data?.filter((app: any) => app.status === "rejected")
            .length || 0;
    const hiredApplications =
        applications.data?.filter((app: any) => app.status === "hired")
            .length || 0;

    // Apply filters when search or status filter changes
    useEffect(() => {
        setIsLoading(true);
        setCurrentPage(1); // Reset to first page when filters change

        const filtered = (applications.data || []).filter((app: any) => {
            // Status filter
            if (statusFilter !== "all" && app.status !== statusFilter) {
                return false;
            }

            // Job posting filter
            if (
                jobPostingFilter !== "all" &&
                app.job_posting_id.toString() !== jobPostingFilter
            ) {
                return false;
            }

            // Search term filter (search in maid name or job title)
            if (searchTerm) {
                const maidName = `${app.maid.user?.profile?.first_name || ""} ${
                    app.maid.user?.profile?.last_name || ""
                }`.toLowerCase();
                const jobTitle = app.job_posting?.title?.toLowerCase() || "";

                return (
                    maidName.includes(searchTerm.toLowerCase()) ||
                    jobTitle.includes(searchTerm.toLowerCase())
                );
            }

            return true;
        });

        setFilteredApplications(filtered);

        // Simulate loading for better UX
        setTimeout(() => setIsLoading(false), 300);
    }, [applications, searchTerm, statusFilter, jobPostingFilter]);

    // Pagination calculation
    const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
    const paginatedApplications = filteredApplications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxPagesToShow / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        if (startPage > 1) {
            pageNumbers.push(
                <Button
                    key="first"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                >
                    1
                </Button>
            );
            if (startPage > 2) {
                pageNumbers.push(
                    <span key="ellipsis1" className="px-2">
                        ...
                    </span>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i)}
                >
                    {i}
                </Button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(
                    <span key="ellipsis2" className="px-2">
                        ...
                    </span>
                );
            }
            pageNumbers.push(
                <Button
                    key="last"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                >
                    {totalPages}
                </Button>
            );
        }

        return pageNumbers;
    };

    return (
        <AgencyLayout>
            <Head title="Maid Applications | Agency Portal" />

            <div className="container px-4 pb-48 mx-auto max-w-7xl py-6 space-y-6">
                <ApplicationsHeader applications={applications.data} />

                {/* Stats Section - Better mobile layout */}
                <div className="space-y-2 md:space-y-4">
                    {/* Total Applications - Full width on mobile */}
                    <div className="w-full">
                        <StatsCard
                            title="Total Applications"
                            value={totalApplications}
                            description="All time"
                            type="total"
                            className="w-full bg-primary/5 border-primary/20"
                        />
                    </div>

                    {/* Other stats - 2x2 grid on mobile, 4 columns on desktop */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                        <StatsCard
                            title="Pending Review"
                            value={pendingApplications}
                            description="Awaiting action"
                            type="pending"
                        />
                        <StatsCard
                            title="Shortlisted"
                            value={shortlistedApplications}
                            description="For interview"
                            type="shortlisted"
                        />
                        <StatsCard
                            title="Hired"
                            value={hiredApplications}
                            description="Successfully placed"
                            type="hired"
                        />
                        <StatsCard
                            title="Rejected"
                            value={rejectedApplications}
                            description="Not suitable"
                            type="rejected"
                        />
                    </div>
                </div>

                <Separator className="my-6" />

                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <ApplicationsFilters
                        onSearchChange={setSearchTerm}
                        onStatusChange={setStatusFilter}
                        onJobPostingChange={setJobPostingFilter}
                        statusFilter={statusFilter}
                        jobPostingFilter={jobPostingFilter}
                        searchTerm={searchTerm}
                        totalCount={filteredApplications.length}
                        applications={applications.data || []}
                    />

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 ml-auto">
                        <span className="text-sm text-muted-foreground">
                            View:
                        </span>
                        <Button
                            variant={
                                viewMode === "grid" ? "default" : "outline"
                            }
                            size="icon"
                            onClick={() => setViewMode("grid")}
                            className="size-8"
                        >
                            <Grid size={16} />
                        </Button>
                        <Button
                            variant={
                                viewMode === "list" ? "default" : "outline"
                            }
                            size="icon"
                            onClick={() => setViewMode("list")}
                            className="size-8"
                        >
                            <List size={16} />
                        </Button>
                    </div>
                </div>

                {/* Display instruction tips */}
                <div className="text-sm text-muted-foreground bg-muted/40 p-3 rounded-md">
                    <p>
                        Each application card has two sections:{" "}
                        <strong>Job Post</strong> (what the employer is looking
                        for) and <strong>Applicant</strong> (the maid applying
                        for the job). Use filters to narrow your results.
                    </p>
                </div>

                {isLoading ? (
                    <div
                        className={`grid ${
                            viewMode === "grid"
                                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                : "grid-cols-1"
                        } gap-4 mt-6 opacity-50`}
                    >
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className={`${
                                    viewMode === "grid" ? "h-48" : "h-32"
                                } bg-muted animate-pulse rounded-lg`}
                            ></div>
                        ))}
                    </div>
                ) : filteredApplications.length > 0 ? (
                    <>
                        <div
                            className={`grid ${
                                viewMode === "grid"
                                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                    : "grid-cols-1"
                            } gap-4 mt-6`}
                        >
                            {paginatedApplications.map((application: any) => (
                                <ApplicationCard
                                    key={application.id}
                                    application={application}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.max(1, prev - 1)
                                        )
                                    }
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={16} />
                                </Button>

                                <div className="flex items-center gap-1">
                                    {renderPageNumbers()}
                                </div>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(totalPages, prev + 1)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState
                        onReset={() => {
                            setSearchTerm("");
                            setStatusFilter("all");
                            setJobPostingFilter("all");
                        }}
                    />
                )}
            </div>
        </AgencyLayout>
    );
}
