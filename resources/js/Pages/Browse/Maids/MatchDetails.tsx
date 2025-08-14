import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
    calculateMaidJobMatch,
    getMatchColorClass,
    getMatchQualityLabel,
} from "@/utils/matchingUtils";
import {
    Percent,
    ThumbsUp,
    ThumbsDown,
    ChevronLeft,
    User,
    MapPin,
    Languages,
    Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import EmployerLayout from "@/Layouts/EmployerLayout";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { router } from "@inertiajs/react";
import { getInitials } from "@/utils/useGeneralUtils";

export default function MatchDetails({ maid, jobPosting }: any) {
    // Unwrap the maid data if it's wrapped in a data property
    const maidData = maid.data || maid;
    console.log("Maid Data:", maidData);
    // Ensure data has the right format for the matching algorithm
    const preparedMaidData = {
        ...maidData,
        // For location matching, try multiple sources
        location: maidData.location || maidData.address || null,
        formatted_location: maidData.formatted_location || null,
        user: {
            ...maidData.user,
            profile: {
                ...maidData.user?.profile,
                // Need to preserve the privacy flag to correctly handle address privacy
                is_address_private:
                    maidData.user?.profile?.is_address_private || false,
                address: maidData.user?.profile?.address || {},
            },
        },
        skills: Array.isArray(maidData.skills) ? maidData.skills : [],
        languages: Array.isArray(maidData.languages) ? maidData.languages : [],
        // Ensure proper experience value
        years_experience: maidData.years_experience || 0,
    };

    const preparedJobData = {
        ...jobPosting,
        work_types: Array.isArray(jobPosting.work_types)
            ? jobPosting.work_types
            : typeof jobPosting.work_types === "string"
            ? JSON.parse(jobPosting.work_types)
            : [],
        language_preferences: Array.isArray(jobPosting.language_preferences)
            ? jobPosting.language_preferences
            : typeof jobPosting.language_preferences === "string"
            ? JSON.parse(jobPosting.language_preferences)
            : [],
    };

    // Calculate match details with prepared data
    const matchResult = calculateMaidJobMatch(
        preparedMaidData,
        preparedJobData
    );

    const matchColorClass = getMatchColorClass(matchResult.percentage);
    const matchQuality = getMatchQualityLabel(matchResult.percentage);

    // Get maid name safely
    const maidName = maidData.full_name || "Maid";
    const jobTitle = jobPosting.title || "Job";

    // Handle back button click
    const handleBack = () => {
        router.visit(route("browse.maids.index"));
    };

    // Handle view profile button click
    const handleViewProfile = () => {
        router.visit(route("browse.maids.show", maidData.id));
    };

    return (
        <EmployerLayout>
            <Head title={`Match Details - ${maidName}`} />

            <div className="container mx-auto p-4 py-6 mb-28">
                {/* Back button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className="mb-4"
                    onClick={handleBack}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Back to Home
                </Button>

                {/* Profile Header Section */}
                <div className="bg-card rounded-xl shadow-sm border p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/20">
                            <AvatarImage
                                src={
                                    maidData.user?.avatar
                                        ? `/storage/${maidData.user.avatar}`
                                        : undefined
                                }
                                alt={maidName}
                            />
                            <AvatarFallback className="text-lg bg-primary/10">
                                {getInitials(maidName)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
                                <div>
                                    <h1 className="text-xl font-bold">
                                        {maidName}
                                    </h1>
                                    <p className="text-muted-foreground text-sm">
                                        {maidData.nationality ||
                                            "Not specified"}{" "}
                                        •
                                        <span className="ml-1 capitalize">
                                            {maidData.experience_level ||
                                                "Beginner"}
                                        </span>
                                    </p>
                                </div>

                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-base px-3 py-1",
                                        matchColorClass
                                    )}
                                >
                                    <Percent className="h-4 w-4 mr-1" />
                                    {matchResult.percentage.toFixed(2)}% Match
                                </Badge>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {maidData.is_verified && (
                                    <Badge variant="secondary">Verified</Badge>
                                )}
                                {maidData.is_managed_by_agency && (
                                    <Badge variant="secondary">
                                        Agency Managed
                                    </Badge>
                                )}
                                <Badge
                                    variant={
                                        maidData.status === "available"
                                            ? "default"
                                            : "outline"
                                    }
                                >
                                    {maidData.status === "available"
                                        ? "Available"
                                        : "Employed"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Quick info cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                        <div className="p-3 rounded-lg bg-muted flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                                <p className="text-xs text-muted-foreground">
                                    Experience
                                </p>
                                <p className="font-medium">
                                    {maidData.years_experience || 0} years
                                </p>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-muted flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                                <p className="text-xs text-muted-foreground">
                                    Location
                                </p>
                                <p className="font-medium line-clamp-1">
                                    {maidData.location
                                        ? [
                                              maidData.location.barangay,
                                              maidData.location.city,
                                              maidData.location.province,
                                          ]
                                              .filter(Boolean)
                                              .join(", ")
                                        : maidData.formatted_location ||
                                          "Private"}
                                </p>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-muted flex items-center gap-2">
                            <Languages className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                                <p className="text-xs text-muted-foreground">
                                    Languages
                                </p>
                                <p className="font-medium line-clamp-1">
                                    {maidData.languages?.slice(0, 2).join(", ")}
                                    {maidData.languages?.length > 2 &&
                                        ` +${maidData.languages.length - 2}`}
                                </p>
                            </div>
                        </div>

                        <div className="p-3 rounded-lg bg-muted flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                                <p className="text-xs text-muted-foreground">
                                    Accommodation
                                </p>
                                <p className="font-medium capitalize">
                                    {maidData.preferred_accommodation
                                        ? maidData.preferred_accommodation.replace(
                                              "_",
                                              " "
                                          )
                                        : "Flexible"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Match Overview */}
                <Card className="mb-6">
                    <CardHeader className="pb-2">
                        <CardTitle>Match Overview: {jobTitle}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {matchQuality} match for this position
                        </p>
                    </CardHeader>
                    <CardContent>
                        <Progress
                            value={matchResult.percentage}
                            className="h-3 mb-4"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Skills
                                </p>
                                <Progress
                                    value={matchResult.factors.skillMatch}
                                    className="h-2 mb-1"
                                />
                                <p className="text-right text-xs font-medium">
                                    {matchResult.factors.skillMatch.toFixed(2)}%
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Languages
                                </p>
                                <Progress
                                    value={matchResult.factors.languageMatch}
                                    className="h-2 mb-1"
                                />
                                <p className="text-right text-xs font-medium">
                                    {matchResult.factors.languageMatch.toFixed(
                                        2
                                    )}
                                    %
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Location
                                </p>
                                <Progress
                                    value={matchResult.factors.locationMatch}
                                    className="h-2 mb-1"
                                />
                                <p className="text-right text-xs font-medium">
                                    {matchResult.factors.locationMatch.toFixed(
                                        2
                                    )}
                                    %
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Salary
                                </p>
                                <Progress
                                    value={matchResult.factors.salaryMatch}
                                    className="h-2 mb-1"
                                />
                                <p className="text-right text-xs font-medium">
                                    {matchResult.factors.salaryMatch.toFixed(2)}
                                    %
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Accommodation
                                </p>
                                <Progress
                                    value={
                                        matchResult.factors.accommodationMatch
                                    }
                                    className="h-2 mb-1"
                                />
                                <p className="text-right text-xs font-medium">
                                    {matchResult.factors.accommodationMatch.toFixed(
                                        2
                                    )}
                                    %
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Match Strengths & Weaknesses */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Match Strengths */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-primary">
                                <ThumbsUp className="h-5 w-5 mr-2" />
                                Match Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {matchResult.matchStrengths.length > 0 ? (
                                <ul className="space-y-2">
                                    {matchResult.matchStrengths.map(
                                        (strength, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start bg-primary/5 p-2 rounded-md"
                                            >
                                                <span className="text-primary mr-2 mt-0.5">
                                                    ✓
                                                </span>
                                                {strength}
                                            </li>
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">
                                    No significant strengths found.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Match Weaknesses */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-secondary-foreground">
                                <ThumbsDown className="h-5 w-5 mr-2" />
                                Areas of Concern
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {matchResult.matchWeaknesses.length > 0 ? (
                                <ul className="space-y-2">
                                    {matchResult.matchWeaknesses.map(
                                        (weakness, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start bg-accent/10 p-2 rounded-md"
                                            >
                                                <span className="text-accent-foreground mr-2 mt-0.5">
                                                    !
                                                </span>
                                                {weakness}
                                            </li>
                                        )
                                    )}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">
                                    No significant concerns found.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Skills & Languages */}
                <div className="grid gap-6 md:grid-cols-2 mt-6">
                    {/* Skills */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {maidData.skills &&
                                maidData.skills.length > 0 ? (
                                    maidData.skills.map(
                                        (skill: string, index: number) => (
                                            <Badge
                                                key={index}
                                                variant="outline"
                                                className={
                                                    jobPosting.work_types?.some(
                                                        (workType: string) =>
                                                            workType
                                                                .toLowerCase()
                                                                .includes(
                                                                    skill.toLowerCase()
                                                                ) ||
                                                            skill
                                                                .toLowerCase()
                                                                .includes(
                                                                    workType
                                                                        .replace(
                                                                            "_",
                                                                            " "
                                                                        )
                                                                        .toLowerCase()
                                                                )
                                                    )
                                                        ? "bg-primary/10 text-primary"
                                                        : ""
                                                }
                                            >
                                                {skill}
                                            </Badge>
                                        )
                                    )
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No skills specified
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Languages */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                                Languages
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {maidData.languages &&
                                maidData.languages.length > 0 ? (
                                    maidData.languages.map(
                                        (language: string, index: number) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className={
                                                    jobPosting.language_preferences?.some(
                                                        (lang: string) =>
                                                            lang.toLowerCase() ===
                                                            language.toLowerCase()
                                                    )
                                                        ? "bg-primary/10 text-primary"
                                                        : ""
                                                }
                                            >
                                                {language}
                                            </Badge>
                                        )
                                    )
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No languages specified
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action buttons */}
                <div className="fixed bottom-0 left-0 right-0 bg-card border-t p-4 flex justify-center shadow-lg md:static md:bg-transparent md:border-0 md:shadow-none md:p-0 md:mt-6">
                    <div className="flex gap-3 max-w-md w-full">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <Button className="flex-1" onClick={handleViewProfile}>
                            View Full Profile
                        </Button>
                    </div>
                </div>
            </div>
        </EmployerLayout>
    );
}
