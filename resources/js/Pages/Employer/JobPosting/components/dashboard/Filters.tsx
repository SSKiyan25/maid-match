import { Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Card, CardContent } from "@/Components/ui/card";

interface JobPostingFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    statusFilter: "all" | "active" | "archived";
    onStatusChange: (value: "all" | "active" | "archived") => void;
    sortBy: "newest" | "oldest" | "title";
    onSortChange: (value: "newest" | "oldest" | "title") => void;
}

export default function JobPostingFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusChange,
    sortBy,
    onSortChange,
}: JobPostingFiltersProps) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:items-center">
                    {/* Search */}
                    <div className="relative w-full md:flex-1 max-w-md">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search job postings..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 w-full"
                        />
                    </div>

                    {/* Filters Row for Mobile */}
                    <div className="flex w-full gap-2 md:w-auto md:gap-4">
                        {/* Status Filter */}
                        <Select
                            value={statusFilter}
                            onValueChange={onStatusChange}
                        >
                            <SelectTrigger className="w-full md:w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="archived">
                                    Archived
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={onSortChange}>
                            <SelectTrigger className="w-full md:w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                                <SelectItem value="title">Title A-Z</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
