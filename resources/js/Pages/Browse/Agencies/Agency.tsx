import { usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import EmployerLayout from "@/Layouts/EmployerLayout";
import { Building2, Users, Award } from "lucide-react";

// Profile components
import ProfileHeader from "@/Components/Profile/Header";
import ProfileStats from "@/Components/Profile/Stats";
import ProfileContact from "@/Components/Profile/Contact";
import ProfileSocialLinks from "@/Components/Profile/SocialLinks";
import ProfileReviews from "@/Components/Profile/Reviews";
import ProfileLayout from "@/Layouts/ProfileLayout";

// Agency-specific components (we'll create these next)
import AgencyAbout from "./components/AgencyAbout";
import AgencyMaids from "./components/AgencyMaids";
import AgencyPhotos from "./components/AgencyPhotos";
import { FacebookIcon, Globe } from "lucide-react";

type ProfileTab = {
    id: string;
    label: string;
    content: React.ReactNode;
    count?: number;
    mobileOnly?: boolean;
};

export default function Agency() {
    const { agency, maids, photos } = usePage().props as any;
    const agencyData = agency.data || agency;
    const maidsData = maids.data || maids;
    const photosData = photos.data || photos;

    // Stats for the profile
    const stats = [
        {
            icon: <Users className="h-4 w-4 lg:h-5 lg:w-5" />,
            label: "Maids",
            value: agency.stats?.total_maids || 0,
        },
        {
            icon: <Award className="h-4 w-4 lg:h-5 lg:w-5" />,
            label: "Years",
            value: agencyData.established_at
                ? new Date().getFullYear() -
                  new Date(agencyData.established_at).getFullYear()
                : 0,
        },
        {
            icon: <Building2 className="h-4 w-4 lg:h-5 lg:w-5" />,
            label: "Status",
            value: agencyData.is_premium ? "Premium" : "Standard",
        },
    ];

    // Social links
    const socialLinks = [
        agencyData.facebook_page && {
            name: "Facebook",
            url: agencyData.facebook_page,
            icon: FacebookIcon,
            color: "text-blue-600",
        },
        agencyData.website && {
            name: "Website",
            url: agencyData.website,
            icon: Globe,
            color: "text-blue-500",
        },
    ].filter(Boolean);

    // Format address
    const formattedAddress = agencyData.address
        ? `${agencyData.address.street}, ${agencyData.address.barangay}, ${agencyData.address.city}, ${agencyData.address.province}`
        : undefined;

    function isProfileTab(tab: unknown): tab is ProfileTab {
        return (
            typeof tab === "object" &&
            tab !== null &&
            "id" in tab &&
            "label" in tab
        );
    }

    const tabs: (ProfileTab | null)[] = [
        {
            id: "about",
            label: "About",
            content: <AgencyAbout agency={agencyData} />,
        },
        {
            id: "maids",
            label: "Maids",
            count: maidsData.length,
            content: <AgencyMaids maids={maidsData} />,
        },
        photosData.length > 0
            ? {
                  id: "photos",
                  label: "Photos",
                  count: photosData.length,
                  content: <AgencyPhotos photos={photosData} />,
              }
            : null,
        {
            id: "reviews",
            label: "Reviews",
            content: (
                <ProfileReviews title="Agency Reviews" showAddReview={true} />
            ),
        },
        {
            id: "contact",
            label: "Contact",
            mobileOnly: true,
            content: null,
        },
    ];

    return (
        <EmployerLayout sidebarDefaultOpen={false}>
            <Head title={`${agencyData.name} | Agency Profile`} />

            <ProfileLayout
                header={
                    <ProfileHeader
                        name={agencyData.name}
                        avatar={agencyData.user.avatar}
                        createdAt={agencyData.created_at}
                        isVerified={agencyData.is_verified}
                        status={agencyData.status}
                        statusLabel={
                            agencyData.status === "active"
                                ? "Active Agency"
                                : agencyData.status === "pending_verification"
                                ? "Pending Verification"
                                : "Inactive"
                        }
                        bio={agencyData.description}
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
                                    email: agencyData.business_email,
                                    phone: agencyData.business_phone,
                                    isPhonePrivate: false,
                                    address: formattedAddress,
                                    isAddressPrivate: false,
                                    preferredContactMethods: ["email", "phone"],
                                }}
                            />
                        ),
                        mobileTabId: "contact",
                    },
                    ...(socialLinks.length > 0
                        ? [
                              {
                                  content: (
                                      <ProfileSocialLinks links={socialLinks} />
                                  ),
                                  mobileTabId: "contact",
                              },
                          ]
                        : []),
                ]}
                mobileStats={<ProfileStats stats={stats} />}
                tabs={tabs.filter(isProfileTab)}
                defaultTab="about"
            />
        </EmployerLayout>
    );
}
