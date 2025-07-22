import { usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import EmployerLayout from "@/Layouts/EmployerLayout";
import { Award, Calendar, Languages, Briefcase, User } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";

// Profile components
import ProfileHeader from "@/Components/Profile/Header";
import ProfileStats from "@/Components/Profile/Stats";
import ProfileContact from "@/Components/Profile/Contact";
import ProfileReviews from "@/Components/Profile/Reviews";
import ProfileLayout from "@/Layouts/ProfileLayout";
import { getInitials } from "@/utils/useGeneralUtils";

// Maid-specific components (we'll create these next)
import MaidAbout from "./components/MaidAbout";
import MaidExperience from "./components/MaidExperience";
import MaidDocuments from "./components/MaidDocuments";
import MaidSkills from "./components/MaidSkills";

type ProfileTab = {
    id: string;
    label: string;
    content: React.ReactNode;
    count?: number;
    mobileOnly?: boolean;
};

export default function Maid() {
    const { auth, maid, documents } = usePage().props as any;
    const maidData = maid.data || maid;
    const documentsData = documents.data || documents;

    // Determine layout based on user role
    const Layout =
        auth?.user?.role === "agency" ? AgencyLayout : EmployerLayout;

    // Stats for the profile based on actual data
    const stats = [
        {
            icon: <User className="h-4 w-4 lg:h-5 lg:w-5" />,
            label: "Status",
            value:
                maidData.status === "employed"
                    ? "Employed"
                    : maidData.status === "available"
                    ? "Available"
                    : "Unavailable",
        },
        {
            icon: <Languages className="h-4 w-4 lg:h-5 lg:w-5" />,
            label: "Languages",
            value: maidData.languages?.length || 0,
        },
        {
            icon: <Briefcase className="h-4 w-4 lg:h-5 lg:w-5" />,
            label: "Experience",
            value:
                maidData.years_experience > 0
                    ? `${maidData.years_experience} ${
                          maidData.years_experience === 1 ? "Year" : "Years"
                      }`
                    : "New",
        },
    ];

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
            content: <MaidAbout maid={maidData} />,
        },
        {
            id: "skills",
            label: "Skills",
            count: maidData.skills?.length || 0,
            content: <MaidSkills skills={maidData.skills} />,
        },
        documentsData.length > 0
            ? {
                  id: "documents",
                  label: "Documents",
                  count: documentsData.length,
                  content: <MaidDocuments documents={documentsData} />,
              }
            : null,
        {
            id: "reviews",
            label: "Reviews",
            content: (
                <ProfileReviews title="Maid Reviews" showAddReview={true} />
            ),
        },
        {
            id: "contact",
            label: "Contact",
            mobileOnly: true,
            content: null,
        },
    ];

    // Additional badges to show on the profile header
    const badges = (
        <>
            {maidData.nationality && (
                <Badge variant="outline">{maidData.nationality}</Badge>
            )}
            {maidData.experience_level && (
                <Badge variant="secondary">
                    {maidData.experience_level.charAt(0).toUpperCase() +
                        maidData.experience_level.slice(1)}
                </Badge>
            )}
        </>
    );

    // Format contact info
    const contactInfo = {
        email: maidData.user?.email,
        phone: maidData.user?.profile?.phone_number,
        isPhonePrivate: maidData.user?.profile?.is_phone_private,
        preferredContactMethods: maidData.user?.profile
            ?.preferred_contact_methods || ["email"],
    };

    return (
        <Layout>
            <Head
                title={`${
                    maidData.full_name || maidData.user?.name
                } | Maid Profile`}
            />

            <ProfileLayout
                header={
                    <ProfileHeader
                        name={maidData.full_name || maidData.user?.name}
                        avatar={maidData.user?.avatar}
                        createdAt={maidData.created_at}
                        isVerified={maidData.is_verified}
                        status={maidData.status}
                        statusLabel={
                            maidData.status === "available"
                                ? "Available"
                                : maidData.status === "employed"
                                ? "Employed"
                                : "Unavailable"
                        }
                        bio={maidData.bio}
                        badges={badges}
                    />
                }
                sidebarItems={[
                    {
                        content: <ProfileStats stats={stats} />,
                    },
                    {
                        content: <ProfileContact contactInfo={contactInfo} />,
                        mobileTabId: "contact",
                    },
                    maidData.agency && {
                        content: <AgencyInfo agency={maidData.agency} />,
                        mobileTabId: "contact",
                    },
                ].filter(Boolean)}
                mobileStats={<ProfileStats stats={stats} />}
                tabs={tabs.filter(isProfileTab)}
                defaultTab="about"
            />
        </Layout>
    );
}

// Simple component to show the maid's agency information in the sidebar
function AgencyInfo({ agency }: any) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Agency</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={
                                agency.user?.avatar
                                    ? `/storage/${agency.user.avatar}`
                                    : undefined
                            }
                            alt={agency.name}
                        />
                        <AvatarFallback>
                            {getInitials(agency.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-medium">{agency.name}</h3>
                        <Button
                            variant="link"
                            className="p-0 h-auto text-sm"
                            asChild
                        >
                            <Link
                                href={route("browse.agencies.show", agency.id)}
                            >
                                View Agency
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
