import JobPostsList from "./JobPostsList";

interface RecommendedSectionProps {
    jobPosts: any[];
}

export default function RecommendedSection({
    jobPosts,
}: RecommendedSectionProps) {
    // For now just put example logic to filter recommended jobs
    const recommendedJobs = jobPosts
        .filter((_, index) => index % 2 === 0)
        .slice(0, 5);

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
