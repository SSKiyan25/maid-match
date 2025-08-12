import JobPostsList from "./JobPostsList";

interface FeaturedJobsSectionProps {
    jobs: any[];
}

export default function FeaturedJobsSection({
    jobs,
}: FeaturedJobsSectionProps) {
    // Only display up to 5 featured jobs on the main page
    const featuredJobs = jobs.slice(0, 5);

    return (
        <section>
            <JobPostsList
                jobs={featuredJobs}
                title="Featured Opportunities"
                emptyMessage="No featured jobs available"
                horizontal={true}
                featured={true}
                category="featured"
                viewAllRoute="/browse/job-posts/featured"
            />
        </section>
    );
}
