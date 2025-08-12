import JobPostsList from "./JobPostsList";

interface RecommendedSectionProps {
    jobs: any[];
}

export default function RecommendedSection({ jobs }: RecommendedSectionProps) {
    // Only display up to 5 recommended jobs on the main page
    const recommendedJobs = jobs.slice(0, 5);

    return (
        <section>
            <JobPostsList
                jobs={recommendedJobs}
                title="Recommended For You"
                emptyMessage="No recommended jobs found"
                horizontal={true}
                featured={true}
                category="recommended"
                viewAllRoute="/browse/job-posts/recommended"
            />
        </section>
    );
}
