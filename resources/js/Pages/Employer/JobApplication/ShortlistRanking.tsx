import { usePage, Head } from "@inertiajs/react";
import EmployerLayout from "@/Layouts/EmployerLayout";
import { useState } from "react";
import ShortlistHeader from "./components/Shortlist/Header";
import ShortlistFilters from "./components/Shortlist/Filters";
import ShortlistTable from "./components/Shortlist/Table";
import MaidDetailsModal from "./components/Shortlist/MaidDetailsModal";
import { JobPosting, JobApplication, PageProps } from "@/types";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Info } from "lucide-react";

interface ShortlistRankingPageProps extends PageProps {
    jobPostings: JobPosting[];
    shortlistedApplicants: any[];
}

export default function ShortlistRanking() {
    const { jobPostings, shortlistedApplicants } =
        usePage<ShortlistRankingPageProps>().props;

    console.log("Shortlisted Applicants:", shortlistedApplicants);
    console.log("Job Postings:", jobPostings);
    // State for filters
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // State for maid details modal
    const [selectedMaid, setSelectedMaid] = useState<JobApplication | null>(
        null
    );
    const [selectedJobPosting, setSelectedJobPosting] =
        useState<JobPosting | null>(null);

    // Filter data based on selected job and search query
    const filteredApplicants = shortlistedApplicants
        .filter((app) => !selectedJobId || app.job_posting_id === selectedJobId)
        .filter((app) => {
            if (!searchQuery) return true;
            const searchLower = searchQuery.toLowerCase();
            const maidName =
                app.application.maid.user.full_name?.toLowerCase() || "";
            const jobTitle = app.job_title.toLowerCase();
            const agencyName = app.agency_name?.toLowerCase() || "";

            return (
                maidName.includes(searchLower) ||
                jobTitle.includes(searchLower) ||
                agencyName.includes(searchLower)
            );
        });

    // Group applicants by job posting for the table view
    const applicantsByJob = filteredApplicants.reduce((acc, app) => {
        if (!acc[app.job_posting_id]) {
            acc[app.job_posting_id] = {
                jobId: app.job_posting_id,
                jobTitle: app.job_title,
                applicants: [],
            };
        }
        acc[app.job_posting_id].applicants.push(app);
        return acc;
    }, {} as Record<string, { jobId: number; jobTitle: string; applicants: any[] }>);

    return (
        <EmployerLayout sidebarDefaultOpen={false}>
            <Head title="Shortlisted Candidates" />

            <div className="container mx-auto p-4 mb-48 lg:p-6">
                <ShortlistHeader
                    totalShortlisted={shortlistedApplicants.length}
                    totalJobs={jobPostings.length}
                />

                <ShortlistFilters
                    jobPostings={jobPostings}
                    selectedJobId={selectedJobId}
                    setSelectedJobId={setSelectedJobId}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />

                {shortlistedApplicants.length === 0 ? (
                    <div className="mt-8">
                        <Alert variant="default" className="bg-blue-50">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                You haven't shortlisted any candidates yet. Go
                                to Job Applications to shortlist candidates.
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : filteredApplicants.length === 0 ? (
                    <div className="mt-8">
                        <Alert variant="default" className="bg-blue-50">
                            <Info className="h-4 w-4" />
                            <AlertDescription>
                                No candidates match your current filters. Try
                                adjusting your search or filter criteria.
                            </AlertDescription>
                        </Alert>
                    </div>
                ) : (
                    <div className="mt-6 space-y-8">
                        {(
                            Object.values(applicantsByJob) as {
                                jobId: number;
                                jobTitle: string;
                                applicants: any[];
                            }[]
                        ).map((jobGroup) => {
                            const jobPosting = jobPostings.find(
                                (jp) => jp.id === jobGroup.jobId
                            );
                            return (
                                <ShortlistTable
                                    key={jobGroup.jobId}
                                    jobId={jobGroup.jobId}
                                    jobTitle={jobGroup.jobTitle}
                                    applicants={jobGroup.applicants}
                                    jobPosting={jobPosting}
                                    onViewDetails={(applicant, jobPost) => {
                                        setSelectedMaid(applicant);
                                        setSelectedJobPosting(jobPost);
                                    }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedMaid && (
                <MaidDetailsModal
                    maid={selectedMaid}
                    open={!!selectedMaid}
                    onClose={() => {
                        setSelectedMaid(null);
                        setSelectedJobPosting(null);
                    }}
                    jobPosting={selectedJobPosting}
                />
            )}
        </EmployerLayout>
    );
}
