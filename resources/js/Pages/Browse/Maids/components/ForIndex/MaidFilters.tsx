import { Search, Filter, X, Briefcase, SortDesc, Loader2 } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/Components/ui/sheet";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";

interface MaidFiltersProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    skills: string[];
    languages: string[];
    selectedSkills: string[];
    selectedLanguages: string[];
    onSkillsChange: (skills: string[]) => void;
    onLanguagesChange: (languages: string[]) => void;
    jobPostings: any[];
    selectedJobPosting: string | null;
    onJobPostingChange: (jobId: string | null) => void;
    sortOrder: "match" | "recent" | "name";
    onSortOrderChange: (order: "match" | "recent" | "name") => void;
    isLoading?: boolean;
}

export default function MaidFilters({
    searchTerm,
    onSearchChange,
    skills,
    languages,
    selectedSkills,
    selectedLanguages,
    onSkillsChange,
    onLanguagesChange,
    jobPostings,
    selectedJobPosting,
    onJobPostingChange,
    sortOrder,
    onSortOrderChange,
    isLoading = false,
}: MaidFiltersProps) {
    const ALL_JOB_POSTINGS_VALUE = "all_job_postings";

    const handleSkillToggle = (skill: string) => {
        if (selectedSkills.includes(skill)) {
            onSkillsChange(selectedSkills.filter((s) => s !== skill));
        } else {
            onSkillsChange([...selectedSkills, skill]);
        }
    };

    const handleLanguageToggle = (language: string) => {
        if (selectedLanguages.includes(language)) {
            onLanguagesChange(selectedLanguages.filter((l) => l !== language));
        } else {
            onLanguagesChange([...selectedLanguages, language]);
        }
    };

    const clearFilters = () => {
        onSkillsChange([]);
        onLanguagesChange([]);
        onJobPostingChange(null);
    };

    const hasActiveFilters =
        selectedSkills.length > 0 ||
        selectedLanguages.length > 0 ||
        selectedJobPosting !== null;

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name or agency..."
                        className="pl-9 h-11"
                        value={searchTerm || ""}
                        onChange={(e) => onSearchChange(e.target.value)}
                        disabled={isLoading}
                    />
                    {isLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                    )}
                </div>

                {/* Sort Order Dropdown */}
                <Select
                    value={sortOrder}
                    onValueChange={(value) =>
                        onSortOrderChange(value as "match" | "recent" | "name")
                    }
                    disabled={isLoading}
                >
                    <SelectTrigger className="w-[180px] h-11">
                        <SortDesc className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="match">Best Match</SelectItem>
                        <SelectItem value="recent">Recently Added</SelectItem>
                        <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                </Select>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="default"
                            className={cn(
                                "h-11",
                                hasActiveFilters && "bg-primary/10"
                            )}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Filter className="h-4 w-4 mr-2" />
                            )}
                            Filters
                            {hasActiveFilters && (
                                <Badge
                                    variant="secondary"
                                    className="ml-2 bg-primary text-primary-foreground"
                                >
                                    {selectedSkills.length +
                                        selectedLanguages.length +
                                        (selectedJobPosting ? 1 : 0)}
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-md">
                        <SheetHeader className="pb-4">
                            <SheetTitle className="text-left">
                                Filter Maids
                            </SheetTitle>
                        </SheetHeader>

                        <div className="space-y-6">
                            {/* Job Posting Filter */}
                            {jobPostings.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-medium">
                                            Match with Job Posting
                                        </h4>
                                        {selectedJobPosting && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                    onJobPostingChange(null)
                                                }
                                                className="h-auto p-0 text-muted-foreground text-xs"
                                                disabled={isLoading}
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>

                                    <Select
                                        value={
                                            selectedJobPosting ||
                                            ALL_JOB_POSTINGS_VALUE
                                        }
                                        onValueChange={(value) =>
                                            onJobPostingChange(
                                                value === ALL_JOB_POSTINGS_VALUE
                                                    ? null
                                                    : value
                                            )
                                        }
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a job posting..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem
                                                value={ALL_JOB_POSTINGS_VALUE}
                                            >
                                                All Job Postings
                                            </SelectItem>
                                            {jobPostings.map((job) => (
                                                <SelectItem
                                                    key={job.id}
                                                    value={job.id.toString()}
                                                >
                                                    {job.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <p className="text-xs text-muted-foreground mt-2">
                                        <Briefcase className="h-3 w-3 inline-block mr-1" />
                                        Filter and sort maids based on how well
                                        they match your job posting
                                    </p>
                                </div>
                            )}

                            {/* Skills Filter */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium">
                                        Skills
                                    </h4>
                                    {selectedSkills.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onSkillsChange([])}
                                            className="h-auto p-0 text-muted-foreground text-xs"
                                            disabled={isLoading}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                                <ScrollArea className="h-[160px]">
                                    <div className="space-y-3">
                                        {skills.map((skill) => (
                                            <div
                                                key={skill}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`skill-${skill}`}
                                                    checked={selectedSkills.includes(
                                                        skill
                                                    )}
                                                    onCheckedChange={() =>
                                                        handleSkillToggle(skill)
                                                    }
                                                    disabled={isLoading}
                                                />
                                                <Label
                                                    htmlFor={`skill-${skill}`}
                                                    className={cn(
                                                        "text-sm cursor-pointer",
                                                        isLoading &&
                                                            "opacity-70"
                                                    )}
                                                >
                                                    {skill}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Languages Filter */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium">
                                        Languages
                                    </h4>
                                    {selectedLanguages.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                onLanguagesChange([])
                                            }
                                            className="h-auto p-0 text-muted-foreground text-xs"
                                            disabled={isLoading}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </div>
                                <ScrollArea className="h-[160px]">
                                    <div className="space-y-3">
                                        {languages.map((language) => (
                                            <div
                                                key={language}
                                                className="flex items-center space-x-2"
                                            >
                                                <Checkbox
                                                    id={`language-${language}`}
                                                    checked={selectedLanguages.includes(
                                                        language
                                                    )}
                                                    onCheckedChange={() =>
                                                        handleLanguageToggle(
                                                            language
                                                        )
                                                    }
                                                    disabled={isLoading}
                                                />
                                                <Label
                                                    htmlFor={`language-${language}`}
                                                    className={cn(
                                                        "text-sm cursor-pointer",
                                                        isLoading &&
                                                            "opacity-70"
                                                    )}
                                                >
                                                    {language
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        language.slice(1)}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-between pt-4 border-t">
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        disabled={isLoading}
                                    >
                                        Clear All Filters
                                    </Button>
                                )}
                                <SheetClose asChild>
                                    <Button
                                        className="ml-auto"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Applying...
                                            </>
                                        ) : (
                                            "Apply Filters"
                                        )}
                                    </Button>
                                </SheetClose>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {selectedJobPosting && (
                        <Badge
                            variant="outline"
                            className={cn(
                                "px-2 py-1 border-primary/20 bg-primary/5",
                                isLoading && "opacity-70"
                            )}
                        >
                            <Briefcase className="h-3 w-3 mr-1 text-primary" />
                            {jobPostings.find(
                                (j) => j.id.toString() === selectedJobPosting
                            )?.title || "Job Posting"}
                            <button
                                className={cn(
                                    "ml-2 rounded-full hover:bg-background/20",
                                    isLoading && "cursor-not-allowed"
                                )}
                                onClick={() =>
                                    !isLoading && onJobPostingChange(null)
                                }
                                disabled={isLoading}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    )}

                    {selectedSkills.map((skill) => (
                        <Badge
                            key={`selected-${skill}`}
                            variant="outline"
                            className={cn(
                                "px-2 py-1",
                                isLoading && "opacity-70"
                            )}
                        >
                            {skill}
                            <button
                                className={cn(
                                    "ml-2 rounded-full hover:bg-background/20",
                                    isLoading && "cursor-not-allowed"
                                )}
                                onClick={() =>
                                    !isLoading && handleSkillToggle(skill)
                                }
                                disabled={isLoading}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}

                    {selectedLanguages.map((language) => (
                        <Badge
                            key={`selected-${language}`}
                            variant="outline"
                            className={cn(
                                "px-2 py-1",
                                isLoading && "opacity-70"
                            )}
                        >
                            {language.charAt(0).toUpperCase() +
                                language.slice(1)}
                            <button
                                className={cn(
                                    "ml-2 rounded-full hover:bg-background/20",
                                    isLoading && "cursor-not-allowed"
                                )}
                                onClick={() =>
                                    !isLoading && handleLanguageToggle(language)
                                }
                                disabled={isLoading}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}

                    {isLoading && (
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Updating results...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
