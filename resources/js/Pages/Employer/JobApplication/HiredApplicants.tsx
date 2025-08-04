import { useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import EmployerLayout from "@/Layouts/EmployerLayout";
import HiredApplicantCard from "./components/Hired/Card";
import HiredApplicantDetailsModal from "./components/Hired/DetailsModal";
import EmptyState from "./components/Hired/EmptyState";
import SearchAndFilters from "./components/Hired/SearchAndFilters";

interface HiredApplicantsProps {
    hiredApplicants: any[];
    jobPostings: any[];
}

export default function HiredApplicants({
    hiredApplicants,
    jobPostings,
}: HiredApplicantsProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [filteredApplicants, setFilteredApplicants] =
        useState(hiredApplicants);
    const [selectedApplicant, setSelectedApplicant] = useState<any>(null);

    // Filter applicants when search or job filter changes
    useEffect(() => {
        let filtered = hiredApplicants;

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (applicant) =>
                    applicant.application.maid.full_name
                        .toLowerCase()
                        .includes(query) ||
                    applicant.job_title.toLowerCase().includes(query)
            );
        }

        // Filter by selected job
        if (selectedJobId) {
            filtered = filtered.filter(
                (applicant) =>
                    applicant.job_posting_id.toString() === selectedJobId
            );
        }

        setFilteredApplicants(filtered);
    }, [searchQuery, selectedJobId, hiredApplicants]);

    const handleViewDetails = (applicant: any) => {
        setSelectedApplicant(applicant);
    };

    const handleCloseModal = () => {
        setSelectedApplicant(null);
    };

    return (
        <EmployerLayout>
            <Head title="Hired Applicants" />
            <div className="container mx-auto p-4 mb-20 lg:p-6">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Hired Applicants</h1>
                    <p className="text-muted-foreground mt-1">
                        {hiredApplicants.length} applicant
                        {hiredApplicants.length !== 1 ? "s" : ""} hired across{" "}
                        {jobPostings.length} job
                        {jobPostings.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Search and Filters */}
                <SearchAndFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedJobId={selectedJobId}
                    onJobChange={setSelectedJobId}
                    jobPostings={jobPostings}
                />

                {/* Results Count */}
                <div className="mb-4 text-sm text-muted-foreground">
                    Showing {filteredApplicants.length} of{" "}
                    {hiredApplicants.length} hired applicants
                </div>

                {/* Applicants List */}
                {filteredApplicants.length === 0 ? (
                    <EmptyState hasApplicants={hiredApplicants.length > 0} />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredApplicants.map((applicant) => (
                            <HiredApplicantCard
                                key={applicant.application.id}
                                applicant={applicant}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                )}

                {/* Details Modal */}
                <HiredApplicantDetailsModal
                    applicant={selectedApplicant}
                    isOpen={!!selectedApplicant}
                    onClose={handleCloseModal}
                />
            </div>
        </EmployerLayout>
    );
}
