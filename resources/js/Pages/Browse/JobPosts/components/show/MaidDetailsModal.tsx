import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { getInitials } from "@/utils/useGeneralUtils";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { Progress } from "@/Components/ui/progress";
import {
    User,
    Calendar,
    Languages,
    Award,
    Heart,
    Home,
    PhilippinePeso,
    Phone,
    BookOpen,
    Briefcase,
    CheckCircle2,
    XCircle,
    Percent,
    MapPin,
} from "lucide-react";
import { formatCurrency } from "@/utils/useGeneralUtils";
import {
    getMatchColorClass,
    getMatchQualityLabel,
} from "@/utils/matchingUtils";

export default function MaidDetailsModal({
    maid,
    open,
    onClose,
    jobPost,
}: {
    maid: any;
    open: boolean;
    onClose: () => void;
    jobPost?: any;
}) {
    if (!maid) return null;
    const profile = maid.user.profile;
    const avatar = maid.user.avatar;
    const hasMatchData = maid.matchResult && jobPost;

    // Match data visualization
    const renderMatchSection = () => {
        if (!hasMatchData) return null;

        const { percentage, factors, matchStrengths, matchWeaknesses } =
            maid.matchResult;
        const matchColor = getMatchColorClass(percentage);
        const matchLabel = getMatchQualityLabel(percentage);
        console.log("Match data:", maid.matchResult);
        return (
            <>
                <Separator className="my-4" />

                <div>
                    <h3 className="text-base font-medium flex items-center mb-3">
                        <Percent className="w-4 h-4 mr-2 text-primary" />
                        Job Match Analysis
                    </h3>

                    <div className="bg-muted/30 rounded-md p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-medium">Overall Match:</span>
                            <span
                                className={`${matchColor} font-semibold text-lg`}
                            >
                                {percentage}%
                            </span>
                        </div>

                        <div className="mb-2">
                            <Progress
                                value={percentage}
                                className={`h-2 ${
                                    percentage >= 80
                                        ? "bg-green-500"
                                        : percentage >= 60
                                        ? "bg-blue-500"
                                        : percentage >= 40
                                        ? "bg-amber-500"
                                        : "bg-slate-400"
                                }`}
                            />
                            <p className="text-sm text-center mt-1">
                                {matchLabel}
                            </p>
                        </div>

                        {/* Match factor details */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Skills
                                </p>
                                <Progress
                                    value={factors.skillMatch}
                                    className={`h-1.5 mt-1 ${
                                        factors.skillMatch >= 70
                                            ? "bg-green-500"
                                            : "bg-amber-500"
                                    }`}
                                />
                                <p className="text-xs mt-1">
                                    {Math.round(factors.skillMatch)}%
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Languages
                                </p>
                                <Progress
                                    value={factors.languageMatch}
                                    className={`h-1.5 mt-1 ${
                                        factors.languageMatch >= 70
                                            ? "bg-green-500"
                                            : "bg-amber-500"
                                    }`}
                                />
                                <p className="text-xs mt-1">
                                    {Math.round(factors.languageMatch)}%
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Accommodation
                                </p>
                                <Progress
                                    value={factors.accommodationMatch}
                                    className={`h-1.5 mt-1 ${
                                        factors.accommodationMatch >= 70
                                            ? "bg-green-500"
                                            : "bg-amber-500"
                                    }`}
                                />
                                <p className="text-xs mt-1">
                                    {Math.round(factors.accommodationMatch)}%
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Salary
                                </p>
                                <Progress
                                    value={factors.salaryMatch}
                                    className={`h-1.5 mt-1 ${
                                        factors.salaryMatch >= 70
                                            ? "bg-green-500"
                                            : "bg-amber-500"
                                    }`}
                                />
                                <p className="text-xs mt-1">
                                    {Math.round(factors.salaryMatch)}%
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Location
                                </p>
                                <Progress
                                    value={factors.locationMatch}
                                    className={`h-1.5 mt-1 ${
                                        factors.locationMatch >= 70
                                            ? "bg-green-200"
                                            : "bg-amber-200"
                                    }`}
                                />
                                <p className="text-xs mt-1">
                                    {Math.round(factors.locationMatch)}%
                                </p>
                            </div>
                        </div>

                        {/* Match strengths and weaknesses */}
                        <div className="mt-4 space-y-3">
                            {matchStrengths.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium flex items-center text-green-700">
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                                        Strengths
                                    </h4>
                                    <ul className="mt-1 space-y-1">
                                        {matchStrengths.map(
                                            (strength: any, idx: any) => (
                                                <li
                                                    key={idx}
                                                    className="text-sm flex items-start"
                                                >
                                                    <span className="text-green-600 mr-1.5">
                                                        •
                                                    </span>
                                                    {strength}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}

                            {matchWeaknesses.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium flex items-center text-amber-700">
                                        <XCircle className="w-3.5 h-3.5 mr-1.5" />
                                        Areas of Concern
                                    </h4>
                                    <ul className="mt-1 space-y-1">
                                        {matchWeaknesses.map(
                                            (weakness: any, idx: any) => (
                                                <li
                                                    key={idx}
                                                    className="text-sm flex items-start"
                                                >
                                                    <span className="text-amber-600 mr-1.5">
                                                        •
                                                    </span>
                                                    {weakness}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <span>
                            {profile.first_name} {profile.last_name}
                        </span>
                        <Badge
                            variant={
                                maid.status === "available"
                                    ? "default"
                                    : "destructive"
                            }
                            className="ml-2"
                        >
                            <span className="text-xs px-2 py-0.5 rounded-full capitalize">
                                {maid.status}
                            </span>
                            {/*  */}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        {maid.status !== "available" && (
                            <span className="ml-2 text-xs ">
                                Cannot apply: maid is{" "}
                                {maid.status === "employed"
                                    ? "already employed"
                                    : "currently unavailable"}
                            </span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {/* Profile header with image and badges */}
                <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-20 w-20 border-2 border-primary/20">
                        <AvatarImage
                            src={avatar ? `/storage/${avatar}` : undefined}
                            alt={`${profile.first_name} ${profile.last_name}`}
                        />
                        <AvatarFallback className="text-lg">
                            {getInitials(
                                `${profile.first_name} ${profile.last_name}`
                            )}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="flex gap-2 flex-wrap mb-2">
                            {maid.is_premium && (
                                <Badge
                                    variant="secondary"
                                    className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                                >
                                    Premium
                                </Badge>
                            )}
                            {maid.is_trained && (
                                <Badge
                                    variant="secondary"
                                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                >
                                    Trained
                                </Badge>
                            )}
                            {maid.is_verified && (
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                                >
                                    Verified
                                </Badge>
                            )}
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {maid.bio || "No bio available"}
                        </p>
                    </div>
                </div>

                {/* Match information - will only show if job post is provided */}
                {renderMatchSection()}

                <Separator />

                {/* Main details in two columns on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 py-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Location
                            </p>
                            <p className="font-medium">
                                {profile.address ? (
                                    <>
                                        {profile.address.barangay &&
                                            `${profile.address.barangay}, `}
                                        {profile.address.street &&
                                            `${profile.address.street}, `}
                                        {profile.address.city
                                            ? profile.address.city
                                            : "Not specified"}
                                        {profile.address.province
                                            ? `, ${profile.address.province}`
                                            : ""}
                                        {jobPost &&
                                            jobPost.location &&
                                            jobPost.location.city &&
                                            profile.address.city &&
                                            profile.address.city.toLowerCase() ===
                                                jobPost.location.city.toLowerCase() && (
                                                <span className="ml-2 text-xs text-green-600">
                                                    (Same as job location)
                                                </span>
                                            )}
                                    </>
                                ) : (
                                    "Not specified"
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <PhilippinePeso className="w-4 h-4 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Expected Salary
                            </p>
                            <p className="font-medium">
                                {maid.expected_salary
                                    ? `₱${formatCurrency(maid.expected_salary)}`
                                    : "Not specified"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Experience
                            </p>
                            <p className="font-medium">
                                {maid.years_experience > 0
                                    ? `${maid.years_experience} year${
                                          maid.years_experience > 1 ? "s" : ""
                                      }`
                                    : "No experience"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Nationality
                            </p>
                            <p className="font-medium">
                                {maid.nationality || "Not specified"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Marital Status
                            </p>
                            <p className="font-medium capitalize">
                                {maid.marital_status || "Not specified"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Preferred Accommodation
                            </p>
                            <p className="font-medium capitalize">
                                {maid.preferred_accommodation
                                    ? maid.preferred_accommodation.replace(
                                          "_",
                                          " "
                                      )
                                    : "Flexible"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Earliest Start Date
                            </p>
                            <p className="font-medium">
                                {maid.earliest_start_date
                                    ? new Date(
                                          maid.earliest_start_date
                                      ).toLocaleDateString()
                                    : "Flexible"}
                            </p>
                        </div>
                    </div>
                </div>

                <Separator className="my-2" />

                {/* Skills and Languages section */}
                <div className="space-y-4">
                    <div>
                        <h4 className="text-sm font-medium flex items-center mb-2">
                            <Award className="w-4 h-4 mr-2 text-primary" />
                            Skills
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {maid.skills && maid.skills.length > 0 ? (
                                maid.skills.map((skill: string, i: number) => (
                                    <Badge
                                        key={i}
                                        variant="outline"
                                        className={`rounded-md ${
                                            jobPost &&
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
                                                ? "bg-green-50 text-green-700 border-green-200"
                                                : ""
                                        }`}
                                    >
                                        {skill}
                                        {jobPost &&
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
                                            ) && (
                                                <CheckCircle2 className="ml-1 h-3 w-3 text-green-600" />
                                            )}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">
                                    No skills specified
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium flex items-center mb-2">
                            <Languages className="w-4 h-4 mr-2 text-primary" />
                            Languages
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                            {maid.languages && maid.languages.length > 0 ? (
                                maid.languages.map(
                                    (language: string, i: number) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className={`capitalize rounded-md ${
                                                jobPost &&
                                                jobPost.language_preferences &&
                                                jobPost.language_preferences.some(
                                                    (lang: string) =>
                                                        lang.toLowerCase() ===
                                                        language.toLowerCase()
                                                )
                                                    ? "bg-green-100 text-green-800"
                                                    : ""
                                            }`}
                                        >
                                            {language}
                                            {jobPost &&
                                                jobPost.language_preferences &&
                                                jobPost.language_preferences.some(
                                                    (lang: string) =>
                                                        lang.toLowerCase() ===
                                                        language.toLowerCase()
                                                ) && (
                                                    <CheckCircle2 className="ml-1 h-3 w-3 text-green-600" />
                                                )}
                                        </Badge>
                                    )
                                )
                            ) : (
                                <span className="text-sm text-muted-foreground">
                                    No languages specified
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <Separator className="my-2" />

                {/* Contact information */}
                <div>
                    <h4 className="text-sm font-medium flex items-center mb-2">
                        <Phone className="w-4 h-4 mr-2 text-primary" />
                        Emergency Contact
                    </h4>
                    <div className="bg-muted rounded-md p-3 text-sm">
                        <p>
                            <span className="font-medium">Name:</span>{" "}
                            {maid.emergency_contact_name || "Not provided"}
                        </p>
                        <p>
                            <span className="font-medium">Phone:</span>{" "}
                            {maid.emergency_contact_phone || "Not provided"}
                        </p>
                    </div>
                </div>

                {/* Extra information */}
                {maid.bio && (
                    <>
                        <Separator className="my-2" />
                        <div>
                            <h4 className="text-sm font-medium flex items-center mb-2">
                                <BookOpen className="w-4 h-4 mr-2 text-primary" />
                                Biography
                            </h4>
                            <p className="text-sm">{maid.bio}</p>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
