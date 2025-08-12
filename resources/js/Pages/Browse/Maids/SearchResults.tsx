import { useState, useEffect } from "react";
import { Head, router, Link } from "@inertiajs/react";
import EmployerLayout from "@/Layouts/EmployerLayout";
import { Button } from "@/Components/ui/button";
import { ChevronLeft } from "lucide-react";
import PaginationComponent from "@/Components/PaginationComponent";
import { Separator } from "@/Components/ui/separator";
import SearchBar from "./components/ForSearchResults/SearchBar";
import SearchFilters from "./components/ForSearchResults/SearchFilters";
import SearchResultsList from "./components/ForSearchResults/SearchResultsList";

interface SearchResultsProps {
    maids: any[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    query: string;
    sortOrder: "match" | "recent" | "name";
    job_postings: any[];
    selectedJobPosting?: string | null;
    filterOptions?: {
        skills: string[];
        languages: string[];
    };
}

export default function SearchResults({
    maids,
    pagination,
    query,
    sortOrder = "match",
    job_postings,
    selectedJobPosting = null,
    filterOptions = { skills: [], languages: [] },
}: SearchResultsProps) {
    console.log("Search Results Props:", {
        maids,
        pagination,
        query,
        sortOrder,
        job_postings,
        selectedJobPosting,
        filterOptions,
    });
    const [searchTerm, setSearchTerm] = useState(query);
    const [currentPage, setCurrentPage] = useState(pagination.current_page);
    const [currentSort, setCurrentSort] = useState<"match" | "recent" | "name">(
        sortOrder
    );
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedJob, setSelectedJob] = useState<string | null>(
        selectedJobPosting
    );

    const handleSearch = (term: string) => {
        setIsLoading(true);
        router.visit(route("browse.maids.search"), {
            method: "get",
            data: {
                query: term,
                sort_by: currentSort,
                job_posting_id: selectedJob,
                skills: selectedSkills,
                languages: selectedLanguages,
                page: 1, // Reset to first page on new search
            },
            preserveState: true,
            onSuccess: () => setIsLoading(false),
            onError: () => setIsLoading(false),
        });
    };

    const handleSortChange = (value: "match" | "recent" | "name") => {
        setCurrentSort(value);
        setIsLoading(true);
        router.visit(route("browse.maids.search"), {
            data: {
                query: searchTerm,
                sort_by: value,
                job_posting_id: selectedJob,
                skills: selectedSkills,
                languages: selectedLanguages,
                page: currentPage,
            },
            preserveState: true,
            onSuccess: () => setIsLoading(false),
            onError: () => setIsLoading(false),
        });
    };

    const handleSkillsChange = (skills: string[]) => {
        setSelectedSkills(skills);
        updateFilters(skills, selectedLanguages, selectedJob);
    };

    const handleLanguagesChange = (languages: string[]) => {
        setSelectedLanguages(languages);
        updateFilters(selectedSkills, languages, selectedJob);
    };

    const handleJobPostingChange = (jobId: string | null) => {
        setSelectedJob(jobId);
        updateFilters(selectedSkills, selectedLanguages, jobId);
    };

    const updateFilters = (
        skills: string[],
        languages: string[],
        jobId: string | null
    ) => {
        setIsLoading(true);
        router.visit(route("browse.maids.search"), {
            data: {
                query: searchTerm,
                sort_by: currentSort,
                job_posting_id: jobId,
                skills: skills,
                languages: languages,
                page: 1, // Reset to first page on filter change
            },
            preserveState: true,
            onSuccess: () => setIsLoading(false),
            onError: () => setIsLoading(false),
        });
    };

    // Handle page changes
    useEffect(() => {
        if (currentPage !== pagination.current_page) {
            setIsLoading(true);
            router.visit(route("browse.maids.search"), {
                data: {
                    query: searchTerm,
                    sort_by: currentSort,
                    job_posting_id: selectedJob,
                    skills: selectedSkills,
                    languages: selectedLanguages,
                    page: currentPage,
                },
                preserveState: true,
                onSuccess: () => setIsLoading(false),
                onError: () => setIsLoading(false),
            });
        }
    }, [currentPage]);

    return (
        <EmployerLayout sidebarDefaultOpen={false}>
            <Head title={`Search Results: ${query}`} />

            <div className="container mx-auto px-4 py-6 mb-36 sm:px-12 space-y-6 max-w-6xl">
                {/* Back button and search header */}
                <div className="flex flex-col space-y-4">
                    <Button
                        variant="ghost"
                        className="self-start"
                        onClick={() =>
                            router.visit(route("browse.maids.index"))
                        }
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Browse
                    </Button>

                    <h1 className="text-2xl font-bold">
                        Search Results for "{query}"
                    </h1>

                    <p className="text-muted-foreground">
                        Found {pagination.total} results matching your search
                        criteria
                    </p>
                </div>

                {/* Search and filter section */}
                <div className="space-y-4">
                    <SearchBar
                        initialValue={query}
                        onSearch={handleSearch}
                        isLoading={isLoading}
                    />

                    <SearchFilters
                        skills={filterOptions.skills}
                        languages={filterOptions.languages}
                        selectedSkills={selectedSkills}
                        selectedLanguages={selectedLanguages}
                        onSkillsChange={handleSkillsChange}
                        onLanguagesChange={handleLanguagesChange}
                        jobPostings={job_postings}
                        selectedJobPosting={selectedJob}
                        onJobPostingChange={handleJobPostingChange}
                        sortOrder={currentSort}
                        onSortOrderChange={handleSortChange}
                        isLoading={isLoading}
                    />
                </div>

                <Separator />

                {/* Results */}
                <SearchResultsList
                    maids={maids}
                    isLoading={isLoading}
                    selectedJobId={selectedJob}
                    emptyMessage="No maids match your search criteria. Try adjusting your search terms or filters."
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
            </div>
        </EmployerLayout>
    );
}
