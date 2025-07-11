import { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";

interface MaidsFilterProps {
    onFilterChange: (filters: {
        search: string;
        status: string;
        sortBy: string;
    }) => void;
}

export default function MaidsFilter({ onFilterChange }: MaidsFilterProps) {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        onFilterChange({ search: e.target.value, status, sortBy });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        onFilterChange({ search, status: value, sortBy });
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        onFilterChange({ search, status, sortBy: value });
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("all");
        setSortBy("newest");
        onFilterChange({ search: "", status: "all", sortBy: "newest" });
    };

    return (
        <div className="bg-card rounded-lg border p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or skill..."
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-9"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:w-auto w-full"
                >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </div>

            {showFilters && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select
                            value={status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                <SelectItem value="available">
                                    Available
                                </SelectItem>
                                <SelectItem value="employed">
                                    Employed
                                </SelectItem>
                                <SelectItem value="unavailable">
                                    Unavailable
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Sort By</label>
                        <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">
                                    Newest First
                                </SelectItem>
                                <SelectItem value="oldest">
                                    Oldest First
                                </SelectItem>
                                <SelectItem value="name_asc">
                                    Name (A-Z)
                                </SelectItem>
                                <SelectItem value="name_desc">
                                    Name (Z-A)
                                </SelectItem>
                                <SelectItem value="salary_low">
                                    Salary (Low to High)
                                </SelectItem>
                                <SelectItem value="salary_high">
                                    Salary (High to Low)
                                </SelectItem>
                                <SelectItem value="experience">
                                    Experience (Most first)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-end">
                        <Button
                            variant="ghost"
                            onClick={clearFilters}
                            className="text-muted-foreground"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Clear Filters
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
