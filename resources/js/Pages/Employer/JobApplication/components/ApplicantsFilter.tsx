import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Badge } from "@/Components/ui/badge";
import { Search, X } from "lucide-react";
import { calculateMaidJobMatch } from "@/utils/matchingUtils";

export default function ApplicantsFilter({
    onClose,
    onFilter,
    allApplicants,
    selectedJobId,
}: any) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilters, setStatusFilters] = useState<any[]>([]);
    const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState("newest");

    // Generate unique status options from applicants
    const statusOptions = [
        ...new Set(allApplicants.map((app: any) => app.application.status)),
    ];

    const handleApplyFilters = () => {
        let filtered = [...allApplicants];

        // Filter by job ID if selected
        if (selectedJobId !== null) {
            filtered = filtered.filter(
                (app) => app.job_posting_id === selectedJobId
            );
        }

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((app) => {
                const maid = app.application.maid;
                const name =
                    `${maid.user.profile.first_name} ${maid.user.profile.last_name}`.toLowerCase();
                const skills = maid.skills
                    ? maid.skills.join(" ").toLowerCase()
                    : "";
                return name.includes(query) || skills.includes(query);
            });
        }

        // Apply status filters
        if (statusFilters.length > 0) {
            filtered = filtered.filter((app) =>
                statusFilters.includes(app.application.status)
            );
        }

        // Apply experience filter
        if (experienceLevel) {
            filtered = filtered.filter((app) => {
                const years = app.application.maid.years_experience || 0;
                return experienceLevel === "novice" ? years < 2 : years >= 2;
            });
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return (
                        new Date(b.application.applied_at).getTime() -
                        new Date(a.application.applied_at).getTime()
                    );
                case "oldest":
                    return (
                        new Date(a.application.applied_at).getTime() -
                        new Date(b.application.applied_at).getTime()
                    );
                case "name_asc":
                    return `${a.application.maid.user.profile.first_name}`.localeCompare(
                        `${b.application.maid.user.profile.first_name}`
                    );
                case "best_match":
                    // Calculate match score for each applicant
                    const applicantScores = filtered.map((app) => {
                        const jobPosting = allApplicants.find(
                            (j: any) => j.id === app.job_posting_id
                        );
                        const score = jobPosting
                            ? calculateMaidJobMatch(
                                  app.application.maid,
                                  jobPosting
                              )
                            : null;
                        return { app, score: score?.percentage || 0 };
                    });

                    // Sort by match score (highest first)
                    applicantScores.sort((a, b) => b.score - a.score);

                    // Extract just the applications
                    filtered = applicantScores.map((item) => item.app);
                    return 0;
                default:
                    return 0;
            }
        });

        onFilter(filtered);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setStatusFilters([]);
        setExperienceLevel(null);
        setSortBy("newest");
    };

    const toggleStatus = (status: any) => {
        setStatusFilters((prev) =>
            prev.includes(status)
                ? prev.filter((s) => s !== status)
                : [...prev, status]
        );
    };

    return (
        <div className="space-y-4 mb-6">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by name or skills..."
                    className="pl-10 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Status filter */}
            <div>
                <Label className="text-xs font-medium block mb-2">
                    Application Status
                </Label>
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                        <Badge
                            key={String(status)}
                            variant={
                                statusFilters.includes(status)
                                    ? "default"
                                    : "outline"
                            }
                            className="capitalize cursor-pointer text-xs"
                            onClick={() => toggleStatus(status)}
                        >
                            {String(status)}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Experience filter */}
            <div>
                <Label className="text-xs font-medium block mb-2">
                    Experience Level
                </Label>
                <RadioGroup
                    value={experienceLevel || ""}
                    onValueChange={(value) => setExperienceLevel(value || null)}
                    className="space-y-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="novice"
                            id="novice"
                            className="h-4 w-4"
                        />
                        <Label htmlFor="novice" className="text-sm">
                            Novice (0-2 years)
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="experienced"
                            id="experienced"
                            className="h-4 w-4"
                        />
                        <Label htmlFor="experienced" className="text-sm">
                            Experienced (2+ years)
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="" id="any" className="h-4 w-4" />
                        <Label htmlFor="any" className="text-sm">
                            Any experience
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Sort options */}
            <div>
                <Label className="text-xs font-medium block mb-2">
                    Sort By
                </Label>
                <RadioGroup
                    value={sortBy}
                    onValueChange={setSortBy}
                    className="space-y-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="newest"
                            id="newest"
                            className="h-4 w-4"
                        />
                        <Label htmlFor="newest" className="text-sm">
                            Newest first
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="oldest"
                            id="oldest"
                            className="h-4 w-4"
                        />
                        <Label htmlFor="oldest" className="text-sm">
                            Oldest first
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="name_asc"
                            id="name"
                            className="h-4 w-4"
                        />
                        <Label htmlFor="name" className="text-sm">
                            Name (A-Z)
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem
                            value="best_match"
                            id="best_match"
                            className="h-4 w-4"
                        />
                        <Label htmlFor="best_match" className="text-sm">
                            Best match first
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="text-xs"
                >
                    Close
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={resetFilters}
                    className="text-xs"
                >
                    Reset
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleApplyFilters}
                    className="text-xs"
                >
                    Apply Filters
                </Button>
            </div>
        </div>
    );
}
