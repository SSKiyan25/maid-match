import { useState, useEffect } from "react";
import { Head, router, Link } from "@inertiajs/react";
import EmployerLayout from "@/Layouts/EmployerLayout";
import AgencyHeader from "./components/ForIndex/AgencyHeader";
import AgencyFilters from "./components/ForIndex/AgencyFilters";
import AgencyFeaturedSection from "./components/ForIndex/AgencyFeaturedSection";
import AgencyGrid from "./components/ForIndex/AgencyGrid";
import { Separator } from "@/Components/ui/separator";
import PaginationComponent from "@/Components/PaginationComponent";
import { Award, Clock, Building2, CheckCircle, MapPin } from "lucide-react";

interface AgencyPageProps {
    agencies: any[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    featuredSections: {
        featuredAgencies?: any[];
        verifiedAgencies?: any[];
        recentAgencies?: any[];
        popularAgencies?: any[];
        nearbyAgencies?: any[];
    };
    activeFilters: {
        search: string;
        sort_by: string;
        page: number;
    };
}

export default function AgenciesIndexPage({
    agencies,
    pagination,
    featuredSections,
    activeFilters,
}: AgencyPageProps) {
    // State for filters - initialized from server data
    const [searchTerm, setSearchTerm] = useState(activeFilters.search);
    const [sortOrder, setSortOrder] = useState<string>(
        activeFilters.sort_by || "featured"
    );
    const [currentPage, setCurrentPage] = useState(pagination.current_page);
    const [isLoading, setIsLoading] = useState(false);

    // Extract sections from featuredSections
    const {
        featuredAgencies = [],
        verifiedAgencies = [],
        recentAgencies = [],
        popularAgencies = [],
        nearbyAgencies = [],
    } = featuredSections;

    // Handler for filter changes - send to server
    const applyFilters = () => {
        setIsLoading(true);
        router.get(
            route("browse.agencies.index"),
            {
                search: searchTerm,
                sort_by: sortOrder,
                page: currentPage,
            },
            {
                preserveState: true,
                preserveScroll: true,
                only: [
                    "agencies",
                    "pagination",
                    "featuredSections",
                    "activeFilters",
                ],
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
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
    }, [searchTerm, sortOrder]);

    // Handle page changes
    useEffect(() => {
        if (currentPage !== pagination.current_page) {
            applyFilters();
        }
    }, [currentPage]);

    return (
        <EmployerLayout sidebarDefaultOpen={false}>
            <Head title="Browse Agencies" />

            <div className="container mx-auto px-4 py-6 mb-36 sm:px-12 space-y-8 max-w-sm sm:max-w-full overflow-x-hidden">
                <AgencyHeader />

                {/* Nearby Agencies Section */}
                {nearbyAgencies.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center">
                                <MapPin className="h-6 w-6 mr-2 text-rose-500" />
                                Agencies Near You
                            </h2>
                            <Link
                                href={route("browse.agencies.all.nearby")}
                                className="text-primary text-sm hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                        <AgencyFeaturedSection
                            agencies={nearbyAgencies}
                            highlightVerified={true}
                        />
                    </section>
                )}

                {/* Popular Agencies Section */}
                {popularAgencies.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center">
                                <Building2 className="h-6 w-6 mr-2 text-indigo-500" />
                                Popular Agencies
                            </h2>
                            <Link
                                href={route("browse.agencies.all.popular")}
                                className="text-primary text-sm hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                        <AgencyFeaturedSection
                            agencies={popularAgencies}
                            highlightMaidCount={true}
                        />
                    </section>
                )}

                {/* Featured Agencies Section */}
                {featuredAgencies.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center">
                                <Award className="h-6 w-6 mr-2 text-amber-500" />
                                Featured Agencies
                            </h2>
                            <Link
                                href={route("browse.agencies.all.featured")}
                                className="text-primary text-sm hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                        <AgencyFeaturedSection
                            agencies={featuredAgencies}
                            highlightPremium={true}
                        />
                    </section>
                )}

                {/* Verified Agencies Section */}
                {verifiedAgencies.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center">
                                <CheckCircle className="h-6 w-6 mr-2 text-emerald-500" />
                                Verified Agencies
                            </h2>
                            <Link
                                href={route("browse.agencies.all.verified")}
                                className="text-primary text-sm hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                        <AgencyFeaturedSection
                            agencies={verifiedAgencies}
                            highlightVerified={true}
                        />
                    </section>
                )}

                {/* Recently Added Section */}
                {recentAgencies.length > 0 && (
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center">
                                <Clock className="h-6 w-6 mr-2 text-blue-500" />
                                Recently Added
                            </h2>
                            <Link
                                href={route("browse.agencies.all.recent")}
                                className="text-primary text-sm hover:underline"
                            >
                                View all
                            </Link>
                        </div>
                        <AgencyFeaturedSection
                            agencies={recentAgencies}
                            highlightNew={true}
                        />
                    </section>
                )}

                <Separator className="my-8" />

                {/* All Agencies Section with Filters */}
                <section id="all-agencies" className="space-y-6">
                    <h2 className="text-2xl font-bold">
                        All Available Agencies
                        {isLoading && (
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                Loading...
                            </span>
                        )}
                    </h2>

                    <AgencyFilters
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        sortOrder={sortOrder}
                        onSortOrderChange={setSortOrder}
                        isLoading={isLoading}
                    />

                    <AgencyGrid
                        agencies={agencies}
                        emptyMessage="No agencies match your search criteria"
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
