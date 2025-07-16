import { usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import SearchBar from "./components/SearchBar";
import NearYouSection from "./components/NearYouSection";
import RecommendedSection from "./components/RecommendedSection";
import AllJobsSection from "./components/AllJobsSection";

export default function JobPostsIndex() {
    const jobPosts = (usePage().props as any).jobPosts ?? [];

    return (
        <AgencyLayout sidebarDefaultOpen={false}>
            <Head title="Browse for Jobs" />
            <div className="pt-4 pb-32 px-6 sm:px-24 sm:pt-12">
                <div className="max-w-[350px] sm:max-w-screen-xl mx-auto py-6 space-y-6 overflow-x-hidden">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Browse Job Posts
                        </h1>
                        <p className="mt-2 text-muted-foreground text-base max-w-xl">
                            Discover nanny, maid, and household jobs near you.
                            Use the search and filters to find the perfect
                            opportunity for your skills and preferences.
                        </p>
                    </div>

                    <SearchBar />

                    <NearYouSection jobPosts={jobPosts} />
                    <RecommendedSection jobPosts={jobPosts} />
                    <AllJobsSection jobPosts={jobPosts} />
                </div>
            </div>
        </AgencyLayout>
    );
}
