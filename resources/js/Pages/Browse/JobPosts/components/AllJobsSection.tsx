import { useState } from "react";
import { router } from "@inertiajs/react";
import JobPostsList from "./JobPostsList";
import JobPostsPagination from "./JobPostsPagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { AlertCircle } from "lucide-react";

interface AllJobsSectionProps {
    jobPosts: {
        data: any[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
            from: number;
            to: number;
        };
    };
}

export default function AllJobsSection({ jobPosts }: AllJobsSectionProps) {
    const [sortBy, setSortBy] = useState("newest");

    // Check if job posts array is empty
    const isEmpty = !jobPosts?.data || jobPosts.data.length === 0;

    // Get pagination data from the meta information
    const currentPage = jobPosts?.meta?.current_page || 1;
    const totalPages = jobPosts?.meta?.last_page || 1;
    const totalJobs = jobPosts?.meta?.total || 0;

    const handleSortChange = (value: string) => {
        setSortBy(value);

        // Map the frontend sort options to backend parameters
        let sortParams = {};
        switch (value) {
            case "newest":
                sortParams = { sort_by: "created_at", sort_direction: "desc" };
                break;
            case "oldest":
                sortParams = { sort_by: "created_at", sort_direction: "asc" };
                break;
            case "salary_high":
                sortParams = { sort_by: "max_salary", sort_direction: "desc" };
                break;
            case "salary_low":
                sortParams = { sort_by: "min_salary", sort_direction: "asc" };
                break;
        }

        // Use Inertia to reload with the sort parameters
        router.get("/browse/job-posts", sortParams, {
            preserveState: true,
            preserveScroll: true,
            only: ["jobPosts"],
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            "/browse/job-posts",
            { page },
            {
                preserveState: true,
                preserveScroll: true,
                only: ["jobPosts"],
            }
        );
    };

    return (
        <section className="space-y-6 w-full pt-12">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">All Job Posts</h2>

                {!isEmpty && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                            Sort by:
                        </span>
                        <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">
                                    Newest First
                                </SelectItem>
                                <SelectItem value="oldest">
                                    Oldest First
                                </SelectItem>
                                <SelectItem value="salary_high">
                                    Highest Salary
                                </SelectItem>
                                <SelectItem value="salary_low">
                                    Lowest Salary
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {isEmpty ? (
                <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed rounded-lg">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                        No job postings available
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                        There are currently no job postings available. Please
                        check back later or adjust your search criteria.
                    </p>
                </div>
            ) : (
                <>
                    <JobPostsList
                        jobs={jobPosts.data}
                        emptyMessage="No job posts found"
                    />

                    <JobPostsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </section>
    );
}
