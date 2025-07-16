import { Search, Filter, SortAsc } from "lucide-react";
import { CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { FilterOptions, SortOption } from "./types";

export default function MaidSelectionHeader({
    processedMaids,
    totalMaids,
    availableCredits,
    selectedMaids,
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    filterOptions,
    setFilterOptions,
    sortOption,
    setSortOption,
    uniqueStatuses,
    getStatusCount,
    toggleStatusFilter,
    resetFilters,
}: {
    processedMaids: any[];
    totalMaids: number;
    availableCredits: number;
    selectedMaids: any[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    filterOptions: FilterOptions;
    setFilterOptions: (
        options: FilterOptions | ((prev: FilterOptions) => FilterOptions)
    ) => void;
    sortOption: SortOption;
    setSortOption: (option: SortOption) => void;
    uniqueStatuses: string[];
    getStatusCount: (status: string) => number;
    toggleStatusFilter: (status: string) => void;
    resetFilters: () => void;
}) {
    return (
        <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center">
                    <CardTitle className="text-lg">
                        Select Maids to Apply
                    </CardTitle>
                    <Badge variant="outline" className="ml-3 font-normal">
                        {processedMaids.length} of {totalMaids} maids
                    </Badge>
                </div>

                <Badge variant="outline" className="font-normal">
                    Credits: {availableCredits - selectedMaids.length} /{" "}
                    {availableCredits}
                </Badge>
            </div>

            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <div className="relative flex-grow">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name or skills..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="h-4 w-4 mr-1" />
                        {filterOptions.status.length > 0 ||
                        filterOptions.isPremium !== null ||
                        filterOptions.isTrained !== null ||
                        filterOptions.matchQuality !== null ||
                        filterOptions.sameLocation !== null
                            ? "Filters (Active)"
                            : "Filters"}
                    </Button>

                    <Select
                        value={sortOption}
                        onValueChange={(value) =>
                            setSortOption(value as SortOption)
                        }
                    >
                        <SelectTrigger className="w-auto min-w-[160px]">
                            <div className="flex items-center">
                                <SortAsc className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Sort by" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="match_desc">
                                Best Match First
                            </SelectItem>
                            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                            <SelectItem value="name_desc">
                                Name (Z-A)
                            </SelectItem>
                            <SelectItem value="experience_asc">
                                Experience (Low-High)
                            </SelectItem>
                            <SelectItem value="experience_desc">
                                Experience (High-Low)
                            </SelectItem>
                            <SelectItem value="salary_asc">
                                Salary (Low-High)
                            </SelectItem>
                            <SelectItem value="salary_desc">
                                Salary (High-Low)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Filter options */}
            {showFilters && (
                <FilterPanel
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    uniqueStatuses={uniqueStatuses}
                    getStatusCount={getStatusCount}
                    toggleStatusFilter={toggleStatusFilter}
                    resetFilters={resetFilters}
                />
            )}
        </CardHeader>
    );
}

function FilterPanel({
    filterOptions,
    setFilterOptions,
    uniqueStatuses,
    getStatusCount,
    toggleStatusFilter,
    resetFilters,
}: {
    filterOptions: FilterOptions;
    setFilterOptions: (
        options: FilterOptions | ((prev: FilterOptions) => FilterOptions)
    ) => void;
    uniqueStatuses: string[];
    getStatusCount: (status: string) => number;
    toggleStatusFilter: (status: string) => void;
    resetFilters: () => void;
}) {
    return (
        <div className="mt-3 p-3 bg-muted/70 rounded-md space-y-3">
            <div>
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                    {uniqueStatuses.map((status) => (
                        <Badge
                            key={status}
                            variant={
                                filterOptions.status.includes(status)
                                    ? "default"
                                    : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() => toggleStatusFilter(status)}
                        >
                            {status} ({getStatusCount(status)})
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium mb-2">Match Quality</h3>
                <div className="flex flex-wrap gap-2">
                    {["excellent", "good", "fair", "poor"].map((quality) => (
                        <Badge
                            key={quality}
                            variant={
                                filterOptions.matchQuality === quality
                                    ? "default"
                                    : "outline"
                            }
                            className="cursor-pointer"
                            onClick={() =>
                                setFilterOptions((prev) => ({
                                    ...prev,
                                    matchQuality:
                                        prev.matchQuality === quality
                                            ? null
                                            : quality,
                                }))
                            }
                        >
                            {quality.charAt(0).toUpperCase() + quality.slice(1)}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="sameLocation"
                            checked={filterOptions.sameLocation === true}
                            onCheckedChange={(checked) =>
                                setFilterOptions((prev) => ({
                                    ...prev,
                                    sameLocation:
                                        checked === true
                                            ? true
                                            : checked === false
                                            ? false
                                            : null,
                                }))
                            }
                        />
                        <label
                            htmlFor="sameLocation"
                            className="text-sm font-medium"
                        >
                            Same City as Job
                        </label>
                    </div>

                    <Checkbox
                        id="premium"
                        checked={filterOptions.isPremium === true}
                        onCheckedChange={(checked) =>
                            setFilterOptions((prev) => ({
                                ...prev,
                                isPremium:
                                    checked === true
                                        ? true
                                        : checked === false
                                        ? false
                                        : null,
                            }))
                        }
                    />
                    <label htmlFor="premium" className="text-sm font-medium">
                        Premium Only
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="trained"
                        checked={filterOptions.isTrained === true}
                        onCheckedChange={(checked) =>
                            setFilterOptions((prev) => ({
                                ...prev,
                                isTrained:
                                    checked === true
                                        ? true
                                        : checked === false
                                        ? false
                                        : null,
                            }))
                        }
                    />
                    <label htmlFor="trained" className="text-sm font-medium">
                        Trained Only
                    </label>
                </div>
            </div>

            <div className="flex justify-end">
                <Button variant="destructive" size="sm" onClick={resetFilters}>
                    Reset All Filters
                </Button>
            </div>
        </div>
    );
}
