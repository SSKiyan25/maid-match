import { useState, useMemo } from "react";
import { Card } from "@/Components/ui/card";
import { calculateMaidJobMatch } from "@/utils/matchingUtils";
import { FilterOptions, SortOption } from "./types";
import MaidSelectionHeader from "./Header";
import MaidSelectionContent from "./Content";
import MaidDetailsModal from "../MaidDetailsModal";
import { toast } from "sonner";

export default function MaidSelectionList({
    maids,
    selectedMaids,
    setSelectedMaids,
    availableCredits,
    jobPost,
    agencyApplications,
}: {
    maids: any[];
    selectedMaids: any[];
    setSelectedMaids: (maids: any[] | ((prev: any[]) => any[])) => void;
    onSelectMaid?: (maid: any) => void;
    availableCredits: number;
    jobPost: any;
    agencyApplications: any[];
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [modalMaid, setModalMaid] = useState<any | null>(null);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        status: [],
        isPremium: null,
        isTrained: null,
        matchQuality: null,
        sameLocation: null,
        hideApplied: false,
    });
    const [sortOption, setSortOption] = useState<SortOption>("match_desc");
    const [showFilters, setShowFilters] = useState(false);

    // Precalculate matches for all maids
    const maidsWithMatchScores = useMemo(() => {
        return maids.map((maidRecord) => {
            const matchResult = calculateMaidJobMatch(maidRecord.maid, jobPost);
            return {
                ...maidRecord,
                matchResult,
            };
        });
    }, [maids, jobPost]);

    // Process maids through filtering, sorting, and searching
    const processedMaids = useMemo(() => {
        return filterAndSortMaids(
            maidsWithMatchScores,
            searchQuery,
            filterOptions,
            sortOption,
            jobPost,
            agencyApplications
        );
    }, [
        maidsWithMatchScores,
        searchQuery,
        filterOptions,
        sortOption,
        jobPost,
        agencyApplications,
    ]);

    const onSelectMaid = (maid: any) => {
        const hasAlreadyApplied = agencyApplications.some(
            (app) => app.maid_id === maid.id
        );

        if (hasAlreadyApplied) {
            toast.error("This maid has already applied to this job.");
            return;
        }

        // Existing selection logic
        setSelectedMaids((prev: any[]) => {
            const isSelected = prev.some((m) => m.id === maid.id);
            if (isSelected) {
                return prev.filter((m) => m.id !== maid.id);
            } else {
                if (prev.length >= availableCredits) {
                    toast.error(
                        `You can only select up to ${availableCredits} maids.`
                    );
                    return prev;
                }
                return [...prev, maid];
            }
        });
    };

    // Get all unique statuses from the maid data
    const uniqueStatuses = Array.from(new Set(maids.map((m) => m.maid.status)));

    // Get status count for badges
    const getStatusCount = (status: string) => {
        return maids.filter((maidRecord) => maidRecord.maid.status === status)
            .length;
    };

    // Toggle status filter
    const toggleStatusFilter = (status: string) => {
        setFilterOptions((prev) => {
            const newStatus = prev.status.includes(status)
                ? prev.status.filter((s) => s !== status)
                : [...prev.status, status];

            return { ...prev, status: newStatus };
        });
    };

    // Reset all filters
    const resetFilters = () => {
        setFilterOptions({
            status: [],
            isPremium: null,
            isTrained: null,
            matchQuality: null,
            sameLocation: null,
            hideApplied: false,
        });
        setSearchQuery("");
        setSortOption("match_desc");
    };

    const isMaidSelected = (maidId: any) => {
        return selectedMaids.some((maid) => maid.id === maidId);
    };

    return (
        <>
            <Card className="shadow-sm">
                <MaidSelectionHeader
                    processedMaids={processedMaids}
                    totalMaids={maids.length}
                    availableCredits={availableCredits}
                    selectedMaids={selectedMaids}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    showFilters={showFilters}
                    setShowFilters={setShowFilters}
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    uniqueStatuses={uniqueStatuses}
                    getStatusCount={getStatusCount}
                    toggleStatusFilter={toggleStatusFilter}
                    resetFilters={resetFilters}
                />

                <MaidSelectionContent
                    processedMaids={processedMaids}
                    selectedMaids={selectedMaids}
                    isMaidSelected={isMaidSelected}
                    onSelectMaid={onSelectMaid}
                    availableCredits={availableCredits}
                    jobPost={jobPost}
                    setModalMaid={setModalMaid}
                    agencyApplications={agencyApplications}
                />
            </Card>

            <MaidDetailsModal
                maid={modalMaid}
                open={!!modalMaid}
                onClose={() => setModalMaid(null)}
                jobPost={jobPost}
            />
        </>
    );
}

function filterAndSortMaids(
    maidsWithMatchScores: any[],
    searchQuery: string,
    filterOptions: FilterOptions,
    sortOption: SortOption,
    jobPost: any,
    agencyApplications: any[] = []
) {
    return maidsWithMatchScores
        .filter((maidRecord) => {
            const maid = maidRecord.maid;
            const fullName =
                `${maid.user.profile.first_name} ${maid.user.profile.last_name}`.toLowerCase();
            const skills = maid.skills
                ? maid.skills.join(" ").toLowerCase()
                : "";
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                fullName.includes(query) || skills.includes(query);

            const matchesStatus =
                filterOptions.status.length === 0 ||
                filterOptions.status.includes(maid.status);

            const matchesPremium =
                filterOptions.isPremium === null ||
                maid.is_premium === filterOptions.isPremium;

            const matchesTrained =
                filterOptions.isTrained === null ||
                maid.is_trained === filterOptions.isTrained;

            const matchesSameLocation =
                filterOptions.sameLocation === null ||
                (filterOptions.sameLocation === true &&
                    maid.user?.profile?.city &&
                    jobPost.location?.city &&
                    maid.user.profile.city.toLowerCase() ===
                        jobPost.location.city.toLowerCase());

            const matchesHideApplied =
                !filterOptions.hideApplied ||
                !agencyApplications.some((app) => app.maid_id === maid.id);

            let matchesQuality = true;
            if (filterOptions.matchQuality) {
                const percentage = maidRecord.matchResult.percentage;

                switch (filterOptions.matchQuality) {
                    case "excellent":
                        matchesQuality = percentage >= 80;
                        break;
                    case "good":
                        matchesQuality = percentage >= 60 && percentage < 80;
                        break;
                    case "fair":
                        matchesQuality = percentage >= 40 && percentage < 60;
                        break;
                    case "poor":
                        matchesQuality = percentage < 40;
                        break;
                }
            }

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPremium &&
                matchesTrained &&
                matchesQuality &&
                matchesSameLocation &&
                matchesHideApplied
            );
        })
        .sort((a, b) => {
            const maidA = a.maid;
            const maidB = b.maid;
            const nameA = `${maidA.user.profile.first_name} ${maidA.user.profile.last_name}`;
            const nameB = `${maidB.user.profile.first_name} ${maidB.user.profile.last_name}`;

            switch (sortOption) {
                case "name_asc":
                    return nameA.localeCompare(nameB);
                case "name_desc":
                    return nameB.localeCompare(nameA);
                case "experience_asc":
                    return (
                        (maidA.years_experience || 0) -
                        (maidB.years_experience || 0)
                    );
                case "experience_desc":
                    return (
                        (maidB.years_experience || 0) -
                        (maidA.years_experience || 0)
                    );
                case "salary_asc":
                    return (
                        parseFloat(maidA.expected_salary || "0") -
                        parseFloat(maidB.expected_salary || "0")
                    );
                case "salary_desc":
                    return (
                        parseFloat(maidB.expected_salary || "0") -
                        parseFloat(maidA.expected_salary || "0")
                    );
                case "match_desc":
                    return b.matchResult.percentage - a.matchResult.percentage;
                default:
                    return 0;
            }
        });
}
