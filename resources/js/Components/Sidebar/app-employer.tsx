"use client";

import * as React from "react";
import {
    LayoutDashboard,
    BarChart3,
    Briefcase,
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

import { NavMain } from "./nav-components/nav-main";
import { NavUser } from "./nav-components/nav-user";
import { NavBrowse } from "./nav-components/nav-browse";
import { NavHeader } from "./nav-components/nav-header";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/Components/ui/sidebar";

interface AppEmployerSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
    defaultOpen?: boolean;
}

const data = {
    navMain: [
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
    ],
};

const browseItems = [
    { name: "Browse for Maids", url: "/maids/browse", icon: Users },
    { name: "Browse for Agency", url: "/agencies/browse", icon: Building2 },
];

export function AppEmployerSidebar({
    user,
    ...props
}: AppEmployerSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavHeader />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavBrowse items={browseItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
