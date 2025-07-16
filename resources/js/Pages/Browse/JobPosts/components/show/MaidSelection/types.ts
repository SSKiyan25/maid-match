export type FilterOptions = {
    status: string[];
    isPremium: boolean | null;
    isTrained: boolean | null;
    matchQuality: string | null;
    sameLocation: boolean | null;
    hideApplied: boolean;
};

export type SortOption =
    | "name_asc"
    | "name_desc"
    | "experience_asc"
    | "experience_desc"
    | "salary_asc"
    | "salary_desc"
    | "match_desc";
