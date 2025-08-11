import { useState, useEffect } from "react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import { Head, usePage } from "@inertiajs/react";
import DashboardSummary from "./components/ForDashboard/DashboardSummary";
import CreditSection from "./components/ForDashboard/CreditSection";
import MaidOverview from "./components/ForDashboard/MaidOverview";
import ApplicationStats from "./components/ForDashboard/ApplicationStats";
import NearbyJobs from "./components/ForDashboard/NearbyJobs";
import QuickLinks from "./components/ForDashboard/QuickLinks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

interface DashboardProps {
    agency: any;
    agencyData?: any;
    creditStats: any;
    maidStats: any;
    recentMaids: {
        data: any[];
    };
    applicationStats: any;
    recentApplications: {
        data: any[];
    };
    nearbyJobs: {
        data: any[];
    };
    creditHistory: any[];
    quickLinks: any[];
}

export default function Dashboard(props: DashboardProps) {
    const [isLoading, setIsLoading] = useState(true);
    const newProps = { ...props };

    // Initialize agencyData
    if (props.agency) {
        newProps.agencyData = {
            ...props.agency,
            credits: Array.isArray(props.agency.credits)
                ? {
                      available: props.agency.credits.reduce(
                          (sum: number, credit: any) => sum + credit.amount,
                          0
                      ),
                      recent_transactions: props.agency.credits.slice(0, 5),
                  }
                : props.agency.credits,
        };
    }

    console.log("Dashboard Props", newProps);
    const {
        agencyData,
        creditStats,
        maidStats,
        recentMaids,
        applicationStats,
        recentApplications,
        nearbyJobs,
        creditHistory,
        quickLinks,
    } = newProps;

    // Simulate loading state for better UX
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    usePage().props.agency = agencyData;

    return (
        <AgencyLayout>
            <Head title="Agency Dashboard" />

            {/* Fullscreen loader */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <span className="text-sm text-muted-foreground">
                            Loading dashboard data...
                        </span>
                    </div>
                </div>
            )}

            <div className="container p-4 mx-auto mb-32 md:p-6 lg:p-8 space-y-6">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between text-center sm:text-left gap-4">
                    <div>
                        <h1 className="text-2xl font-bold md:text-3xl">
                            Agency Dashboard
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 ">
                            {agencyData?.status === "pending_verification"
                                ? "Your agency is pending verification. Some features may be limited."
                                : "Welcome back! Here's an overview of your agency's performance."}
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <DashboardSummary
                        credits={creditStats?.totalCredits}
                        maids={maidStats?.totalMaids}
                        applications={applicationStats?.totalApplications}
                        isLoading={isLoading}
                    />
                </div>

                {/* Quick Links - Mobile Only */}
                <div className="md:hidden">
                    <QuickLinks links={quickLinks} isLoading={isLoading} />
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 h-auto">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="maids">Maids</TabsTrigger>
                        <TabsTrigger value="applications">
                            Applications
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <CreditSection
                                creditStats={creditStats}
                                creditHistory={creditHistory}
                                isLoading={isLoading}
                            />

                            {/* Quick Links - Desktop Only */}
                            <div className="hidden md:block">
                                <QuickLinks
                                    links={quickLinks}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>

                        <NearbyJobs
                            jobs={nearbyJobs?.data}
                            isLoading={isLoading}
                        />
                    </TabsContent>

                    {/* Maids Tab */}
                    <TabsContent value="maids" className="space-y-6">
                        <MaidOverview
                            maidStats={maidStats}
                            recentMaids={recentMaids?.data}
                            isLoading={isLoading}
                        />
                    </TabsContent>

                    {/* Applications Tab */}
                    <TabsContent value="applications" className="space-y-6">
                        <ApplicationStats
                            stats={applicationStats}
                            recentApplications={recentApplications?.data}
                            isLoading={isLoading}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </AgencyLayout>
    );
}
