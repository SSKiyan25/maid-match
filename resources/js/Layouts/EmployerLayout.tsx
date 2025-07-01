import { SidebarProvider } from "@/Components/ui/sidebar";
import { AppEmployerSidebar } from "@/Components/Sidebar/app-employer";
import { PropsWithChildren } from "react";
import { User } from "@/types";
import GeneralHeader from "@/Components/Header/General";
import { usePage } from "@inertiajs/react";
import MobileNavBar, { MobileNavLink } from "@/Components/Mobile/navbar";
import { Home, Briefcase, User as UserIcon, Search } from "lucide-react";
import FloatingChatButton from "@/Components/Footer/FloatingChatButton";

interface EmployerLayoutProps extends PropsWithChildren {
    sidebarDefaultOpen?: boolean;
}

const employerMobileLinks: MobileNavLink[] = [
    { label: "Dashboard", icon: Home, href: "/employer/dashboard" },
    { label: "Jobs", icon: Briefcase, href: "/employer/job-postings" },
    { label: "Profile", icon: UserIcon, href: "/employer/profile" },
    { label: "Browse", icon: Search, href: "/employer/browse" },
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
                <AppEmployerSidebar
                    user={{ ...user, avatar: user.avatar ?? "" }}
                />
                <main className="flex-1 flex flex-col min-h-screen">
                    <GeneralHeader
                        user={{ ...user, avatar: user.avatar ?? "" }}
                    />
                    {children}
                </main>
                <MobileNavBar links={employerMobileLinks} />
                <FloatingChatButton />
            </div>
        </SidebarProvider>
    );
}
