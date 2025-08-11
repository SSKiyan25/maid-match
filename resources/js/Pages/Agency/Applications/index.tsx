import { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import ApplicationsHeader from "./components/Applications/Header";
import ApplicationsFilters from "./components/Applications/Filters";
import ApplicationCard from "./components/Applications/Card";
import EmptyState from "./components/Applications/EmptyState";
import { Separator } from "@/Components/ui/separator";

export default function AgencyApplicationsPage({ applications }: any) {
    const [filteredApplications, setFilteredApplications] = useState(
        applications.data || []
    );
    const { props } = usePage();
    // console.log("Application Props", props);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [jobPostingFilter, setJobPostingFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(false);

    // Apply filters when search or status filter changes
    useEffect(() => {
        // console.log("Props", applications);
        setIsLoading(true);

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

    return (
        <AgencyLayout>
            <Head title="Maid Applications | Agency Portal" />

            <div className="container px-4 pb-48 mx-auto max-w-7xl py-6 space-y-6">
                <ApplicationsHeader applications={applications.data} />

                <Separator className="my-6" />

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

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 opacity-50">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="h-48 bg-muted animate-pulse rounded-lg"
                            ></div>
                        ))}
                    </div>
                ) : filteredApplications.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                        {filteredApplications.map((application: any) => (
                            <ApplicationCard
                                key={application.id}
                                application={application}
                            />
                        ))}
                    </div>
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
