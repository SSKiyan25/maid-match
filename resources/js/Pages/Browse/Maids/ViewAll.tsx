import { useState } from "react";
import { Head } from "@inertiajs/react";
import EmployerLayout from "@/Layouts/EmployerLayout";
import MaidGrid from "./components/ForIndex/MaidGrid";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import { Input } from "@/Components/ui/input";
import {
    ArrowLeft,
    Search,
    MapPin,
    BookmarkIcon,
    Sparkles,
} from "lucide-react";
import PaginationComponent from "@/Components/PaginationComponent";

interface ViewAllProps {
    maids: any[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    collectionType: "best-matches" | "nearby" | "bookmarked";
    selectedJobId?: string | null;
    jobTitle?: string | null;
}

interface BaseConfig {
    title: string;
    icon: React.ReactNode;
    emptyMessage: string;
}

interface BestMatchesConfig extends BaseConfig {
    showMatchBadge: boolean;
    highlightMatch: boolean;
    showLocationBadge?: never;
    highlightLocation?: never;
    showBookmarked?: never;
}

interface NearbyConfig extends BaseConfig {
    showLocationBadge: boolean;
    highlightLocation: boolean;
    showMatchBadge?: never;
    highlightMatch?: never;
    showBookmarked?: never;
}

interface BookmarkedConfig extends BaseConfig {
    showBookmarked: boolean;
    showMatchBadge?: never;
    highlightMatch?: never;
    showLocationBadge?: never;
    highlightLocation?: never;
}

// Union type of all possible configs
type CollectionConfig = BestMatchesConfig | NearbyConfig | BookmarkedConfig;

export default function ViewAll({
    maids,
    pagination,
    collectionType,
    selectedJobId,
    jobTitle,
}: ViewAllProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(pagination.current_page);
    const [filteredMaids, setFilteredMaids] = useState(maids);
    const [isSearching, setIsSearching] = useState(false);

    // Configuration based on collection type
    const configByType: Record<string, CollectionConfig> = {
        "best-matches": {
            title:
                selectedJobId && jobTitle
                    ? `Best Matches for "${jobTitle}"`
                    : "Best Matches",
            icon: <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />,
            emptyMessage: "No matching maids found for your job postings",
            showMatchBadge: true,
            highlightMatch: true,
        },
        nearby: {
            title: "Maids Near You",
            icon: <MapPin className="h-6 w-6 mr-2 text-blue-500" />,
            emptyMessage: "No maids found near your location",
            showLocationBadge: true,
            highlightLocation: true,
        },
        bookmarked: {
            title: "Your Bookmarked Maids",
            icon: <BookmarkIcon className="h-6 w-6 mr-2 text-rose-500" />,
            emptyMessage: "You haven't bookmarked any maids yet",
            showBookmarked: true,
        },
    };

    const config = configByType[collectionType];

    // Handle search locally
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setIsSearching(true);

        // Simple client-side filtering
        if (term.trim() === "") {
            setFilteredMaids(maids);
        } else {
            const results = maids.filter(
                (maid) =>
                    maid.full_name?.toLowerCase().includes(term) ||
                    maid.agency_name?.toLowerCase().includes(term)
            );
            setFilteredMaids(results);
        }

        setIsSearching(false);
    };

    // Handle page changes
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // In a real implementation, this would fetch the next page from the server
        // For now, we'll just simulate it by keeping the same maids
    };

    // Helper function to check if property exists on config
    const hasProperty = <K extends keyof CollectionConfig>(key: K): boolean => {
        return key in config;
    };

    return (
        <EmployerLayout>
            <Head title={config.title} />

            <div className="container mx-auto px-4 py-6 mb-36 sm:px-12 space-y-8">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center"
                        asChild
                    >
                        <a href={route("browse.maids.index")}>
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Browse
                        </a>
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:items-center justify-between">
                    <div className="flex items-center">
                        {config.icon}
                        <h1 className="text-2xl font-bold">{config.title}</h1>
                    </div>

                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name or agency..."
                            className="pl-8 pr-4"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                {isSearching ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array(8)
                            .fill(0)
                            .map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-64 w-full rounded-lg"
                                />
                            ))}
                    </div>
                ) : filteredMaids.length === 0 ? (
                    <div className="bg-muted p-8 rounded-lg text-center space-y-4">
                        <h3 className="text-lg font-medium">
                            {searchTerm
                                ? "No results found"
                                : config.emptyMessage}
                        </h3>
                        {searchTerm ? (
                            <p className="text-muted-foreground">
                                No maids match your search criteria. Try using
                                different keywords.
                            </p>
                        ) : (
                            <p className="text-muted-foreground">
                                {collectionType === "bookmarked"
                                    ? "Browse maids and click the bookmark icon to save them here."
                                    : "Check back later or adjust your filters to see more maids."}
                            </p>
                        )}
                        <Button asChild>
                            <a href={route("browse.maids.index")}>
                                Browse All Maids
                            </a>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <MaidGrid
                            maids={filteredMaids}
                            compact={false}
                            showMatchBadge={
                                hasProperty("showMatchBadge")
                                    ? (config as BestMatchesConfig)
                                          .showMatchBadge
                                    : false
                            }
                            showLocationBadge={
                                hasProperty("showLocationBadge")
                                    ? (config as NearbyConfig).showLocationBadge
                                    : false
                            }
                            showBookmarked={
                                hasProperty("showBookmarked")
                                    ? (config as BookmarkedConfig)
                                          .showBookmarked
                                    : false
                            }
                            selectedJobId={selectedJobId}
                            useComputedMatch={!!selectedJobId}
                        />
                    </div>
                )}

                {pagination.last_page > 1 && (
                    <div className="flex justify-center mt-6">
                        <PaginationComponent
                            currentPage={currentPage}
                            totalPages={pagination.last_page}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </EmployerLayout>
    );
}
