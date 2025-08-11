import { SidebarProvider } from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/Sidebar/app-sidebar";
import { PropsWithChildren } from "react";
import { User, Agency } from "@/types";
import GeneralHeader from "@/Components/Header/General";
import { usePage } from "@inertiajs/react";
import MobileNavBar, { MobileNavLink } from "@/Components/Mobile/navbar";
import {
    Home,
    Users,
    UserPlus,
    Upload,
    FileText,
    ChartGantt,
    Briefcase,
    Mail,
    Settings,
    Building2,
    Star,
    PhilippinePeso,
    Bolt,
    Archive,
    Coins,
} from "lucide-react";
import FloatingChatButton from "@/Components/Footer/FloatingChatButton";
import { Toaster } from "@/Components/ui/sonner";

interface AgencyLayoutProps extends PropsWithChildren {
    sidebarDefaultOpen?: boolean;
}

export default function AgencyLayout({
    children,
    sidebarDefaultOpen = true,
}: AgencyLayoutProps) {
    const { auth, agency } = usePage().props as {
        auth: { user: User };
        agency?: Agency | null;
    };
    // console.log("AgencyLayout auth:", auth);
    // console.log("AgencyLayout agency:", agency);
    const user = auth.user;

    const navMain = [
        {
            title: "Dashboard",
            url: "/agency/dashboard",
            icon: Home,
            isActive: true,
        },
        {
            title: "Overview",
            url: "/agency/overview",
            icon: ChartGantt,
        },
        {
            title: "Maids",
            icon: Users,
            items: [
                {
                    title: "All Maids",
                    url: "/agency/maids",
                    icon: Users,
                },
                {
                    title: "Add New Maid",
                    url: "/agency/maids/create",
                    icon: UserPlus,
                },
                {
                    title: "Bulk Import",
                    url: "/agency/maids/import",
                    icon: Upload,
                },
                {
                    title: "Archived Maids",
                    url: "/agency/maids/archived",
                    icon: Archive,
                },
            ],
        },
        {
            title: "Applications",
            url: "/agency/applications",
            icon: FileText,
        },
        {
            title: "Credits",
            url: "/agency/credits",
            icon: Coins,
            badge: agency?.credits?.available ?? 0,
        },
        {
            title: "Inquiries",
            url: "/agency/inquiries",
            icon: Mail,
        },
        {
            title: "Settings",
            icon: Settings,
            items: [
                {
                    title: "Agency Profile",
                    url: "/agency/settings/profile",
                    icon: Building2,
                },
                {
                    title: "Placement Fee",
                    url: "/agency/settings/fees",
                    icon: PhilippinePeso,
                },
                {
                    title: "Agency Configuration",
                    url: "/agency/settings/configuration",
                    icon: Bolt,
                },
            ],
        },
    ];

    const agencyMobileLinks: MobileNavLink[] = [
        { label: "Dashboard", icon: Home, href: "/agency/dashboard" },
        { label: "Maids", icon: Users, href: "/agency/maids" },
        { label: "Jobs", icon: Briefcase, href: "/browse/job-posts" },
        {
            label: "Credits",
            icon: Coins,
            href: "/agency/credits",
            badge: agency?.credits?.available ?? 0,
        },
        { label: "Settings", icon: Settings, href: "/agency/settings/profile" },
    ];

    const browseItems = [
        // { name: "Browse for employers", url: "/employers/browse", icon: Star },
        { name: "Browse for Jobs", url: "/browse/job-posts", icon: Briefcase },
    ];

    return (
        <SidebarProvider defaultOpen={sidebarDefaultOpen}>
            <div className="flex min-h-screen w-full">
                <AppSidebar
                    user={{
                        ...user,
                        name: agency?.name ?? "",
                        avatar: user.avatar ?? "",
                        credits: agency?.credits,
                        isAgency: true,
                    }}
                    navMain={navMain}
                    browseItems={browseItems}
                />
                <main className="flex-1 flex flex-col min-h-screen">
                    <GeneralHeader
                        user={{
                            ...user,
                            name: agency?.name ?? "",
                            avatar: user.avatar ?? "",
                            credits: agency?.credits,
                            isAgency: true,
                        }}
                    />
                    {children}
                    <Toaster />
                </main>
                <MobileNavBar links={agencyMobileLinks} />
                <FloatingChatButton />
            </div>
        </SidebarProvider>
    );
}
