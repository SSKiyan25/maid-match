import SearchResultCard from "./SearchResultCard";
import { Loader2 } from "lucide-react";

interface SearchResultsListProps {
    maids: any[];
    isLoading?: boolean;
    selectedJobId?: string | null;
    emptyMessage?: string;
}

export default function SearchResultsList({
    maids,
    isLoading = false,
    selectedJobId,
    emptyMessage = "No maids found matching your search criteria",
}: SearchResultsListProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading results...</p>
            </div>
        );
    }

    if (!maids || maids.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-muted rounded-full p-4 mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                    >
                        <path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" />
                        <path d="M7 16v6" />
                        <path d="M13 16v6" />
                        <path d="M17 10v.2a3 3 0 0 0 1.1 5.8H22v0h0a3 3 0 0 0 1-5.8V10a3 3 0 0 0-6 0Z" />
                        <path d="M7 7V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v4" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium mb-1">No results found</h3>
                <p className="text-muted-foreground text-sm max-w-sm">
                    {emptyMessage}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {maids.map((maid) => (
                <SearchResultCard
                    key={maid.id}
                    maid={maid}
                    selectedJobId={selectedJobId}
                />
            ))}
        </div>
    );
}
