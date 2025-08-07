import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import { Label } from "@/Components/ui/label";
import { useState } from "react";

interface AgencyFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    sortOrder: string;
    onSortOrderChange: (value: string) => void;
    isLoading?: boolean;
}

export default function AgencyFilters({
    searchTerm,
    onSearchChange,
    sortOrder,
    onSortOrderChange,
    isLoading = false,
}: AgencyFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { value: "featured", label: "Featured" },
        { value: "name", label: "Name (A-Z)" },
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "most_maids", label: "Most Maids" },
    ];

    const handleSortChange = (value: string) => {
        onSortOrderChange(value);
    };

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search agencies by name or description..."
                    className="pl-8 pr-4"
                    value={searchTerm || ""}
                    onChange={(e) => onSearchChange(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            {/* Desktop Sort Dropdown */}
            <div className="hidden sm:flex sm:items-center gap-2">
                <Label htmlFor="sort-order" className="whitespace-nowrap">
                    Sort by:
                </Label>
                <Select
                    value={sortOrder}
                    onValueChange={handleSortChange}
                    disabled={isLoading}
                >
                    <SelectTrigger id="sort-order" className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Mobile Filters Button */}
            <div className="sm:hidden">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full flex items-center justify-center"
                            disabled={isLoading}
                        >
                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                            Sort & Filter
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-80">
                        <SheetHeader>
                            <SheetTitle>Sort & Filter</SheetTitle>
                            <SheetDescription>
                                Adjust how agencies are displayed
                            </SheetDescription>
                        </SheetHeader>
                        <div className="py-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="mobile-sort">Sort by</Label>
                                <Select
                                    value={sortOrder}
                                    onValueChange={(value) => {
                                        handleSortChange(value);
                                        setIsOpen(false);
                                    }}
                                >
                                    <SelectTrigger id="mobile-sort">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="w-full"
                                onClick={() => setIsOpen(false)}
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
