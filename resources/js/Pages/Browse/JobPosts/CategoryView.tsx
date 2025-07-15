import React from "react";
import { usePage, Head } from "@inertiajs/react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import { Button } from "@/Components/ui/button";
import { ChevronLeft } from "lucide-react";
import JobPostCard from "./components/JobPostCard";
import SearchBar from "./components/SearchBar";
import JobPostsPagination from "./components/JobPostsPagination";

interface CategoryViewProps {
    category: string;
    jobs: any[];
    title: string;
    description?: string;
}

export default function CategoryView({
    category,
    jobs = [],
    title,
    description,
}: CategoryViewProps) {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 12;

    const paginatedJobs = jobs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(jobs.length / itemsPerPage);

    return (
        <AgencyLayout sidebarDefaultOpen={false}>
            <Head title={`${title} | Browse Jobs`} />

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
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-2 text-muted-foreground text-base max-w-xl">
                                {description}
                            </p>
                        )}
                    </div>

                    <SearchBar />

                    {jobs.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">
                                No jobs found in this category
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {paginatedJobs.map((job) => (
                                    <JobPostCard
                                        key={job.id}
                                        job={job}
                                        featured={category === "recommended"}
                                    />
                                ))}
                            </div>

                            <JobPostsPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </div>
        </AgencyLayout>
    );
}
