import { Sparkles, UserSearch, Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MaidHeaderProps {
    searchTerm: string;
    totalMatches?: number;
}

export default function MaidHeader({
    searchTerm,
    totalMatches = 0,
}: MaidHeaderProps) {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    // Handle search submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (localSearchTerm.trim()) {
            window.location.href = `/browse/maids/search?query=${encodeURIComponent(
                localSearchTerm
            )}`;
        }
    };

    return (
        <div className="space-y-6">
            {/* Main Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">
                            <UserSearch className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            Find Your Perfect Match
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">
                        Browse through qualified maids that match your
                        requirements.
                        {totalMatches > 0 && (
                            <span className="font-medium text-foreground">
                                {" "}
                                We found {totalMatches} candidates that might
                                suit your needs.
                            </span>
                        )}
                    </p>
                </div>

                <div className="hidden md:flex items-center px-4 py-2 bg-primary/5 rounded-lg">
                    <Sparkles className="h-5 w-5 text-primary mr-2" />
                    <span className="text-sm font-medium">
                        Matches updated daily
                    </span>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full">
                <div
                    className={cn(
                        "flex gap-3 p-4 rounded-lg border bg-card shadow-sm",
                        "transition-all duration-200 hover:shadow-md"
                    )}
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name..."
                            className="pl-9 w-full text-xs sm:text-sm"
                            value={localSearchTerm || ""}
                            onChange={(e) => setLocalSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="shrink-0" size="default">
                        <Search className="h-4 w-4 mr-2" />
                        <span className="sm:inline">Search</span>
                    </Button>
                </div>
            </form>
        </div>
    );
}
