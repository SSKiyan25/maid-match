import { SidebarProvider } from "@/Components/ui/sidebar";
import { AppSidebar } from "@/Components/Sidebar/app-sidebar";
import { PropsWithChildren } from "react";
import { User } from "@/types";
import GeneralHeader from "@/Components/Header/General";
import { usePage } from "@inertiajs/react";
import MobileNavBar, { MobileNavLink } from "@/Components/Mobile/navbar";
import {
    Home,
    Briefcase,
    User as UserIcon,
    Search,
    LayoutDashboard,
    BarChart3,
    PlusCircle,
    Archive,
    FileText,
    UserCheck,
    UserLock,
    UserX,
    CalendarClock,
    Clock,
    Bookmark,
    Settings,
    UserCog,
    Shield,
    List,
    UserRoundSearch,
    Hourglass,
    BookUser,
    Users,
    Building2,
} from "lucide-react";
import FloatingChatButton from "@/Components/Footer/FloatingChatButton";
import { Toaster } from "@/Components/ui/sonner";

interface EmployerLayoutProps extends PropsWithChildren {
    sidebarDefaultOpen?: boolean;
}

const employerMobileLinks: MobileNavLink[] = [
    { label: "Dashboard", icon: Home, href: "/employer/dashboard" },
    { label: "Jobs", icon: Briefcase, href: "/employer/job-postings" },
    { label: "Profile", icon: UserIcon, href: "/employer/profile" },
    { label: "Browse", icon: Search, href: "/employer/browse" },
];

// Sidebar navMain and browseItems (from app-employer.tsx)
const navMain = [
    {
        title: "Dashboard",
        url: "/employer/dashboard",
        icon: LayoutDashboard,
        isActive: true,
    },
    {
        title: "Overview",
        url: "#",
        icon: BarChart3,
    },
    {
        title: "Jobs",
        icon: Briefcase,
        items: [
            {
                title: "My Listings",
                url: "/employer/job-postings",
                icon: List,
            },
            {
                title: "Post a New Job",
                url: "/employer/job-postings/create",
                icon: PlusCircle,
            },
            {
                title: "Archived Jobs",
                url: "/employer/job-postings-archived",
                icon: Archive,
            },
        ],
    },
    {
        title: "Applications",
        icon: FileText,
        items: [
            {
                title: "All Applicants",
                url: "#",
                icon: UserRoundSearch,
            },
            {
                title: "Shortlisted Candidates",
                url: "#",
                icon: UserCheck,
            },
            {
                title: "Rejected",
                url: "#",
                icon: UserX,
            },
        ],
    },
    {
        title: "Interviews",
        icon: CalendarClock,
        items: [
            {
                title: "Upcoming Interviews",
                url: "#",
                icon: Clock,
            },
            {
                title: "Propose Time Slots",
                url: "#",
                icon: Hourglass,
            },
        ],
    },
    {
        title: "Bookmarks",
        icon: Bookmark,
        items: [
            {
                title: "Saved Maids",
                url: "#",
                icon: BookUser,
            },
        ],
    },
    {
        title: "Settings",
        icon: Settings,
        items: [
            {
                title: "Account Settings",
                url: "#",
                icon: UserLock,
            },
            {
                title: "Profile Settings",
                url: "/employer/profile",
                icon: UserCog,
            },
            {
                title: "Security",
                url: "#",
                icon: Shield,
            },
        ],
    },
];

const browseItems = [
    { name: "Browse for Maids", url: "/maids/browse", icon: Users },
    { name: "Browse for Agency", url: "/agencies/browse", icon: Building2 },
];

export default function EmployerLayout({
    children,
    sidebarDefaultOpen = true,
}: EmployerLayoutProps) {
    const { auth } = usePage().props as { auth: { user: User } };
    const user = auth.user;
    return (
        <SidebarProvider defaultOpen={sidebarDefaultOpen}>
            <div className="flex min-h-screen w-full">
                <AppSidebar
                    user={{ ...user, avatar: user.avatar ?? "" }}
                    navMain={navMain}
                    browseItems={browseItems}
                />
                <main className="flex-1 flex flex-col min-h-screen">
                    <GeneralHeader
                        user={{ ...user, avatar: user.avatar ?? "" }}
                    />
                    {children}
                    <Toaster />
                </main>
                <MobileNavBar links={employerMobileLinks} />
                <FloatingChatButton />
            </div>
        </SidebarProvider>
    );
}
