import { useState, useEffect } from "react";
import MaidCard from "./MaidCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { router } from "@inertiajs/react";
import { Inbox } from "lucide-react";
import { MaidData } from "@/types";

interface MaidsListProps {
    maids: MaidData[];
    filters: {
        search: string;
        status: string;
        sortBy: string;
    };
}

export default function MaidsList({ maids, filters }: MaidsListProps) {
    const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");
    const [filteredMaids, setFilteredMaids] = useState<MaidData[]>(maids);
    const [maidToArchive, setMaidToArchive] = useState<number | null>(null);

    // Apply filters when they change
    useEffect(() => {
        let result = [...maids];

        // Filter by search
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter((maid) => {
                const fullName =
                    `${maid.maid.user.profile.first_name} ${maid.maid.user.profile.last_name}`.toLowerCase();
                const skills = maid.maid.skills.join(" ").toLowerCase();
                return (
                    fullName.includes(searchLower) ||
                    skills.includes(searchLower)
                );
            });
        }

        // Filter by status
        if (filters.status !== "all") {
            result = result.filter(
                (maid) => maid.maid.status === filters.status
            );
        }

        // Sort results
        switch (filters.sortBy) {
            case "newest":
                result.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                );
                break;
            case "oldest":
                result.sort(
                    (a, b) =>
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                );
                break;
            case "name_asc":
                result.sort((a, b) => {
                    const nameA = `${a.maid.user.profile.first_name} ${a.maid.user.profile.last_name}`;
                    const nameB = `${b.maid.user.profile.first_name} ${b.maid.user.profile.last_name}`;
                    return nameA.localeCompare(nameB);
                });
                break;
            case "name_desc":
                result.sort((a, b) => {
                    const nameA = `${a.maid.user.profile.first_name} ${a.maid.user.profile.last_name}`;
                    const nameB = `${b.maid.user.profile.first_name} ${b.maid.user.profile.last_name}`;
                    return nameB.localeCompare(nameA);
                });
                break;
            case "salary_low":
                result.sort(
                    (a, b) =>
                        parseFloat(a.maid.expected_salary) -
                        parseFloat(b.maid.expected_salary)
                );
                break;
            case "salary_high":
                result.sort(
                    (a, b) =>
                        parseFloat(b.maid.expected_salary) -
                        parseFloat(a.maid.expected_salary)
                );
                break;
            case "experience":
                result.sort(
                    (a, b) => b.maid.years_experience - a.maid.years_experience
                );
                break;
        }

        setFilteredMaids(result);
    }, [maids, filters]);

    const handleArchive = (id: number) => {
        setMaidToArchive(id);
    };

    const confirmArchive = () => {
        if (maidToArchive) {
            router.delete(route("agency.maids.destroy", maidToArchive));
        }
        setMaidToArchive(null);
    };

    if (filteredMaids.length === 0) {
        return (
            <div className="bg-card border rounded-lg p-12 text-center">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Inbox className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">No maids found</h3>
                    <p className="text-muted-foreground max-w-md">
                        {filters.search || filters.status !== "all"
                            ? "No maids match your current filters. Try adjusting your search criteria."
                            : "You haven't added any maids to your agency yet. Click 'Add New Maid' to get started."}
                    </p>
                    {(filters.search || filters.status !== "all") && (
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.get(route("agency.maids.index"))
                            }
                            className="mt-2"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    <span className="font-medium">{filteredMaids.length}</span>{" "}
                    of <span className="font-medium">{maids.length}</span> maids
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground mr-1">
                        View:
                    </span>
                    {/* For mobile: only show Grid View option */}
                    <div className="md:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3"
                            onClick={() => setDisplayMode("grid")}
                            disabled={displayMode === "grid"}
                        >
                            Grid
                        </Button>
                    </div>

                    {/* For desktop: show full select dropdown */}
                    <div className="hidden md:block">
                        <Select
                            value={displayMode}
                            onValueChange={(value) =>
                                setDisplayMode(value as "grid" | "list")
                            }
                        >
                            <SelectTrigger className="h-8 w-[120px]">
                                <SelectValue placeholder="Display" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="grid">Grid View</SelectItem>
                                <SelectItem value="list">List View</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div
                className={
                    displayMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-4"
                }
            >
                {filteredMaids.map((maid) => (
                    <MaidCard
                        key={maid.id}
                        maid={maid}
                        onArchive={handleArchive}
                    />
                ))}
            </div>
        </div>
    );
}
