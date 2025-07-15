import JobPostsList from "./JobPostsList";

interface NearYouSectionProps {
    jobPosts: any[];
}

export default function NearYouSection({ jobPosts }: NearYouSectionProps) {
    // For now just simulate 5 jobs
    const nearYouJobs = jobPosts.slice(0, 5);

    return (
        <section className="">
            <JobPostsList
                jobs={nearYouJobs}
                title="Near You"
                emptyMessage="No jobs found near you"
                horizontal={true}
                category="nearby"
                viewAllRoute="/browse/job-posts/near-you"
            />
        </section>
    );
}
