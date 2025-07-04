import { Head, usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";
import EmployerLayout from "../../../Layouts/EmployerLayout";
import UserComponent from "./components/User";
import ProfileComponent from "./components/Profile";
import EmployerComponent from "./components/Employer";
import ChildComponent from "./components/Child";
import PetComponent from "./components/Pet";
import { User, Profile, Employer } from "./utils/types";
import { PageProps } from "@/types";

type ProfilePageProps = PageProps<{
    user: User;
    profile: Profile;
    employer: Employer;
    flash?: { success?: string };
}>;

export default function EmployerProfilePage() {
    const { user, profile, employer, flash } =
        usePage<ProfilePageProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash?.success]);

    return (
        <EmployerLayout sidebarDefaultOpen={false}>
            <Head title="Profile" />

            <div className="container mx-auto pt-12 pb-24 space-y-8 px-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Profile Settings
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>

                <div className="space-y-6">
                    <UserComponent user={user} />
                    <ProfileComponent profile={profile} />
                    <EmployerComponent employer={employer} />
                    <ChildComponent children={employer.children ?? []} />
                    <PetComponent pets={employer.pets ?? []} />
                </div>
            </div>
        </EmployerLayout>
    );
}
