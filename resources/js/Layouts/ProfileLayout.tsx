import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

interface ProfileTab {
    id: string;
    label: string;
    content: ReactNode;
    count?: number;
    mobileOnly?: boolean;
}

interface SidebarItem {
    content: ReactNode;
    mobileTabId?: string; // If provided, this component will also show in this tab on mobile
}

interface ProfileLayoutProps {
    header: ReactNode;
    sidebarItems?: SidebarItem[];
    tabs: ProfileTab[];
    defaultTab?: string;
    mobileStats?: ReactNode;
    layout?: "standard" | "reverse"; // standard (sidebar left) or reverse (sidebar right)
}

export default function ProfileLayout({
    header,
    sidebarItems = [],
    tabs,
    defaultTab,
    mobileStats,
    layout = "standard",
}: ProfileLayoutProps) {
    const isReverse = layout === "reverse";

    return (
        <div className="pb-36 pt-4 px-4 mx-auto w-full">
            {/* Profile Header - Avatar, Name, Verification, etc. */}
            {header}

            {/* Two column layout for desktop */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Determine the order of columns based on layout */}
                {!isReverse && (
                    /* Sidebar column - visible on desktop */
                    <div className="hidden lg:flex flex-col gap-6">
                        {sidebarItems.map((item, index) => (
                            <div key={`sidebar-${index}`}>{item.content}</div>
                        ))}
                    </div>
                )}

                {/* Main content column */}
                <div className="lg:col-span-2">
                    {/* Stats visible only on mobile */}
                    {mobileStats && (
                        <div className="lg:hidden mb-6">{mobileStats}</div>
                    )}

                    {/* Main Content Tabs */}
                    <div className="w-full pb-2">
                        <Tabs
                            defaultValue={defaultTab || tabs[0]?.id}
                            className="w-full"
                        >
                            <div className="overflow-x-auto w-full">
                                <TabsList
                                    className="w-full flex-nowrap justify-around h-11 scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent mpb-2"
                                    style={{ WebkitOverflowScrolling: "touch" }}
                                >
                                    {tabs.map((tab) => (
                                        <TabsTrigger
                                            key={tab.id}
                                            value={tab.id}
                                            className={`text-xs h-8 px-3 sm:px-12 whitespace-nowrap ${
                                                tab.mobileOnly
                                                    ? "lg:hidden"
                                                    : ""
                                            }`}
                                        >
                                            {tab.label}
                                            {tab.count !== undefined &&
                                                ` (${tab.count})`}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            {tabs.map((tab) => (
                                <TabsContent
                                    key={tab.id}
                                    value={tab.id}
                                    className={`mt-6 space-y-6 ${
                                        tab.mobileOnly ? "lg:hidden" : ""
                                    }`}
                                >
                                    {tab.content}
                                    {tab.mobileOnly &&
                                        sidebarItems
                                            .filter(
                                                (item) =>
                                                    item.mobileTabId === tab.id
                                            )
                                            .map((item, idx) => (
                                                <div
                                                    key={`mobile-sidebar-${idx}`}
                                                >
                                                    {item.content}
                                                </div>
                                            ))}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </div>

                {/* Right sidebar if reverse layout */}
                {isReverse && (
                    <div className="hidden lg:flex flex-col gap-6">
                        {sidebarItems.map((item, index) => (
                            <div key={`sidebar-${index}`}>{item.content}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
