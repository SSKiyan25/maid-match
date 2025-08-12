import { usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import SearchBar from "./components/SearchBar";
import NearYouSection from "./components/NearYouSection";
import RecommendedSection from "./components/RecommendedSection";
import AllJobsSection from "./components/AllJobsSection";
import FeaturedJobsSection from "./components/FeaturedJobsSection";
import { toast } from "sonner";

export default function JobPostsIndex() {
    const { jobPosts, recommendedJobs, nearbyJobs, featuredJobs, flash } =
        usePage().props as any;
    // console.log("Page props:", usePage().props);

    const hasRecommendedJobs =
        Array.isArray(recommendedJobs) && recommendedJobs.length > 0;
    const hasNearbyJobs = Array.isArray(nearbyJobs) && nearbyJobs.length > 0;
    const hasFeaturedJobs =
        Array.isArray(featuredJobs) && featuredJobs.length > 0;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    return (
        <AgencyLayout sidebarDefaultOpen={false}>
            <Head title="Browse for Jobs" />
            <div className="pt-4 pb-32 px-0 sm:px-12 sm:pt-12">
                <div className="max-w-sm sm:max-w-screen-xl mx-auto py-6 space-y-6 overflow-x-hidden">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Browse Job Posts
                        </h1>
                        {/* <p className="mt-2 text-muted-foreground text-base max-w-xl">
                            Discover nanny, maid, and household jobs near you.
                            Use the search and filters to find the perfect
                            opportunity for your skills and preferences.
                        </p> */}
                    </div>

                    <SearchBar />

                    {hasNearbyJobs && <NearYouSection jobs={nearbyJobs} />}

                    {hasRecommendedJobs && (
                        <RecommendedSection jobs={recommendedJobs} />
                    )}

                    {hasFeaturedJobs && (
                        <FeaturedJobsSection jobs={featuredJobs} />
                    )}

                    <AllJobsSection jobPosts={jobPosts} />
                </div>
            </div>
        </AgencyLayout>
    );
}
