import { useState, useEffect, useRef } from "react";
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
import { Checkbox } from "@/Components/ui/checkbox";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Briefcase,
    Calendar,
    Globe,
    FileText,
    AlertCircle,
    PhilippinePeso,
    Home,
    Utensils,
    Bath,
} from "lucide-react";

import { JobPostingForm } from "../../utils/types";
import { validateStep1 } from "../../utils/step1Validation";
import { useStepValidation } from "../../hooks/useStepValidation";

interface Step1MainInfoProps {
    data: JobPostingForm;
    onChange: (updates: Partial<JobPostingForm>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
    isEditMode?: boolean;
}

const workTypeOptions = [
    { value: "cleaning", label: "General Cleaning", icon: "🧹" },
    { value: "cooking", label: "Cooking", icon: "👨‍🍳" },
    { value: "childcare", label: "Childcare", icon: "👶" },
    { value: "eldercare", label: "Elder Care", icon: "👴" },
    { value: "laundry", label: "Laundry", icon: "👕" },
    { value: "gardening", label: "Gardening", icon: "🌱" },
    { value: "pet_care", label: "Pet Care", icon: "🐕" },
    { value: "housekeeping", label: "General Housework", icon: "🏠" },
];

const accommodationTypes = [
    { value: "live_in", label: "Live-in" },
    { value: "live_out", label: "Live-out" },
    { value: "flexible", label: "Flexible" },
];

const dayOffTypes = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "flexible", label: "Flexible" },
    { value: "none", label: "No Fixed Day Off" },
];

const languageOptions = [
    { value: "english", label: "English" },
    { value: "tagalog", label: "Tagalog" },
    { value: "cebuano", label: "Cebuano" },
    { value: "ilocano", label: "Ilocano" },
    { value: "bisaya", label: "Bisaya" },
    { value: "hiligaynon", label: "Hiligaynon" },
    { value: "bicolano", label: "Bicolano" },
    { value: "waray", label: "Waray" },
    { value: "chavacano", label: "Chavacano" },
    { value: "other", label: "Other" },
];

export default function Step1_MainInfo({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
    isEditMode = false,
}: Step1MainInfoProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    const { clientErrors, isValid } = useStepValidation(
        data,
        validateStep1,
        onValidationChange
    );

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        if (onValidationChange && isValid !== prevIsValid.current) {
            onValidationChange(isValid);
            prevIsValid.current = isValid;
        }
    }, [isValid, onValidationChange]);

    const handleInputChange = (field: keyof JobPostingForm, value: any) => {
        setHasUserInteracted(true);
        onChange({ [field]: value });
    };

    const handleWorkTypeToggle = (workType: string, checked: boolean) => {
        const currentTypes = data.work_types || [];
        const newTypes = checked
            ? [...currentTypes, workType]
            : currentTypes.filter((type) => type !== workType);
        handleInputChange("work_types", newTypes);
    };

    const handleLanguageToggle = (language: string, checked: boolean) => {
        const currentLangs = data.language_preferences || [];
        const newLangs = checked
            ? [...currentLangs, language]
            : currentLangs.filter((lang) => lang !== language);
        handleInputChange("language_preferences", newLangs);
    };

    // Use client errors if available and user has interacted, otherwise use server errors
    const displayErrors =
        (showValidation || hasUserInteracted) &&
        Object.keys(clientErrors).length > 0
            ? clientErrors
            : showValidation
            ? errors
            : {};

    return (
        <div className="w-full mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                        <Briefcase className="w-6 h-6 text-primary" />
                        {isEditMode ? "Edit Job Details" : "Job Information"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {isEditMode
                            ? "Update your job posting details below"
                            : "Provide detailed information about the job position you're offering"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Basic Job Information */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Basic Information
                            </h3>
                        </div>

                        {/* Job Title */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="title"
                                className="text-sm font-medium"
                            >
                                Job Title *
                            </Label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="e.g., Live-in Housekeeper, Part-time Nanny"
                                    value={data.title || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.title
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            {displayErrors.title && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.title}
                                </p>
                            )}
                        </div>

                        {/* Work Types */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Work Types Required *
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {workTypeOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                                            (data.work_types || []).includes(
                                                option.value
                                            )
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                    >
                                        <Checkbox
                                            id={`work-${option.value}`}
                                            checked={(
                                                data.work_types || []
                                            ).includes(option.value)}
                                            onCheckedChange={(checked) =>
                                                handleWorkTypeToggle(
                                                    option.value,
                                                    checked as boolean
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`work-${option.value}`}
                                            className="text-sm font-medium cursor-pointer flex items-center gap-2"
                                        >
                                            <span>{option.icon}</span>
                                            {option.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {displayErrors.work_types && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.work_types}
                                </p>
                            )}
                        </div>

                        {/* Job Description */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Job Description *
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe the job responsibilities, requirements, and any special instructions..."
                                value={data.description || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                className={`min-h-[120px] sm:text-sm text-xs ${
                                    displayErrors.description
                                        ? "border-red-500"
                                        : ""
                                }`}
                            />
                            <p className="text-xs text-muted-foreground">
                                Minimum 50 characters. Be detailed about duties,
                                requirements, and expectations.
                            </p>
                            <span className="text-xs text-muted-foreground">
                                {data.description?.length || 0} / 1000
                            </span>
                            {displayErrors.description && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Home className="w-4 h-4 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Employment Details
                            </h3>
                        </div>

                        {/* Accommodation Type */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="accommodation_type"
                                className="text-sm font-medium"
                            >
                                Accommodation Type *
                            </Label>
                            <Select
                                value={data.accommodation_type || ""}
                                onValueChange={(value) =>
                                    handleInputChange(
                                        "accommodation_type",
                                        value
                                    )
                                }
                            >
                                <SelectTrigger
                                    className={`h-11 ${
                                        displayErrors.accommodation_type
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                >
                                    <SelectValue placeholder="Select accommodation arrangement" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accommodationTypes.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {displayErrors.accommodation_type && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.accommodation_type}
                                </p>
                            )}
                        </div>

                        {/* Benefits */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Benefits Provided
                            </Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                                    <Bath className="w-5 h-5 text-blue-500" />
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="provides_toiletries"
                                            checked={!!data.provides_toiletries}
                                            onCheckedChange={(checked) =>
                                                handleInputChange(
                                                    "provides_toiletries",
                                                    Boolean(checked)
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor="provides_toiletries"
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            Provides Toiletries
                                        </Label>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 rounded-lg border">
                                    <Utensils className="w-5 h-5 text-green-500" />
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="provides_food"
                                            checked={!!data.provides_food}
                                            onCheckedChange={(checked) =>
                                                handleInputChange(
                                                    "provides_food",
                                                    Boolean(checked)
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor="provides_food"
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            Provides Meals
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compensation & Schedule */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                                <PhilippinePeso className="w-4 h-4 text-green-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Compensation & Schedule
                            </h3>
                        </div>

                        {/* Salary Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="min_salary"
                                    className="text-sm font-medium"
                                >
                                    Minimum Salary (₱)
                                </Label>
                                <div className="relative">
                                    <PhilippinePeso className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="min_salary"
                                        type="number"
                                        placeholder="15000"
                                        value={data.min_salary ?? ""}
                                        onChange={(e) => {
                                            handleInputChange(
                                                "min_salary",
                                                e.target.value
                                            );
                                        }}
                                        onBlur={(e) => {
                                            handleInputChange(
                                                "min_salary",
                                                e.target.value
                                                    ? Number(
                                                          Number(
                                                              e.target.value
                                                          ).toFixed(2)
                                                      )
                                                    : null
                                            );
                                        }}
                                        className={`pl-10 h-11 ${
                                            displayErrors.min_salary
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    This is the monthly wage.
                                </p>
                                {displayErrors.min_salary && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.min_salary}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="max_salary"
                                    className="text-sm font-medium"
                                >
                                    Maximum Salary (₱)
                                </Label>
                                <div className="relative">
                                    <PhilippinePeso className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="max_salary"
                                        type="number"
                                        placeholder="25000"
                                        value={data.max_salary ?? ""}
                                        onChange={(e) => {
                                            handleInputChange(
                                                "max_salary",
                                                e.target.value
                                            );
                                        }}
                                        onBlur={(e) => {
                                            handleInputChange(
                                                "max_salary",
                                                e.target.value
                                                    ? Number(
                                                          Number(
                                                              e.target.value
                                                          ).toFixed(2)
                                                      )
                                                    : null
                                            );
                                        }}
                                        className={`pl-10 h-11 ${
                                            displayErrors.max_salary
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    This is the monthly wage.
                                </p>
                                {displayErrors.max_salary && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.max_salary}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Day Off */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="day_off_type"
                                    className="text-sm font-medium"
                                >
                                    Day Off Type *
                                </Label>
                                <Select
                                    value={data.day_off_type || ""}
                                    onValueChange={(value) =>
                                        handleInputChange("day_off_type", value)
                                    }
                                >
                                    <SelectTrigger
                                        className={`h-11 ${
                                            displayErrors.day_off_type
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    >
                                        <SelectValue placeholder="Select day off frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dayOffTypes.map((type) => (
                                            <SelectItem
                                                key={type.value}
                                                value={type.value}
                                            >
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {displayErrors.day_off_type && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.day_off_type}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="day_off_preference"
                                    className="text-sm font-medium"
                                >
                                    Day Off Preference
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="day_off_preference"
                                        type="text"
                                        placeholder="e.g., Sunday, Weekends, Flexible"
                                        value={data.day_off_preference || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "day_off_preference",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 h-11 ${
                                            displayErrors.day_off_preference
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {displayErrors.day_off_preference && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.day_off_preference}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Language Preferences */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                                <Globe className="w-4 h-4 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Language Preferences
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Preferred Languages (Optional)
                            </Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {languageOptions.map((language) => (
                                    <div
                                        key={language.value}
                                        className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                                            (
                                                data.language_preferences || []
                                            ).includes(language.value)
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50"
                                        }`}
                                    >
                                        <Checkbox
                                            id={`lang-${language.value}`}
                                            checked={(
                                                data.language_preferences || []
                                            ).includes(language.value)}
                                            onCheckedChange={(checked) =>
                                                handleLanguageToggle(
                                                    language.value,
                                                    checked as boolean
                                                )
                                            }
                                        />
                                        <Label
                                            htmlFor={`lang-${language.value}`}
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            {language.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                            {displayErrors.language_preferences && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.language_preferences}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Info Alert */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-2">
                                💡 Tips for a great job posting:
                            </p>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                                <li>
                                    Be specific about duties and expectations
                                </li>
                                <li>
                                    Mention any special requirements (e.g.,
                                    cooking skills, pet care)
                                </li>
                                <li>
                                    Include details about working hours and
                                    schedule flexibility
                                </li>
                                <li>
                                    Be transparent about salary range to attract
                                    serious candidates
                                </li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
