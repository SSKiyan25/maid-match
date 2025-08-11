import { useState, useEffect } from "react";
import { Head, Link } from "@inertiajs/react";
import EmployerLayout from "@/Layouts/EmployerLayout";
import ApplicantsFilter from "./components/ApplicantsFilter";
import ApplicantsList from "./components/ApplicantsList";
import StatsCards from "./components/StatsCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Button } from "@/Components/ui/button";
import { Filter, ClipboardList, Check } from "lucide-react";
import { Separator } from "@/Components/ui/separator";

export default function JobApplicationsPage({
    allApplicants = [],
    jobPostings = [],
}: any) {
    const [filteredApplicants, setFilteredApplicants] = useState(allApplicants);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        // Filter applicants when job selection changes
        if (selectedJobId === null) {
            setFilteredApplicants(allApplicants);
        } else {
            setFilteredApplicants(
                allApplicants.filter(
                    (app: any) => app.job_posting_id === selectedJobId
                )
            );
        }
    }, [allApplicants, selectedJobId]);

    return (
        <EmployerLayout>
            <Head title="Job Applications | Employer Portal" />
            <div className="p-4 pb-48 px-4 mx-auto py-8 max-w-sm sm:container sm:max-w-full sm:py-12">
                {/* Header with navigation links */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl font-bold mb-2 text-secondary-foreground sm:text-4xl">
                            Job Applications
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            View and manage all job applications received.
                        </p>
                    </div>

                    {/* Navigation shortcuts - Desktop */}
                    <div className="hidden sm:flex items-start gap-3">
                        <div className="flex flex-col items-center">
                            <Button variant="outline" size="sm" asChild>
                                <Link
                                    href={route(
                                        "employer.shortlist-ranking.index"
                                    )}
                                >
                                    <ClipboardList className="h-4 w-4 mr-2" />
                                    Shortlisted
                                </Link>
                            </Button>
                            <span className="text-xs text-muted-foreground mt-1">
                                Manage candidates you've shortlisted
                            </span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Button variant="outline" size="sm" asChild>
                                <Link
                                    href={route(
                                        "employer.hired-applicants.index"
                                    )}
                                >
                                    <Check className="h-4 w-4 mr-2" />
                                    Hired
                                </Link>
                            </Button>
                            <span className="text-xs text-muted-foreground mt-1">
                                See all candidates you've hired
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navigation shortcuts - Mobile */}
                <div className="flex sm:hidden gap-2 mb-4">
                    <div className="flex-1 flex flex-col items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-9 text-xs"
                            asChild
                        >
                            <Link
                                href={route("employer.shortlist-ranking.index")}
                            >
                                <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
                                Shortlisted
                            </Link>
                        </Button>
                        <span className="text-[10px] text-muted-foreground mt-1">
                            Manage shortlisted candidates
                        </span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-9 text-xs"
                            asChild
                        >
                            <Link
                                href={route("employer.hired-applicants.index")}
                            >
                                <Check className="h-3.5 w-3.5 mr-1.5" />
                                Hired
                            </Link>
                        </Button>
                        <span className="text-[10px] text-muted-foreground mt-1">
                            See all candidates you've hired
                        </span>
                    </div>
                </div>

                <Separator className="my-4" />

                <StatsCards
                    applicants={allApplicants}
                    jobPostings={jobPostings}
                />

                {/* Mobile filter button */}
                <div className="flex justify-between items-center mb-4 px-4">
                    <p className="text-sm">
                        {filteredApplicants.length} applicant
                        {filteredApplicants.length !== 1 ? "s" : ""}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-xs"
                    >
                        <Filter className="h-3.5 w-3.5 mr-1.5" />
                        Filter
                    </Button>
                </div>

                {/* Job tabs - scrollable on mobile */}
                <div className="w-full overflow-x-auto pb-2">
                    <Tabs defaultValue="all" className="w-full min-w-max ">
                        <TabsList className="h-9">
                            <TabsTrigger
                                value="all"
                                className="text-xs h-8 px-3"
                                onClick={() => setSelectedJobId(null)}
                            >
                                All Jobs
                            </TabsTrigger>

                            {Array.from(
                                new Map(
                                    allApplicants.map((app: any) => [
                                        app.job_posting_id,
                                        app.job_title,
                                    ])
                                ).entries()
                            ).map(([id, title]) => (
                                <TabsTrigger
                                    key={String(id)}
                                    value={`job-${id}`}
                                    className="text-xs h-8 px-3"
                                    onClick={() => setSelectedJobId(Number(id))}
                                >
                                    {String(title)}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
                <p className="text-muted-foreground text-[12px] ml-2 mb-8">
                    Scroll to see more of your job postings that have
                    applicants.
                </p>

                {/* Filter panel (only visible when showFilters is true) */}
                {showFilters && (
                    <ApplicantsFilter
                        onClose={() => setShowFilters(false)}
                        onFilter={(filtered: any) =>
                            setFilteredApplicants(filtered)
                        }
                        allApplicants={allApplicants}
                        selectedJobId={selectedJobId}
                    />
                )}

                {/* Applicants list */}
                <ApplicantsList
                    applicants={filteredApplicants}
                    jobPostings={jobPostings}
                />

                {/* Empty state */}
                {filteredApplicants.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            No applicants found
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setSelectedJobId(null);
                                setShowFilters(false);
                                setFilteredApplicants(allApplicants);
                            }}
                        >
                            Reset Filters
                        </Button>
                    </div>
                )}
            </div>
        </EmployerLayout>
    );
}
