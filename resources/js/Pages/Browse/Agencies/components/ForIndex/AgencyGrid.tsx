import { Loader2 } from "lucide-react";
import AgencyCard from "./AgencyCard/index";

interface AgencyGridProps {
    agencies: any[];
    emptyMessage?: string;
    isLoading?: boolean;
    highlightPremium?: boolean;
    highlightVerified?: boolean;
    highlightMaidCount?: boolean;
    highlightNew?: boolean;
}

export default function AgencyGrid({
    agencies,
    emptyMessage = "No agencies found",
    isLoading = false,
    highlightPremium = false,
    highlightVerified = false,
    highlightMaidCount = false,
    highlightNew = false,
}: AgencyGridProps) {
    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary/70" />
                <span className="ml-3 text-muted-foreground">
                    Loading agencies...
                </span>
            </div>
        );
    }

    if (!agencies || agencies.length === 0) {
        return (
            <div className="w-full flex justify-center items-center py-16">
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {agencies.map((agency) => (
                <AgencyCard
                    key={agency.id}
                    agency={agency}
                    compact={true}
                    highlightPremium={highlightPremium}
                    highlightVerified={highlightVerified}
                    highlightMaidCount={highlightMaidCount}
                    highlightNew={highlightNew}
                />
            ))}
        </div>
    );
}
