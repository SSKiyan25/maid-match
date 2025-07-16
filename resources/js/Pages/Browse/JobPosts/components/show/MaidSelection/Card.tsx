import { MapPin, Plus, Check, Info, Percent, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { getInitials } from "@/utils/useGeneralUtils";
import {
    getMatchColorClass,
    getMatchQualityLabel,
    getStatusColor,
} from "../../../utils/matchingUtils";

export default function MaidCard({
    maidRecord,
    isSelected,
    onSelectMaid,
    availableCredits,
    selectedMaidsCount,
    jobPost,
    setModalMaid,
    agencyApplications,
}: {
    maidRecord: any;
    isSelected: boolean;
    onSelectMaid: (maid: any) => void;
    availableCredits: number;
    selectedMaidsCount: number;
    jobPost: any;
    setModalMaid: (maid: any) => void;
    agencyApplications: any[];
}) {
    const maid = maidRecord.maid;
    const matchResult = maidRecord.matchResult;
    const profile = maid.user.profile;
    const avatar = maid.user.avatar;
    const isAvailable = maid.status === "available";

    const existingApplication = agencyApplications?.find(
        (app) => app.maid_id === maid.id
    );
    const hasApplied = !!existingApplication;
    const applicationStatus = existingApplication?.status || null;

    const matchColor = getMatchColorClass(matchResult.percentage);
    const matchLabel = getMatchQualityLabel(matchResult.percentage);

    return (
        <div
            className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border ${
                matchResult.percentage >= 80
                    ? "border-green-300 bg-accent text-accent"
                    : "border-muted-foreground/20"
            } transition-colors ${!isAvailable ? "opacity-70" : ""}`}
        >
            <div className="flex items-start gap-3 w-full">
                <Avatar className="h-10 w-10">
                    <AvatarImage
                        src={avatar ? `/storage/${avatar}` : undefined}
                        alt={`${profile.first_name} ${profile.last_name}`}
                    />
                    <AvatarFallback>
                        {getInitials(
                            `${profile.first_name} ${profile.last_name}`
                        )}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                        <h4
                            className={`font-medium ${
                                matchResult.percentage >= 80
                                    ? "text-accent-foreground"
                                    : ""
                            }`}
                        >
                            {profile.first_name} {profile.last_name}
                        </h4>
                        {hasApplied ? (
                            <span className="text-xs px-2 py-0.5 rounded-full capitalize bg-blue-100 text-blue-800">
                                Applied:{" "}
                                {applicationStatus.charAt(0).toUpperCase() +
                                    applicationStatus.slice(1)}
                            </span>
                        ) : (
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full capitalize ${getStatusColor(
                                    maid.status
                                )}`}
                            >
                                {maid.status}
                            </span>
                        )}

                        {/* Match quality badge */}
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full flex items-center border ${
                                            matchResult.percentage >= 80
                                                ? "bg-primary-foreground border-green-300 text-primary "
                                                : matchResult.percentage >= 60
                                                ? "border-blue-300 text-blue-700"
                                                : matchResult.percentage >= 40
                                                ? "border-amber-300 text-amber-700"
                                                : "border-gray-300 text-gray-700"
                                        }`}
                                    >
                                        <Percent className="h-3 w-3 mr-1" />
                                        <span className={matchColor}>
                                            {matchResult.percentage}% match
                                        </span>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <MatchDetails
                                        matchResult={matchResult}
                                        matchLabel={matchLabel}
                                    />
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Qualification badges */}
                        <div className="flex gap-1">
                            {maid.is_premium && (
                                <span className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded-sm">
                                    Premium
                                </span>
                            )}
                            {maid.is_trained && (
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-1.5 py-0.5 rounded-sm">
                                    Trained
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Match visualization */}
                    <div className="mt-2 flex items-center gap-2">
                        <Progress
                            value={matchResult.percentage}
                            className={`h-1.5 w-28 ${
                                matchResult.percentage >= 80
                                    ? "bg-green-200"
                                    : matchResult.percentage >= 60
                                    ? "bg-blue-200"
                                    : matchResult.percentage >= 40
                                    ? "bg-amber-200"
                                    : "bg-gray-200"
                            }`}
                        />
                        <span
                            className={`text-xs ${
                                matchResult.percentage >= 80
                                    ? "text-accent-foreground"
                                    : "text-muted-foreground"
                            }`}
                        >
                            {matchLabel}
                        </span>
                    </div>

                    {/* Experience, salary and location */}
                    <div
                        className={`flex flex-wrap items-center text-xs mt-1 ${
                            matchResult.percentage >= 80
                                ? "text-accent-foreground"
                                : "text-muted-foreground"
                        }`}
                    >
                        <span className="mr-3">
                            {maid.years_experience} years exp.
                        </span>

                        {profile.address?.city && (
                            <span className="flex items-center">
                                <MapPin
                                    className={`h-3 w-3 mr-1 ${
                                        matchResult.percentage >= 80
                                            ? "text-accent-foreground"
                                            : "text-slate-400"
                                    }`}
                                />
                                <span>
                                    {profile.address.barangay &&
                                        `${profile.address.barangay}, `}
                                    {profile.address.street &&
                                        `${profile.address.street}, `}
                                    {profile.address.city}
                                    {profile.address.province
                                        ? `, ${profile.address.province}`
                                        : ""}
                                    {jobPost.location &&
                                        jobPost.location.city &&
                                        profile.address.city.toLowerCase() ===
                                            jobPost.location.city.toLowerCase() && (
                                            <Badge
                                                variant="outline"
                                                className="ml-1 text-[10px] py-0 h-4 px-1 border-green-300 text-green-700 bg-green-50"
                                            >
                                                Same city
                                            </Badge>
                                        )}
                                </span>
                            </span>
                        )}
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                        {maid.skills &&
                            maid.skills
                                .slice(0, 3)
                                .map((skill: any, idx: number) => (
                                    <Badge
                                        key={idx}
                                        variant="secondary"
                                        className={`text-xs ${
                                            jobPost.work_types &&
                                            jobPost.work_types.some(
                                                (type: string) =>
                                                    type
                                                        .toLowerCase()
                                                        .includes(
                                                            skill.toLowerCase()
                                                        ) ||
                                                    skill
                                                        .toLowerCase()
                                                        .includes(
                                                            type
                                                                .toLowerCase()
                                                                .replace(
                                                                    "_",
                                                                    " "
                                                                )
                                                        )
                                            )
                                                ? "bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                                                : ""
                                        }`}
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                        {maid.skills && maid.skills.length > 3 && (
                            <span
                                className={`text-xs ${
                                    matchResult.percentage >= 80
                                        ? "text-accent-foreground"
                                        : "text-muted-foreground"
                                }`}
                            >
                                +{maid.skills.length - 3} more
                            </span>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-2 mt-3 sm:mt-0 self-end sm:self-center">
                <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    className="flex-shrink-0"
                    onClick={() => onSelectMaid(maid)}
                    disabled={
                        !isAvailable ||
                        hasApplied ||
                        (!isSelected && selectedMaidsCount >= availableCredits)
                    }
                >
                    {isSelected ? (
                        <>
                            <Check className="h-4 w-4 mr-1" /> Selected
                        </>
                    ) : hasApplied ? (
                        <>
                            <AlertCircle className="h-4 w-4 mr-1" /> Applied
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4 mr-1" /> Select
                        </>
                    )}
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    className="flex-shrink-0"
                    onClick={() => setModalMaid({ ...maid, matchResult })}
                >
                    <Info className="h-4 w-4 mr-1" />
                    Details
                </Button>
            </div>
        </div>
    );
}

function MatchDetails({
    matchResult,
    matchLabel,
}: {
    matchResult: any;
    matchLabel: string;
}) {
    return (
        <div className="space-y-2">
            <p className="font-medium">{matchLabel}</p>

            {matchResult.matchStrengths.length > 0 && (
                <div>
                    <p className="text-green-600 text-xs font-medium">
                        Strengths:
                    </p>
                    <ul className="text-xs pl-4 list-disc">
                        {matchResult.matchStrengths.map(
                            (strength: any, i: number) => (
                                <li key={i}>{strength}</li>
                            )
                        )}
                    </ul>
                </div>
            )}

            {matchResult.matchWeaknesses.length > 0 && (
                <div>
                    <p className="text-amber-600 text-xs font-medium">
                        Areas of concern:
                    </p>
                    <ul className="text-xs pl-4 list-disc">
                        {matchResult.matchWeaknesses.map(
                            (weakness: any, i: number) => (
                                <li key={i}>{weakness}</li>
                            )
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
