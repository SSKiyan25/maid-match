import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search, Filter } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useState } from "react";

interface CreditFilterProps {
    onFilterChange: (type: string) => void;
    onSearchChange: (term: string) => void;
    activeFilter: string;
    searchTerm: string;
}

export default function CreditFilter({
    onFilterChange,
    onSearchChange,
    activeFilter,
    searchTerm,
}: CreditFilterProps) {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="space-y-3 mb-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search credit history..."
                    className="pl-8 w-full"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Mobile: Toggle Filters */}
            <div className="sm:hidden">
                <Button
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className="mr-2 h-4 w-4" />
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
            </div>

            {/* Filters */}
            <div className={`${showFilters ? "block" : "hidden"} sm:block`}>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={activeFilter} onValueChange={onFilterChange}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="purchase">Purchases</SelectItem>
                            <SelectItem value="used">Used Credits</SelectItem>
                            <SelectItem value="refund">Refunds</SelectItem>
                            <SelectItem value="admin_grant">
                                Admin Grants
                            </SelectItem>
                            <SelectItem value="initial_grant">
                                Initial Grants
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}
