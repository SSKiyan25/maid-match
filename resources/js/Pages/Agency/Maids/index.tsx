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
    agency: any;
    stats: any;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function MaidsIndexPage(props: MaidsIndexProps) {
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        sortBy: "newest",
    });

    useEffect(() => {
        if (props.flash?.success) {
            toast.success(props.flash.success);
        }
        if (props.flash?.error) {
            toast.error(props.flash.error);
        }
    }, [props.flash]);

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
                <MaidsHeader stats={props.stats} />
                <MaidsFilter onFilterChange={handleFilterChange} />
                <MaidsList maids={props.maids} filters={filters} />
            </div>
        </AgencyLayout>
    );
}
