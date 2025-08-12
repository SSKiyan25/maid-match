import JobPostsList from "./JobPostsList";
import { usePage } from "@inertiajs/react";
import { MapPin } from "lucide-react";

interface NearYouSectionProps {
    jobs: any[];
}

export default function NearYouSection({ jobs }: NearYouSectionProps) {
    const { agency } = usePage().props as any;
    // console.log("Page props:", usePage().props);
    // console.log("Auth props:", auth);

    const getAgencyLocation = () => {
        if (agency?.address) {
            return [
                agency.address.barangay,
                agency.address.city,
                agency.address.province,
            ]
                .filter(Boolean)
                .join(", ");
        }
        return null;
    };

    const locationText = getAgencyLocation();

    // Title with user's location if available
    const sectionTitle = locationText ? "Jobs Near You" : "Jobs Near You";
    console.log("Location text:", locationText);
    // Only display up to 5 nearby jobs on the main page
    const nearYouJobs = jobs.slice(0, 5);

    return (
        <section>
            <JobPostsList
                jobs={nearYouJobs}
                title={sectionTitle}
                subtitle={
                    locationText ? (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>Based on your location: {locationText}</span>
                        </div>
                    ) : undefined
                }
                emptyMessage="No jobs found near your location"
                horizontal={true}
                category="nearby"
                viewAllRoute="/browse/job-posts/near-you"
            />
        </section>
    );
}
