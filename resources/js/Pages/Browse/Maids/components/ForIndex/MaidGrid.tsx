import { Loader2 } from "lucide-react";
import MaidCard from "./MaidCard/index";

interface MaidGridProps {
    maids: any[];
    emptyMessage?: string;
    compact?: boolean;
    useComputedMatch?: boolean;
    selectedJobId?: string | null;
    isLoading?: boolean;
    showMatchBadge?: boolean;
    showLocationBadge?: boolean;
    showBookmarked?: boolean;
}

export default function MaidGrid({
    maids,
    emptyMessage = "No maids found",
    compact = false,
    useComputedMatch = true,
    selectedJobId = null,
    isLoading = false,
    showMatchBadge = false,
    showLocationBadge = false,
    showBookmarked = false,
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
                    showMatchBadge={showMatchBadge || !!selectedJobId}
                    showLocationBadge={showLocationBadge}
                    showBookmarked={showBookmarked}
                    useComputedMatch={useComputedMatch}
                    selectedJobId={selectedJobId}
                />
            ))}
        </div>
    );
}
