import React, { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";

interface SearchBarProps {
    initialSearchTerm?: string;
}

export default function SearchBar({ initialSearchTerm = "" }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (searchTerm.trim()) {
            router.get(route("browse.job-posts.search"), {
                search: searchTerm,
            });
        }
    };

    const handleNearMe = () => {
        router.get(route("browse.job-posts.near-you"));
    };

    return (
        <form
            onSubmit={handleSearch}
            className="rounded-xl bg-card p-4 shadow-sm space-y-4"
        >
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search job titles, locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-xs sm:text-sm"
                />
            </div>

            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs justify-start"
                    onClick={handleNearMe}
                >
                    <MapPin className="mr-2 h-3.5 w-3.5" />
                    Near Me
                </Button>

                <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    className="flex-1 text-xs"
                    disabled={searchTerm.trim() === ""}
                >
                    <Search className="mr-2 h-3.5 w-3.5" />
                    Search Jobs
                </Button>
            </div>
        </form>
    );
}
