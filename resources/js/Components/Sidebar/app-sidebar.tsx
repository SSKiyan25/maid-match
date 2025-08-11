"use client";

import * as React from "react";
import { NavMain } from "./nav-components/nav-main";
import { NavUser, UserProps } from "./nav-components/nav-user";
import { NavBrowse } from "./nav-components/nav-browse";
import { NavHeader } from "./nav-components/nav-header";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/Components/ui/sidebar";
import { type LucideIcon } from "lucide-react";

interface SidebarNavItem {
    title: string;
    url?: string;
    icon?: LucideIcon;
    isActive?: boolean;
    badge?: number | string;
    items?: {
        title: string;
        url: string;
        icon?: LucideIcon;
    }[];
}

interface BrowseItem {
    name: string;
    url: string;
    icon: LucideIcon;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: UserProps;
    navMain: SidebarNavItem[];
    browseItems?: BrowseItem[];
    defaultOpen?: boolean;
}

export function AppSidebar({
    user,
    navMain,
    browseItems,
    ...props
}: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <NavHeader />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
                {browseItems && <NavBrowse items={browseItems} />}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
