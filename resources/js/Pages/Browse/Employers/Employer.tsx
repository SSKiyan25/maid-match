import { usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import { Briefcase, Users, Calendar, Home, Baby, Cat, Dog } from "lucide-react";

// Profile components
import ProfileHeader from "@/Components/Profile/Header";
import ProfileStats from "@/Components/Profile/Stats";
import ProfileContact from "@/Components/Profile/Contact";
import ProfileSocialLinks from "@/Components/Profile/SocialLinks";
import ProfileReviews from "@/Components/Profile/Reviews";
import ProfileLayout from "@/Layouts/ProfileLayout";

// Employer-specific components
import HouseholdDetails from "./components/HouseholdDetails";
import JobPostingsSection from "./components/JobPostingsSection";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react";

export default function Employer() {
    const { employer, jobPostings } = usePage().props as any;
    const employerData = employer.data || employer;
    const jobPostingData = jobPostings.data || jobPostings;

    // Stats for the profile
    const stats = [
        {
            icon: <Briefcase className="h-4 w-4 lg:h-5 lg:w-5" />,
            label: "Active Jobs",
            value: employer.stats?.active_job_postings || 0,
        },
        {
            icon: <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />,
            label: "Total Jobs",
            value: employer.stats?.total_job_postings || 0,
        },
        {
            icon: <Users className="h-4 w-4 lg:h-5 lg:w-5" />,
            label: "Family Size",
            value: employer.stats?.family_size || 0,
        },
    ];

    // Sample social links
    const socialLinks = [
        {
            name: "Facebook",
            url: "https://facebook.com",
            icon: FacebookIcon,
            color: "text-blue-600",
        },
        {
            name: "Instagram",
            url: "https://instagram.com",
            icon: InstagramIcon,
            color: "text-pink-600",
        },
        {
            name: "LinkedIn",
            url: "https://linkedin.com",
            icon: LinkedinIcon,
            color: "text-blue-700",
        },
    ];

    return (
        <AgencyLayout sidebarDefaultOpen={false}>
            <Head title={`${employerData.user.full_name} | Employer Profile`} />

            <ProfileLayout
                header={
                    <ProfileHeader
                        name={employerData.user.full_name}
                        avatar={employerData.user.avatar}
                        createdAt={employerData.user.created_at}
                        isVerified={employerData.is_verified}
                        status={employerData.status}
                        statusLabel={
                            employerData.status === "looking"
                                ? "Actively Looking"
                                : "Not Looking"
                        }
                        bio={employerData.user.profile?.bio}
                    />
                }
                sidebarItems={[
                    {
                        content: <ProfileStats stats={stats} />,
                    },
                    {
                        content: (
                            <ProfileContact
                                contactInfo={{
                                    email: employerData.user.email,
                                    phone: employerData.user.profile
                                        ?.phone_number,
                                    isPhonePrivate:
                                        employerData.user.profile
                                            ?.is_phone_private,
                                    address:
                                        employerData.user.profile
                                            ?.formatted_address,
                                    isAddressPrivate:
                                        employerData.user.profile
                                            ?.is_address_private,
                                    birthDate:
                                        employerData.user.profile?.birth_date,
                                    preferredLanguage:
                                        employerData.user.profile
                                            ?.preferred_language,
                                    preferredContactMethods:
                                        employerData.user.profile
                                            ?.preferred_contact_methods,
                                }}
                            />
                        ),
                        mobileTabId: "contact",
                    },
                    {
                        content: <ProfileSocialLinks links={socialLinks} />,
                        mobileTabId: "contact",
                    },
                ]}
                mobileStats={<ProfileStats stats={stats} />}
                tabs={[
                    {
                        id: "about",
                        label: "About",
                        content: <HouseholdDetails employer={employerData} />,
                    },
                    {
                        id: "jobs",
                        label: "Job Postings",
                        count: jobPostingData.length,
                        content: (
                            <JobPostingsSection jobPostings={jobPostingData} />
                        ),
                    },
                    {
                        id: "reviews",
                        label: "Reviews",
                        content: (
                            <ProfileReviews
                                title="Employer Reviews"
                                showAddReview={true}
                            />
                        ),
                    },
                    {
                        id: "contact",
                        label: "Contact",
                        mobileOnly: true,
                        content: null, // This tab shows sidebar items on mobile
                    },
                ]}
                defaultTab="about"
            />
        </AgencyLayout>
    );
}
