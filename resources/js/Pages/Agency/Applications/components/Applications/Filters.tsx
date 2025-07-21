import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useState, useMemo } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/Components/ui/sheet";

interface ApplicationsFiltersProps {
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onJobPostingChange: (value: string) => void;
    statusFilter: string;
    jobPostingFilter: string;
    searchTerm: string;
    totalCount: number;
    applications: any[];
}

export default function ApplicationsFilters({
    onSearchChange,
    onStatusChange,
    onJobPostingChange,
    statusFilter,
    jobPostingFilter,
    searchTerm,
    totalCount,
    applications,
}: ApplicationsFiltersProps) {
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Extract unique job postings from applications
    const jobPostings = useMemo(() => {
        const uniquePostings = new Map();

        applications.forEach((app) => {
            if (app.job_posting && !uniquePostings.has(app.job_posting.id)) {
                uniquePostings.set(app.job_posting.id, {
                    id: app.job_posting.id,
                    title: app.job_posting.title || "Untitled Job",
                });
            }
        });

        return [
            { value: "all", label: "All Job Postings" },
            ...Array.from(uniquePostings.values()).map((posting) => ({
                value: posting.id.toString(),
                label: posting.title,
            })),
        ];
    }, [applications]);

    const statuses = [
        { value: "all", label: "All Statuses" },
        { value: "pending", label: "Pending" },
        { value: "shortlisted", label: "Shortlisted" },
        { value: "hired", label: "Hired" },
        { value: "rejected", label: "Rejected" },
        { value: "withdrawn", label: "Withdrawn" },
    ];

    // Clear all filters
    const handleClearFilters = () => {
        onSearchChange("");
        onStatusChange("all");
        onJobPostingChange("all");
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                {/* Results count */}
                <div className="text-sm text-muted-foreground">
                    {totalCount} application{totalCount !== 1 ? "s" : ""} found
                </div>

                {/* Desktop filters */}
                <div className="hidden md:flex items-center gap-3">
                    {/* Job Posting filter */}
                    <div className="w-[220px]">
                        <Select
                            value={jobPostingFilter}
                            onValueChange={onJobPostingChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by job posting" />
                            </SelectTrigger>
                            <SelectContent>
                                {jobPostings.map((posting) => (
                                    <SelectItem
                                        key={posting.value}
                                        value={posting.value}
                                    >
                                        {posting.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status filter */}
                    <div className="w-[180px]">
                        <Select
                            value={statusFilter}
                            onValueChange={onStatusChange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search */}
                    <div className="relative w-[250px]">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by maid or job title..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9"
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-9 w-9"
                                onClick={() => onSearchChange("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {(searchTerm ||
                        statusFilter !== "all" ||
                        jobPostingFilter !== "all") && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                        >
                            Clear filters
                        </Button>
                    )}
                </div>

                {/* Mobile filter button */}
                <div className="flex md:hidden items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowMobileFilters(true)}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Mobile filters sheet */}
            <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetContent side="bottom" className="h-[50vh]">
                    <SheetHeader>
                        <SheetTitle>Filter Applications</SheetTitle>
                    </SheetHeader>

                    <div className="py-6 space-y-6">
                        {/* Job Posting filter for mobile */}
                        <div className="space-y-2">
                            <Label>Job Posting</Label>
                            <Select
                                value={jobPostingFilter}
                                onValueChange={(val) => {
                                    onJobPostingChange(val);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by job posting" />
                                </SelectTrigger>
                                <SelectContent>
                                    {jobPostings.map((posting) => (
                                        <SelectItem
                                            key={posting.value}
                                            value={posting.value}
                                        >
                                            {posting.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status filter for mobile */}
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={statusFilter}
                                onValueChange={(val) => {
                                    onStatusChange(val);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <SheetFooter>
                        <div className="flex gap-3 w-full">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={handleClearFilters}
                            >
                                Clear filters
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => setShowMobileFilters(false)}
                            >
                                Apply filters
                            </Button>
                        </div>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}
