import { Head } from "@inertiajs/react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, Search } from "lucide-react";
import JobPostCard from "./components/JobPostCard";
import SearchBar from "./components/SearchBar";
import JobPostsPagination from "./components/JobPostsPagination";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";

interface SearchResultsProps {
    jobs: {
        data: any[];
        meta?: {
            current_page: number;
            last_page: number;
            total: number;
        };
    };
    searchTerm: string;
    filters: any;
}

export default function SearchResults({
    jobs,
    searchTerm,
    filters,
}: SearchResultsProps) {
    const currentPage = jobs.meta?.current_page ?? 1;
    const totalPages = jobs.meta?.last_page ?? 1;
    const totalResults = jobs.meta?.total ?? 0;

    // Check if we have valid job data
    const hasResults = Array.isArray(jobs.data) && jobs.data.length > 0;

    // Check if we have pagination data
    const hasPagination = jobs.meta !== undefined && totalPages > 1;

    const handlePageChange = (page: number) => {
        // Update current page via Inertia
        const currentFilters = { ...filters, page };
        window.location.href = `/browse/job-posts/search?${new URLSearchParams(
            currentFilters as Record<string, string>
        ).toString()}`;
    };

    return (
        <AgencyLayout sidebarDefaultOpen={false}>
            <Head title={`Search Results for "${searchTerm}" | Browse Jobs`} />

            <div className="pt-4 pb-32 px-4 sm:px-24 sm:pt-12">
                <div className="container mx-auto py-6 space-y-6">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.history.back()}
                            className="mb-4"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back
                        </Button>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Search Results
                        </h1>
                        <p className="mt-2 text-muted-foreground text-base max-w-xl">
                            {hasResults
                                ? `Found ${jobs.data.length} ${
                                      jobs.data.length === 1 ? "job" : "jobs"
                                  } matching "${searchTerm}"`
                                : `No jobs found matching "${searchTerm}"`}
                        </p>
                    </div>

                    <SearchBar initialSearchTerm={searchTerm} />

                    {!hasResults ? (
                        <Alert className="bg-muted/50 my-8">
                            <Search className="h-5 w-5" />
                            <AlertTitle>No results found</AlertTitle>
                            <AlertDescription>
                                We couldn't find any job posts matching your
                                search criteria. Try adjusting your search terms
                                or filters.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {jobs.data.map((job) => (
                                    <JobPostCard
                                        key={job.id}
                                        job={job}
                                        featured={false}
                                    />
                                ))}
                            </div>

                            {hasPagination && (
                                <JobPostsPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </AgencyLayout>
    );
}
