import { Head } from "@inertiajs/react";
import { PageProps, User, Agency, AgencyPhoto } from "@/types";
import AgencyLayout from "@/Layouts/AgencyLayout";
import UserProfile from "./components/UserProfile";
import AgencyInformation from "./components/AgencyInformation";
import AgencyPhotos from "./components/AgencyPhotos";

interface ProfileProps extends PageProps {
    user: User;
    agency: Agency;
    photos: AgencyPhoto[];
}

export default function ProfileSettings({
    user,
    agency,
    photos,
}: ProfileProps) {
    // console.log("ProfileSettings", { user, agency, photos });
    return (
        <AgencyLayout sidebarDefaultOpen={false}>
            <Head title="Agency Profile Settings" />

            <div className="container py-12 pb-48 space-y-6 px-8 sm:px-24">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Profile Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your agency profile, information, and photos
                    </p>
                </div>

                <div className="space-y-6">
                    <UserProfile user={user} agency={agency} />
                    <AgencyInformation user={user} agency={agency} />
                    <AgencyPhotos photos={photos} agencyId={agency.id} />
                </div>
            </div>
        </AgencyLayout>
    );
}
