import { useState, useEffect } from "react";
import { Head, router, Link } from "@inertiajs/react";
import EmployerLayout from "@/Layouts/EmployerLayout";
import MaidHeader from "./components/ForIndex/MaidHeader";
import MaidFilters from "./components/ForIndex/MaidFilters";
import MaidFeaturedSection from "./components/ForIndex/MaidFeaturedSection";
import MaidGrid from "./components/ForIndex/MaidGrid";
import { Separator } from "@/Components/ui/separator";
import PaginationComponent from "@/Components/PaginationComponent";
import { BookmarkIcon, MapPin, Sparkles } from "lucide-react";

interface MaidPageProps {
    maids: any[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    job_postings: any[];
    featuredSections: {
        bestMatches?: any[];
        nearbyMaids?: any[];
        recentMaids?: any[];
        jobSpecificMatches?: any[];
        bookmarkedMaids?: any[];
    };
    filterOptions: {
        skills: string[];
        languages: string[];
    };
    activeFilters: {
        search: string;
        skills: string[];
        languages: string[];
        sort_by: "match" | "recent" | "name";
        job_posting_id?: string;
    };
}

export default function MaidsIndexPage({
    maids,
    pagination,
    job_postings,
    featuredSections,
    filterOptions,
    activeFilters,
}: MaidPageProps) {
    console.log("Featured sections:", featuredSections);
    // State for filters - initialized from server data
    const [searchTerm, setSearchTerm] = useState(activeFilters.search);
    const [selectedSkills, setSelectedSkills] = useState<string[]>(
        activeFilters.skills
    );
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
        activeFilters.languages
    );
    const [selectedJobPosting, setSelectedJobPosting] = useState<string | null>(
        activeFilters.job_posting_id || null
    );
    const [sortOrder, setSortOrder] = useState<"match" | "recent" | "name">(
        activeFilters.sort_by || "match"
    );
    const [currentPage, setCurrentPage] = useState(pagination.current_page);
    const [isLoading, setIsLoading] = useState(false);

    // Extract sections from featuredSections
    const {
        bestMatches = [],
        nearbyMaids = [],
        recentMaids = [],
        jobSpecificMatches = [],
        bookmarkedMaids = [],
    } = featuredSections;

    // Handler for filter changes - send to server
    const applyFilters = () => {
        setIsLoading(true);
        router.get(
            route("browse.maids.index"),
            {
                skills: selectedSkills,
                languages: selectedLanguages,
                job_posting_id: selectedJobPosting,
                sort_by: sortOrder,
                page: currentPage,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: [
                    "maids",
                    "pagination",
                    "featuredSections",
                    "activeFilters",
                ],
                onSuccess: () => {
                    setIsLoading(false); // Set loading to false on success
                },
                onError: () => {
                    setIsLoading(false); // Set loading to false on error
                },
            }
        );
    };

    // Apply filters when they change
    useEffect(() => {
        // Debounce timer for search
        const handler = setTimeout(() => {
            setCurrentPage(1); // Reset to page 1 when filters change
            applyFilters();
        }, 300);

        return () => clearTimeout(handler);
    }, [selectedSkills, selectedLanguages, selectedJobPosting, sortOrder]);

    // Handle page changes
    useEffect(() => {
        if (currentPage !== pagination.current_page) {
            applyFilters();
        }
    }, [currentPage]);

    return (
        <EmployerLayout sidebarDefaultOpen={false}>
            <Head title="Browse Maids" />

            <div className="container mx-auto px-4 py-6 mb-36 sm:px-12 space-y-8 max-w-sm sm:max-w-6xl overflow-x-hidden">
                <MaidHeader
                    searchTerm={searchTerm}
                    totalMatches={pagination.total}
                />

                {/* Bookmarked Maids Section */}
                {bookmarkedMaids.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center">
                                <BookmarkIcon className="h-6 w-6 mr-2 text-rose-500" />
                                Your Bookmarked Maids
                            </h2>
                            <Link
                                href={route("browse.maids.all.bookmarked")}
                                className="text-primary text-sm hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                        <MaidFeaturedSection maids={bookmarkedMaids} />
                    </section>
                )}

                {/* Best Matches Section */}
                {bestMatches.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center">
                                <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
                                Best Matches
                            </h2>
                            <Link
                                href={
                                    selectedJobPosting
                                        ? route(
                                              "browse.maids.all.best-matches",
                                              {
                                                  job_posting_id:
                                                      selectedJobPosting,
                                              }
                                          )
                                        : route("browse.maids.all.best-matches")
                                }
                                className="text-primary text-sm hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                        <MaidFeaturedSection
                            maids={bestMatches}
                            highlightMatch={true}
                        />
                    </section>
                )}

                {/* Nearby Maids Section */}
                {nearbyMaids.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center">
                                <MapPin className="h-6 w-6 mr-2 text-blue-500" />
                                Maids Near You
                            </h2>
                            <Link
                                href={route("browse.maids.all.nearby")}
                                className="text-primary text-sm hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                        <MaidFeaturedSection
                            maids={nearbyMaids}
                            highlightLocation={true}
                        />
                    </section>
                )}

                {/* Recently Added Section */}
                {recentMaids.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                Recently Added
                            </h2>
                        </div>
                        <MaidFeaturedSection
                            maids={recentMaids}
                            highlightNew={true}
                        />
                    </section>
                )}

                <Separator className="my-8" />

                {/* All Maids Section with Filters */}
                <section id="all-maids" className="space-y-6">
                    <h2 className="text-2xl font-bold">
                        {selectedJobPosting
                            ? `All Matches for "${
                                  job_postings.find(
                                      (j) =>
                                          j.id.toString() === selectedJobPosting
                                  )?.title
                              }"`
                            : "All Available Maids"}
                        {isLoading && (
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                Loading...
                            </span>
                        )}
                    </h2>

                    <MaidFilters
                        skills={filterOptions.skills}
                        languages={filterOptions.languages}
                        selectedSkills={selectedSkills}
                        selectedLanguages={selectedLanguages}
                        onSkillsChange={setSelectedSkills}
                        onLanguagesChange={setSelectedLanguages}
                        jobPostings={job_postings}
                        selectedJobPosting={selectedJobPosting}
                        onJobPostingChange={setSelectedJobPosting}
                        sortOrder={sortOrder}
                        onSortOrderChange={setSortOrder}
                        isLoading={isLoading}
                    />

                    <MaidGrid
                        maids={maids}
                        emptyMessage={
                            selectedJobPosting
                                ? "No maids match this job posting criteria"
                                : "No maids match your search criteria"
                        }
                        compact={true}
                        useComputedMatch={true}
                        selectedJobId={selectedJobPosting}
                        isLoading={isLoading}
                    />

                    {/* Pagination */}
                    {pagination.last_page > 1 && (
                        <div className="flex justify-center mt-6">
                            <PaginationComponent
                                currentPage={pagination.current_page}
                                totalPages={pagination.last_page}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </section>
            </div>
        </EmployerLayout>
    );
}
