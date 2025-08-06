import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
    calculateMaidJobMatch,
    getMatchColorClass,
    getMatchQualityLabel,
} from "@/utils/matchingUtils";
import { Percent, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import EmployerLayout from "@/Layouts/EmployerLayout";

export default function MatchDetails({ maid, jobPosting }: any) {
    // Unwrap the maid data if it's wrapped in a data property
    const maidData = maid.data || maid;

    // Calculate match details - ensure we're passing the correct data structure
    // console.log("Calculating match details for:", maid, jobPosting);
    const matchResult = calculateMaidJobMatch(maidData, jobPosting);
    const matchColorClass = getMatchColorClass(matchResult.percentage);
    const matchQuality = getMatchQualityLabel(matchResult.percentage);

    // Get maid name safely
    const maidName = maidData.full_name || "Maid";
    const jobTitle = jobPosting.title || "Job";

    return (
        <EmployerLayout>
            <Head title={`Match Details - ${maidName}`} />

            <div className="container mx-auto p-4 py-8 mb-28">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Match Details</h1>
                    <p className="text-muted-foreground">
                        Analyzing compatibility between {maidName} and{" "}
                        {jobTitle}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Match Score Card */}
                    <Card className="md:col-span-2 lg:col-span-3">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Overall Match Score</CardTitle>
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-base px-3 py-1",
                                        matchColorClass
                                    )}
                                >
                                    <Percent className="h-4 w-4 mr-1" />
                                    {matchResult.percentage}% Match
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Progress
                                value={matchResult.percentage}
                                className="h-3 mb-3"
                            />
                            <p className="text-lg font-medium text-center mt-2">
                                {matchQuality} match for this position
                            </p>
                        </CardContent>
                    </Card>

                    {/* Match Strengths */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-green-600">
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
                                                className="flex items-start"
                                            >
                                                <span className="text-green-500 mr-2">
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
                        <CardHeader>
                            <CardTitle className="flex items-center text-amber-600">
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
                                                className="flex items-start"
                                            >
                                                <span className="text-amber-500 mr-2">
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

                    {/* Match Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Match Factors</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Skills Matching
                                    </p>
                                    <Progress
                                        value={matchResult.factors.skillMatch}
                                        className="h-2"
                                    />
                                    <p className="text-right text-xs mt-1">
                                        {matchResult.factors.skillMatch}%
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Language Matching
                                    </p>
                                    <Progress
                                        value={
                                            matchResult.factors.languageMatch
                                        }
                                        className="h-2"
                                    />
                                    <p className="text-right text-xs mt-1">
                                        {matchResult.factors.languageMatch}%
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Location Proximity
                                    </p>
                                    <Progress
                                        value={
                                            matchResult.factors.locationMatch
                                        }
                                        className="h-2"
                                    />
                                    <p className="text-right text-xs mt-1">
                                        {matchResult.factors.locationMatch}%
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Salary Compatibility
                                    </p>
                                    <Progress
                                        value={matchResult.factors.salaryMatch}
                                        className="h-2"
                                    />
                                    <p className="text-right text-xs mt-1">
                                        {matchResult.factors.salaryMatch}%
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Accommodation
                                    </p>
                                    <Progress
                                        value={
                                            matchResult.factors
                                                .accommodationMatch
                                        }
                                        className="h-2"
                                    />
                                    <p className="text-right text-xs mt-1">
                                        {matchResult.factors.accommodationMatch}
                                        %
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </EmployerLayout>
    );
}
