import { JobPosting } from "@/types";
import { Input } from "@/Components/ui/input";
import { Search, Filter } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface ShortlistFiltersProps {
    jobPostings: JobPosting[];
    selectedJobId: number | null;
    setSelectedJobId: (id: number | null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

export default function ShortlistFilters({
    jobPostings,
    selectedJobId,
    setSelectedJobId,
    searchQuery,
    setSearchQuery,
}: ShortlistFiltersProps) {
    const handleJobChange = (value: string) => {
        setSelectedJobId(value === "all" ? null : parseInt(value, 10));
    };

    return (
        <div className="my-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                    type="search"
                    placeholder="Search by name, job title, or agency..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="w-full md:w-72">
                <Select
                    value={selectedJobId ? selectedJobId.toString() : "all"}
                    onValueChange={handleJobChange}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by job posting" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="all">
                                All job postings
                            </SelectItem>
                            {jobPostings.map((job) => (
                                <SelectItem
                                    key={job.id}
                                    value={job.id.toString()}
                                >
                                    {job.title}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
