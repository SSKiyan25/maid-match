import { useState } from "react";
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
    jobPosts: any[];
}

export default function AllJobsSection({ jobPosts }: AllJobsSectionProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("newest");

    // Check if job posts array is empty
    const isEmpty = !jobPosts || jobPosts.length === 0;

    // Later, we would implement proper pagination or infinite scrolling
    const ITEMS_PER_PAGE = 8;
    const totalPages = Math.ceil((jobPosts?.length || 0) / ITEMS_PER_PAGE);

    // Sort jobs based on selected option
    const sortedJobs = isEmpty
        ? []
        : [...jobPosts].sort((a, b) => {
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
                  case "salary_high":
                      return (
                          parseFloat(b.max_salary) - parseFloat(a.max_salary)
                      );
                  case "salary_low":
                      return (
                          parseFloat(a.min_salary) - parseFloat(b.min_salary)
                      );
                  default:
                      return 0;
              }
          });

    // Get current page items
    const currentJobs = sortedJobs.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <section className="space-y-6 w-full pt-12">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">All Job Posts</h2>

                {!isEmpty && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground hidden sm:inline">
                            Sort by:
                        </span>
                        <Select value={sortBy} onValueChange={setSortBy}>
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
                        jobs={currentJobs}
                        emptyMessage="No job posts found"
                    />

                    <JobPostsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </section>
    );
}
