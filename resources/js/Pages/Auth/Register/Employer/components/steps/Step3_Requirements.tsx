import { useState, useCallback, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Progress } from "@/Components/ui/progress";
import {
    Heart,
    Info,
    AlertCircle,
    DollarSign,
    Clock,
    Home,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";

import type { Step3RequirementsProps, Step3Data } from "../../utils/types";
import { useStepValidation } from "../../../../../../hooks/useStepValidation";
import {
    validateStep3,
    getCompletionPercentage,
} from "../../utils/step3Validation";

export default function Step3_Requirements({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step3RequirementsProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    const validationData = useMemo(() => data, [data]);

    const memoizedValidator = useCallback(
        (validationData: Step3Data) => validateStep3(validationData),
        []
    );

    const { clientErrors, isValid } = useStepValidation(
        validationData,
        memoizedValidator,
        onValidationChange
    );

    const handleInputChange = (
        field: keyof Step3Data,
        value: string | number
    ) => {
        setHasUserInteracted(true);
        onChange({ [field]: value });
    };

    // Calculate completion percentage
    const completionPercentage = getCompletionPercentage(data);

    const validationResult = validateStep3(data);
    const warnings = validationResult.warnings || {};
    const displayErrors =
        showValidation || hasUserInteracted ? clientErrors : {};

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Helper Requirements
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Tell us your preferences to help find the perfect helper
                        match
                    </CardDescription>

                    {/* Completion Progress */}
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                                Profile Completion
                            </span>
                            <span className="text-sm font-medium text-foreground">
                                {completionPercentage}%
                            </span>
                        </div>
                        <Progress
                            value={completionPercentage}
                            className="h-2"
                        />
                        <p className="text-xs text-muted-foreground text-center">
                            More details help us find better matches
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Optional Notice */}
                    <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            <strong>Optional Section:</strong> You can skip any
                            or all of these fields. The more details you
                            provide, the better we can match you with suitable
                            helpers.
                        </AlertDescription>
                    </Alert>

                    {/* Work Type */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center">
                                <Heart className="w-3 h-3 text-purple-500" />
                            </div>
                            <Label
                                htmlFor="work_type"
                                className="text-sm font-medium"
                            >
                                Type of Help Needed
                            </Label>
                        </div>
                        <Select
                            value={data.work_type}
                            onValueChange={(value) =>
                                handleInputChange("work_type", value)
                            }
                        >
                            <SelectTrigger
                                className={`h-11 ${
                                    displayErrors.work_type
                                        ? "border-red-500"
                                        : ""
                                }`}
                            >
                                <SelectValue placeholder="What kind of help do you need?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general_housework">
                                    General Housework
                                </SelectItem>
                                <SelectItem value="childcare">
                                    Childcare & Housework
                                </SelectItem>
                                <SelectItem value="elderly_care">
                                    Elderly Care
                                </SelectItem>
                                <SelectItem value="cooking_cleaning">
                                    Cooking & Cleaning
                                </SelectItem>
                                <SelectItem value="laundry_ironing">
                                    Laundry & Ironing
                                </SelectItem>
                                <SelectItem value="pet_care">
                                    Pet Care Included
                                </SelectItem>
                                <SelectItem value="all_around">
                                    All-Around Helper
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {displayErrors.work_type && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {displayErrors.work_type}
                            </p>
                        )}
                    </div>

                    {/* Accommodation & Schedule */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center">
                                    <Home className="w-3 h-3 text-blue-500" />
                                </div>
                                <Label
                                    htmlFor="accommodation"
                                    className="text-sm font-medium"
                                >
                                    Living Arrangement
                                </Label>
                            </div>
                            <Select
                                value={data.accommodation}
                                onValueChange={(value) =>
                                    handleInputChange("accommodation", value)
                                }
                            >
                                <SelectTrigger
                                    className={`h-11 ${
                                        displayErrors.accommodation
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                >
                                    <SelectValue placeholder="Live-in or Live-out?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="live_in">
                                        Live-in (Stay in our home)
                                    </SelectItem>
                                    <SelectItem value="live_out">
                                        Live-out (Daily visits)
                                    </SelectItem>
                                    <SelectItem value="flexible">
                                        Flexible/Either
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {displayErrors.accommodation && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.accommodation}
                                </p>
                            )}
                            {warnings.accommodation && (
                                <p className="text-sm text-amber-600 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    {warnings.accommodation}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center">
                                    <Clock className="w-3 h-3 text-green-500" />
                                </div>
                                <Label
                                    htmlFor="schedule"
                                    className="text-sm font-medium"
                                >
                                    Work Schedule
                                </Label>
                            </div>
                            <Select
                                value={data.schedule}
                                onValueChange={(value) =>
                                    handleInputChange("schedule", value)
                                }
                            >
                                <SelectTrigger
                                    className={`h-11 ${
                                        displayErrors.schedule
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                >
                                    <SelectValue placeholder="How often do you need help?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="full_time">
                                        Full-time (Daily, 8+ hours)
                                    </SelectItem>
                                    <SelectItem value="part_time">
                                        Part-time (Daily, 4-6 hours)
                                    </SelectItem>
                                    <SelectItem value="weekdays_only">
                                        Weekdays Only
                                    </SelectItem>
                                    <SelectItem value="weekends_only">
                                        Weekends Only
                                    </SelectItem>
                                    <SelectItem value="as_needed">
                                        As Needed/Flexible
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {displayErrors.schedule && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.schedule}
                                </p>
                            )}
                            {warnings.schedule && (
                                <p className="text-sm text-amber-600 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    {warnings.schedule}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Budget Range */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center">
                                <DollarSign className="w-3 h-3 text-green-500" />
                            </div>
                            <Label className="text-sm font-medium">
                                Budget Range (Monthly)
                            </Label>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label
                                    htmlFor="budget_min"
                                    className="text-xs text-muted-foreground"
                                >
                                    Minimum
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-muted-foreground text-sm">
                                        ₱
                                    </span>
                                    <Input
                                        id="budget_min"
                                        type="number"
                                        placeholder="15,000"
                                        value={data.budget_min || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "budget_min",
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                        className={`pl-8 h-11 ${
                                            displayErrors.budget_min ||
                                            displayErrors.budget_range
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        min="0"
                                        step="1000"
                                    />
                                </div>
                                {warnings.budget_min && (
                                    <p className="text-xs text-amber-600 flex items-center gap-1">
                                        <AlertTriangle className="w-2 h-2" />
                                        {warnings.budget_min}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <Label
                                    htmlFor="budget_max"
                                    className="text-xs text-muted-foreground"
                                >
                                    Maximum
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-muted-foreground text-sm">
                                        ₱
                                    </span>
                                    <Input
                                        id="budget_max"
                                        type="number"
                                        placeholder="25,000"
                                        value={data.budget_max || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "budget_max",
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                        className={`pl-8 h-11 ${
                                            displayErrors.budget_max ||
                                            displayErrors.budget_range
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        min="0"
                                        step="1000"
                                    />
                                </div>
                                {warnings.budget_max && (
                                    <p className="text-xs text-amber-600 flex items-center gap-1">
                                        <AlertTriangle className="w-2 h-2" />
                                        {warnings.budget_max}
                                    </p>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Your budget range helps us find helpers within your
                            price range
                        </p>
                        {displayErrors.budget_range && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {displayErrors.budget_range}
                            </p>
                        )}
                        {displayErrors.budget_min && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {displayErrors.budget_min}
                            </p>
                        )}
                        {displayErrors.budget_max && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {displayErrors.budget_max}
                            </p>
                        )}
                    </div>

                    {/* Experience Needed */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="experience_needed"
                            className="text-sm font-medium"
                        >
                            Experience Requirements
                        </Label>
                        <Select
                            value={data.experience_needed}
                            onValueChange={(value) =>
                                handleInputChange("experience_needed", value)
                            }
                        >
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="How much experience do they need?" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no_experience">
                                    No experience needed (will train)
                                </SelectItem>
                                <SelectItem value="some_experience">
                                    Some experience (1-2 years)
                                </SelectItem>
                                <SelectItem value="experienced">
                                    Experienced (3-5 years)
                                </SelectItem>
                                <SelectItem value="very_experienced">
                                    Very experienced (5+ years)
                                </SelectItem>
                                <SelectItem value="specific_skills">
                                    Specific skills required
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {displayErrors.experience_needed && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {displayErrors.experience_needed}
                            </p>
                        )}
                    </div>

                    {/* Special Requirements */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="special_requirements"
                            className="text-sm font-medium"
                        >
                            Special Requirements or Notes
                        </Label>
                        <Textarea
                            id="special_requirements"
                            placeholder="Any specific requirements, personality traits, skills, or important notes..."
                            value={data.special_requirements}
                            onChange={(e) =>
                                handleInputChange(
                                    "special_requirements",
                                    e.target.value
                                )
                            }
                            className={`min-h-[80px] resize-none ${
                                displayErrors.special_requirements
                                    ? "border-red-500"
                                    : ""
                            }`}
                            maxLength={500}
                        />
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-muted-foreground">
                                Include any special needs, personality
                                preferences, or important requirements
                            </p>
                            <span className="text-xs text-muted-foreground">
                                {data.special_requirements?.length || 0}/500
                            </span>
                        </div>
                        {displayErrors.special_requirements && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {displayErrors.special_requirements}
                            </p>
                        )}
                    </div>

                    {/* Smart Matching Info */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            <strong>Smart Matching:</strong> The more
                            preferences you provide, the better we can match you
                            with helpers who fit your specific needs, budget,
                            and schedule. You can always update these later.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
