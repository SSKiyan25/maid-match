import { usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import AgencyLayout from "@/Layouts/AgencyLayout";
import CreditStats from "./components/CreditStats";
import CreditHistory from "./components/CreditHistory";
import CreditFilter from "./components/CreditFilter";
import RecentTransactions from "./components/RecentTransactions";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function CreditsIndex() {
    const { credits, stats, recentTransactions, pagination, agency } = usePage()
        .props as any;
    const [filterType, setFilterType] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");

    // console.log("CreditsIndex props:", {
    //     credits,
    //     stats,
    //     recentTransactions,
    //     pagination,
    //     agency,
    // });
    // Filter credits based on type and search term
    const filteredCredits = credits.data.filter((credit: any) => {
        const matchesType = filterType === "all" || credit.type === filterType;
        const matchesSearch =
            searchTerm === "" ||
            credit.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <AgencyLayout>
            <Head title="Agency Credits" />
            <div className="container px-4 py-6 space-y-6 mb-24 sm:mb-0 sm:px-6 max-w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-2xl font-bold">Credit Management</h1>
                    <Button asChild size="sm">
                        <Link href={route("agency.credits.purchase")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Purchase Credits
                        </Link>
                    </Button>
                </div>

                {/* Credit Stats */}
                <CreditStats totalCredits={stats.totalCredits} />

                {/* Recent Transactions (Mobile Only) */}
                <div className="sm:hidden">
                    <h2 className="text-lg font-semibold mb-3">
                        Recent Transactions
                    </h2>
                    <RecentTransactions
                        transactions={recentTransactions.data}
                    />
                </div>

                {/* Credit History with Filters */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            Credit History
                        </h2>
                    </div>

                    <CreditFilter
                        onFilterChange={setFilterType}
                        onSearchChange={setSearchTerm}
                        activeFilter={filterType}
                        searchTerm={searchTerm}
                    />

                    <CreditHistory
                        credits={filteredCredits}
                        pagination={pagination}
                    />
                </div>
            </div>
        </AgencyLayout>
    );
}
