import { usePage } from "@inertiajs/react";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import JobPostSummary from "./components/show/JobPostSummary";
import MaidSelectionList from "./components/show/MaidSelection/Main";
import ApplicationSummary from "./components/show/ApplicationSummary";
import { Button } from "@/Components/ui/button";
import { ChevronLeft } from "lucide-react";
import { PageProps } from "@/types";

export default function Show() {
    const { jobPost, agencyMaids } =
        usePage<PageProps<{ jobPost: any; agencyMaids: any }>>().props;
    const [selectedMaids, setSelectedMaids] = useState<any[]>([]);
    const [availableCredits, setAvailableCredits] = useState(10); // Placeholder for agency credits
    console.log("Job Post:", jobPost);
    console.log("Agency Maids:", agencyMaids);
    const handleSelectMaid = (maid: any) => {
        if (selectedMaids.some((m: any) => m.id === maid.id)) {
            setSelectedMaids(
                selectedMaids.filter((m: any) => m.id !== maid.id)
            );
        } else {
            if (selectedMaids.length < availableCredits) {
                setSelectedMaids([...selectedMaids, maid]);
            }
        }
    };

    const handleRemoveMaid = (maidId: any) => {
        setSelectedMaids(selectedMaids.filter((m: any) => m.id !== maidId));
    };

    return (
        <AgencyLayout sidebarDefaultOpen={false}>
            <Head title="Apply for Job | Agency Portal" />

            <div className="container max-w-5xl mx-auto py-4 px-4 pb-40 sm:py-6 sm:px-6">
                {/* Back button */}
                <div className="mb-4">
                    <Link href={route("browse.job-posts.index")}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" /> Back to job
                            listings
                        </Button>
                    </Link>
                </div>

                <h1 className="text-2xl font-bold mb-2 text-primary">
                    Apply for Job: {jobPost.title}
                </h1>

                <p className="text-muted-foreground mb-6">
                    Review job details and select maids to apply for this
                    position.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column - Job details */}
                    <div className="lg:col-span-1">
                        <JobPostSummary job={jobPost} />
                    </div>

                    {/* Right column - Maid selection and submission */}
                    <div className="lg:col-span-2 space-y-6">
                        <MaidSelectionList
                            maids={agencyMaids}
                            selectedMaids={selectedMaids}
                            onSelectMaid={handleSelectMaid}
                            availableCredits={availableCredits}
                            jobPost={jobPost}
                        />

                        <ApplicationSummary
                            selectedMaids={selectedMaids}
                            availableCredits={availableCredits}
                            job={jobPost}
                            onRemoveMaid={handleRemoveMaid}
                        />
                    </div>
                </div>
            </div>
        </AgencyLayout>
    );
}
