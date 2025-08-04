import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface SearchAndFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedJobId: string | null;
    onJobChange: (jobId: string | null) => void;
    jobPostings: any[];
}

export default function SearchAndFilters({
    searchQuery,
    onSearchChange,
    selectedJobId,
    onJobChange,
    jobPostings,
}: SearchAndFiltersProps) {
    return (
        <div className="flex flex-col gap-4 mb-6 sm:flex-row">
            {/* Search input */}
            <div className="flex-1">
                <Input
                    placeholder="Search by name or job title..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Job filter */}
            <div className="w-full sm:w-60">
                <Select
                    value={selectedJobId || "all"}
                    onValueChange={(value) =>
                        onJobChange(value === "all" ? null : value)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by job" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Jobs</SelectItem>
                        {jobPostings.map((job) => (
                            <SelectItem key={job.id} value={job.id.toString()}>
                                {job.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
