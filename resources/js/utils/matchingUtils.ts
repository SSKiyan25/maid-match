interface MatchFactors {
    skillMatch: number;
    languageMatch: number;
    accommodationMatch: number;
    salaryMatch: number;
    locationMatch: number;
}

export interface MatchResult {
    percentage: number;
    factors: MatchFactors;
    matchStrengths: string[];
    matchWeaknesses: string[];
}

/**
 * Calculate how well a maid matches a job posting
 *
 * @param maid The maid record
 * @param jobPost The job posting
 * @returns Match percentage and detailed match information
 */
export function calculateMaidJobMatch(maid: any, jobPost: any): MatchResult {
    // Initialize match factors
    const factors: MatchFactors = {
        skillMatch: 0,
        languageMatch: 0,
        accommodationMatch: 0,
        salaryMatch: 0,
        locationMatch: 0,
    };

    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // 1. Skills matching
    if (
        maid.skills &&
        maid.skills.length > 0 &&
        jobPost.work_types &&
        jobPost.work_types.length > 0
    ) {
        // Convert job work types to normalized skills for comparison
        const jobSkills = jobPost.work_types.map((type: string) =>
            type
                .toLowerCase()
                .replace("_", " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())
        );

        // Count matching skills
        const matchingSkills = maid.skills.filter((skill: string) =>
            jobSkills.some(
                (jobSkill: any) =>
                    jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
                    skill.toLowerCase().includes(jobSkill.toLowerCase())
            )
        );

        factors.skillMatch =
            jobSkills.length > 0
                ? Math.min(
                      100,
                      (matchingSkills.length / jobSkills.length) * 100
                  )
                : 0;

        if (matchingSkills.length > 0) {
            strengths.push(`Matches ${matchingSkills.length} required skills`);
        } else {
            weaknesses.push("No matching skills found");
        }
    }

    // 2. Language matching
    if (
        maid.languages &&
        maid.languages.length > 0 &&
        jobPost.language_preferences &&
        jobPost.language_preferences.length > 0
    ) {
        const matchingLanguages = maid.languages.filter((lang: string) =>
            jobPost.language_preferences.some(
                (jobLang: string) =>
                    jobLang.toLowerCase() === lang.toLowerCase()
            )
        );

        factors.languageMatch =
            jobPost.language_preferences.length > 0
                ? Math.min(
                      100,
                      (matchingLanguages.length /
                          jobPost.language_preferences.length) *
                          100
                  )
                : 0;

        if (matchingLanguages.length > 0) {
            strengths.push(
                `Speaks ${matchingLanguages.length} preferred languages`
            );
        } else if (jobPost.language_preferences.length > 0) {
            weaknesses.push("Doesn't speak any preferred languages");
        }
    }

    // 3. Accommodation matching
    if (maid.preferred_accommodation && jobPost.accommodation_type) {
        if (
            maid.preferred_accommodation === jobPost.accommodation_type ||
            maid.preferred_accommodation === "either"
        ) {
            factors.accommodationMatch = 100;
            strengths.push("Accommodation preference matches");
        } else {
            factors.accommodationMatch = 0;
            weaknesses.push("Accommodation preference doesn't match");
        }
    }

    // 4. Salary matching
    if (maid.expected_salary && jobPost.min_salary && jobPost.max_salary) {
        const expectedSalary = parseFloat(maid.expected_salary);
        const minSalary = parseFloat(jobPost.min_salary);
        const maxSalary = parseFloat(jobPost.max_salary);

        if (expectedSalary <= maxSalary && expectedSalary >= minSalary) {
            factors.salaryMatch = 100;
            strengths.push("Salary expectation is within budget");
        } else if (expectedSalary < minSalary) {
            // Below minimum, still a good match for employer
            factors.salaryMatch = 90;
            strengths.push(
                "Salary expectation is below budget (good for employer)"
            );
        } else {
            // Above maximum
            const overBudgetPercent =
                ((expectedSalary - maxSalary) / maxSalary) * 100;
            factors.salaryMatch = Math.max(0, 100 - overBudgetPercent);
            weaknesses.push(
                `Salary expectation is ${overBudgetPercent.toFixed(
                    0
                )}% over budget`
            );
        }
    }

    // 5. Experience - not a direct match factor but influences overall score
    let experienceBonus = 0;
    if (maid.years_experience) {
        if (maid.years_experience >= 5) {
            experienceBonus = 10;
            strengths.push("Has 5+ years of experience");
        } else if (maid.years_experience >= 3) {
            experienceBonus = 5;
            strengths.push("Has 3+ years of experience");
        }
    }

    // 6. Location Matching
    if (maid.user?.profile?.address && jobPost.location) {
        const maidAddress = maid.user.profile.address;
        const jobLocation = jobPost.location;

        // Normalize for case-insensitive comparison
        const maidBarangay = maidAddress.barangay?.toLowerCase();
        const maidCity = maidAddress.city?.toLowerCase();
        const maidProvince = maidAddress.province?.toLowerCase();

        const jobBarangay = (
            jobLocation.barangay || jobLocation.brgy
        )?.toLowerCase();
        const jobCity = jobLocation.city?.toLowerCase();
        const jobProvince = jobLocation.province?.toLowerCase();

        // Check for same barangay (brgy) and city
        if (
            maidBarangay &&
            jobBarangay &&
            maidBarangay === jobBarangay &&
            maidCity &&
            jobCity &&
            maidCity === jobCity
        ) {
            factors.locationMatch = 100;
            strengths.push(
                "Maid is located in the same barangay and city as the job"
            );
        }
        // Check for same city
        else if (maidCity && jobCity && maidCity === jobCity) {
            factors.locationMatch = 90;
            strengths.push("Maid is located in the same city as the job");
        }
        // Check for same province
        else if (maidProvince && jobProvince && maidProvince === jobProvince) {
            factors.locationMatch = 75;
            strengths.push("Maid is located in the same province as the job");
        }
        // Different province
        else {
            factors.locationMatch = 0;
            weaknesses.push("Maid is located in a different province");
        }
    }

    // Calculate overall match percentage
    // Weighted calculation
    const weights = {
        skillMatch: 0.35,
        languageMatch: 0.15,
        accommodationMatch: 0.15,
        salaryMatch: 0.1,
        locationMatch: 0.25,
    };

    let overallPercentage =
        factors.skillMatch * weights.skillMatch +
        factors.languageMatch * weights.languageMatch +
        factors.accommodationMatch * weights.accommodationMatch +
        factors.salaryMatch * weights.salaryMatch +
        factors.locationMatch * weights.locationMatch;

    // Add experience bonus (up to 10%)
    overallPercentage = Math.min(100, overallPercentage + experienceBonus);

    // Special case - if no skills match, cap the score at 60%
    if (factors.skillMatch === 0) {
        overallPercentage = Math.min(overallPercentage, 60);
    }

    // Round to whole number
    overallPercentage = Math.round(overallPercentage);

    return {
        percentage: overallPercentage,
        factors,
        matchStrengths: strengths,
        matchWeaknesses: weaknesses,
    };
}

/**
 * Get a CSS color class based on match percentage
 */
export function getMatchColorClass(percentage: number): string {
    if (percentage >= 80) return "text-primary";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-amber-600";
    return "text-slate-500";
}

/**
 * Get a descriptive label for match quality
 */
export function getMatchQualityLabel(percentage: number): string {
    if (percentage >= 90) return "Excellent match";
    if (percentage >= 75) return "Great match";
    if (percentage >= 60) return "Good match";
    if (percentage >= 40) return "Fair match";
    return "Poor match";
}

// Status colors
export const getStatusColor = (status: string) => {
    switch (status) {
        case "available":
            return "bg-green-100 text-green-800 border-green-200";
        case "unavailable":
            return "bg-red-100 text-red-800 border-red-200";
        case "employed":
            return "bg-blue-100 text-blue-800 border-blue-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
};
