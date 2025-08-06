import { Loader2 } from "lucide-react";
import MaidCard from "./MaidCard";

interface MaidGridProps {
    maids: any[];
    emptyMessage?: string;
    compact?: boolean;
    useComputedMatch?: boolean;
    selectedJobId?: string | null;
    isLoading?: boolean;
}

export default function MaidGrid({
    maids,
    emptyMessage = "No maids found",
    compact = false,
    useComputedMatch = true,
    selectedJobId = null,
    isLoading = false,
}: MaidGridProps) {
    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary/70" />
                <span className="ml-3 text-muted-foreground">
                    Loading maids...
                </span>
            </div>
        );
    }

    if (!maids || maids.length === 0) {
        return (
            <div className="w-full flex justify-center items-center py-16">
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {maids.map((maid) => (
                <MaidCard
                    key={maid.id}
                    maid={maid}
                    compact={compact}
                    showMatchBadge={!!selectedJobId} // Show match badge when job is selected
                    useComputedMatch={useComputedMatch}
                    selectedJobId={selectedJobId} // Pass the selected job ID to each card
                />
            ))}
        </div>
    );
}
