import AgencyLayout from "@/Layouts/AgencyLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { PageProps } from "@/types";
import { toast } from "sonner";
import MaidsHeader from "./components/MaidsHeader";
import MaidsFilter from "./components/MaidsFilter";
import MaidsList from "./components/MaidsList";

interface MaidsIndexProps extends PageProps {
    maids: any[];
    agencyData: any;
    stats: any;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function MaidsIndexPage(props: MaidsIndexProps) {
    const { maids, agencyData, stats, flash } = props; // Destructure props including agencyData
    // console.log("Maids Data:", maids);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        sortBy: "newest",
    });

    useEffect(() => {
        // console.log("MaidsIndexPage props:", props);
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleFilterChange = (newFilters: {
        search: string;
        status: string;
        sortBy: string;
    }) => {
        setFilters(newFilters);
    };

    return (
        <AgencyLayout>
            <Head title="Agency Maids" />
            <div className="container px-10 py-8 pb-36 sm:py-16 sm:px-24">
                <MaidsHeader stats={stats} />
                <MaidsFilter onFilterChange={handleFilterChange} />
                <MaidsList
                    maids={maids}
                    filters={filters}
                    agency={agencyData} // Pass agencyData as agency prop if needed by MaidsList
                />
            </div>
        </AgencyLayout>
    );
}
