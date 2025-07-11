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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    User,
    Globe,
    Calendar,
    Phone,
    Star,
    Building,
    AlertCircle,
    Plus,
    X,
    PhilippinePeso,
} from "lucide-react";
import { useDecimalInput } from "@/hooks/useDecimalInput";

import { CreateMaidFormData } from "../../utils/types";
import { useStepValidation } from "../../../../../hooks/useStepValidation";
import { validateStep2 } from "../../utils/step2Validation";
import { formatPhoneNumber } from "../../../../../utils/formFunctions";

interface Step2MaidInfoProps {
    data: CreateMaidFormData;
    onChange: (updates: Partial<CreateMaidFormData>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
    isEdit?: boolean;
}

const MARITAL_STATUS_OPTIONS = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
];

const ACCOMMODATION_OPTIONS = [
    { value: "live_in", label: "Live-in" },
    { value: "live_out", label: "Live-out" },
    { value: "either", label: "Either" },
];

const STATUS_OPTIONS = [
    { value: "available", label: "Available" },
    { value: "employed", label: "Employed" },
    { value: "unavailable", label: "Unavailable" },
];

const COMMON_SKILLS = [
    "Housekeeping",
    "Cooking",
    "Childcare",
    "Elderly Care",
    "Pet Care",
    "Laundry",
    "Ironing",
    "Gardening",
    "Driving",
    "Tutoring",
];

const COMMON_LANGUAGES = [
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

export default function Step2_MaidInfo({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step2MaidInfoProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [newLanguage, setNewLanguage] = useState("");

    const { clientErrors, isValid } = useStepValidation(
        data,
        validateStep2,
        onValidationChange
    );

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        if (onValidationChange && isValid !== prevIsValid.current) {
            onValidationChange(isValid);
            prevIsValid.current = isValid;
        }
    }, [isValid, onValidationChange]);

    const handleMaidInputChange = (
        field: keyof CreateMaidFormData["maid"],
        value: any
    ) => {
        setHasUserInteracted(true);
        onChange({
            maid: {
                ...data.maid,
                [field]: value,
            },
        });
    };

    const handleAgencyMaidInputChange = (
        field: keyof CreateMaidFormData["agency_maid"],
        value: any
    ) => {
        setHasUserInteracted(true);
        onChange({
            agency_maid: {
                ...data.agency_maid,
                [field]: value,
            },
        });
    };

    const addSkill = (skill: string) => {
        if (skill && !data.maid.skills?.includes(skill)) {
            handleMaidInputChange("skills", [
                ...(data.maid.skills || []),
                skill,
            ]);
        }
        setNewSkill("");
    };

    const removeSkill = (skillToRemove: string) => {
        handleMaidInputChange(
            "skills",
            data.maid.skills?.filter((skill) => skill !== skillToRemove) || []
        );
    };

    const addLanguage = (language: string) => {
        if (language && !data.maid.languages?.includes(language)) {
            handleMaidInputChange("languages", [
                ...(data.maid.languages || []),
                language,
            ]);
        }
        setNewLanguage("");
    };

    const removeLanguage = (languageToRemove: string) => {
        handleMaidInputChange(
            "languages",
            data.maid.languages?.filter((lang) => lang !== languageToRemove) ||
                []
        );
    };

    const handleEmergencyPhoneChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const formatted = formatPhoneNumber(e.target.value);
        handleMaidInputChange("emergency_contact_phone", formatted);
    };

    const {
        input: agencyFeeInput,
        handleChange: handleAgencyFeeChange,
        handleBlur: handleAgencyFeeBlur,
    } = useDecimalInput(data.agency_maid.agency_fee, (val) =>
        handleAgencyMaidInputChange("agency_fee", val)
    );

    const {
        input: expectedSalaryInput,
        handleChange: handleExpectedSalaryChange,
        handleBlur: handleExpectedSalaryBlur,
    } = useDecimalInput(data.maid.expected_salary, (val) =>
        handleMaidInputChange("expected_salary", val)
    );

    const displayErrors =
        showValidation || hasUserInteracted ? clientErrors : {};

    return (
        <div className="max-w-5xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Maid Information & Agency Settings
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Configure the maid's professional details and agency
                        relationship
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Maid Information Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Professional Information
                            </h3>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="bio"
                                className="text-sm font-medium"
                            >
                                Bio/Description
                            </Label>
                            <Textarea
                                id="bio"
                                placeholder="Describe the maid's experience, personality, and qualities..."
                                value={data.maid.bio || ""}
                                onChange={(e) =>
                                    handleMaidInputChange("bio", e.target.value)
                                }
                                className={`min-h-[100px] ${
                                    displayErrors.bio ? "border-red-500" : ""
                                }`}
                                maxLength={1000}
                            />
                            <p className="text-xs text-muted-foreground">
                                {(data.maid.bio || "").length}/1000 characters
                            </p>
                            {displayErrors.bio && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.bio}
                                </p>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Skills
                            </Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {data.maid.skills?.map((skill) => (
                                    <Badge
                                        key={skill}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        {skill}
                                        <X
                                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                                            onClick={() => removeSkill(skill)}
                                        />
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {COMMON_SKILLS.filter(
                                    (skill) =>
                                        !data.maid.skills?.includes(skill)
                                ).map((skill) => (
                                    <Button
                                        key={skill}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addSkill(skill)}
                                        className="h-7 text-xs"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        {skill}
                                    </Button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add custom skill"
                                    value={newSkill}
                                    onChange={(e) =>
                                        setNewSkill(e.target.value)
                                    }
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addSkill(newSkill);
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    onClick={() => addSkill(newSkill)}
                                    disabled={!newSkill.trim()}
                                >
                                    Add
                                </Button>
                            </div>
                            {displayErrors.skills && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.skills}
                                </p>
                            )}
                        </div>

                        {/* Languages */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">
                                Languages
                            </Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {data.maid.languages?.map((language) => (
                                    <Badge
                                        key={language}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        <Globe className="w-3 h-3" />
                                        {language}
                                        <X
                                            className="w-3 h-3 cursor-pointer hover:text-red-500"
                                            onClick={() =>
                                                removeLanguage(language)
                                            }
                                        />
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {COMMON_LANGUAGES.filter(
                                    (lang) =>
                                        !data.maid.languages?.includes(
                                            lang.value
                                        )
                                ).map((language) => (
                                    <Button
                                        key={language.value}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            addLanguage(language.value)
                                        }
                                        className="h-7 text-xs"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        {language.label}
                                    </Button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Add custom language"
                                    value={newLanguage}
                                    onChange={(e) =>
                                        setNewLanguage(e.target.value)
                                    }
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addLanguage(newLanguage);
                                        }
                                    }}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    onClick={() => addLanguage(newLanguage)}
                                    disabled={!newLanguage.trim()}
                                >
                                    Add
                                </Button>
                            </div>
                            {displayErrors.languages && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.languages}
                                </p>
                            )}
                        </div>

                        {/* Nationality and Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="nationality"
                                    className="text-sm font-medium"
                                >
                                    Nationality
                                </Label>
                                <Input
                                    id="nationality"
                                    placeholder="e.g., Filipino, Indonesian"
                                    value={data.maid.nationality || ""}
                                    onChange={(e) =>
                                        handleMaidInputChange(
                                            "nationality",
                                            e.target.value
                                        )
                                    }
                                    className={
                                        displayErrors.nationality
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {displayErrors.nationality && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.nationality}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="years_experience"
                                    className="text-sm font-medium"
                                >
                                    Years of Experience
                                </Label>
                                <Input
                                    id="years_experience"
                                    type="number"
                                    min="0"
                                    max="50"
                                    placeholder="0"
                                    value={data.maid.years_experience || ""}
                                    onChange={(e) =>
                                        handleMaidInputChange(
                                            "years_experience",
                                            e.target.value
                                                ? parseInt(e.target.value)
                                                : undefined
                                        )
                                    }
                                    className={
                                        displayErrors.years_experience
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {displayErrors.years_experience && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.years_experience}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Personal Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="marital_status"
                                    className="text-sm font-medium"
                                >
                                    Marital Status
                                </Label>
                                <Select
                                    value={data.maid.marital_status || ""}
                                    onValueChange={(value) =>
                                        handleMaidInputChange(
                                            "marital_status",
                                            value || null
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        className={
                                            displayErrors.marital_status
                                                ? "border-red-500"
                                                : ""
                                        }
                                    >
                                        <SelectValue placeholder="Select marital status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MARITAL_STATUS_OPTIONS.map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                                {displayErrors.marital_status && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.marital_status}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Children
                                </Label>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="has_children"
                                        checked={!!data.maid.has_children}
                                        onCheckedChange={(checked) =>
                                            handleMaidInputChange(
                                                "has_children",
                                                !!checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="has_children"
                                        className="text-sm"
                                    >
                                        Has children
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Employment Preferences */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="expected_salary"
                                    className="text-sm font-medium"
                                >
                                    Expected Salary (Monthly)
                                </Label>
                                <div className="relative">
                                    <PhilippinePeso className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="expected_salary"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={expectedSalaryInput}
                                        onChange={handleExpectedSalaryChange}
                                        onBlur={handleExpectedSalaryBlur}
                                        className={`pl-10 ${
                                            displayErrors.expected_salary
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {displayErrors.expected_salary && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.expected_salary}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="preferred_accommodation"
                                    className="text-sm font-medium"
                                >
                                    Preferred Accommodation
                                </Label>
                                <Select
                                    value={
                                        data.maid.preferred_accommodation || ""
                                    }
                                    onValueChange={(value) =>
                                        handleMaidInputChange(
                                            "preferred_accommodation",
                                            value || null
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        className={
                                            displayErrors.preferred_accommodation
                                                ? "border-red-500"
                                                : ""
                                        }
                                    >
                                        <SelectValue placeholder="Select accommodation preference" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ACCOMMODATION_OPTIONS.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {displayErrors.preferred_accommodation && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.preferred_accommodation}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="earliest_start_date"
                                    className="text-sm font-medium"
                                >
                                    Earliest Start Date
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="earliest_start_date"
                                        type="date"
                                        value={
                                            data.maid.earliest_start_date
                                                ? data.maid.earliest_start_date.slice(
                                                      0,
                                                      10
                                                  )
                                                : ""
                                        }
                                        onChange={(e) =>
                                            handleMaidInputChange(
                                                "earliest_start_date",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 ${
                                            displayErrors.earliest_start_date
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                    />
                                </div>
                                {displayErrors.earliest_start_date && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.earliest_start_date}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Relocation
                                </Label>
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="is_willing_to_relocate"
                                        checked={
                                            !!data.maid.is_willing_to_relocate
                                        }
                                        onCheckedChange={(checked) =>
                                            handleMaidInputChange(
                                                "is_willing_to_relocate",
                                                !!checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="is_willing_to_relocate"
                                        className="text-sm"
                                    >
                                        Willing to relocate
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="emergency_contact_name"
                                    className="text-sm font-medium"
                                >
                                    Emergency Contact Name
                                </Label>
                                <Input
                                    id="emergency_contact_name"
                                    placeholder="Full name"
                                    value={
                                        data.maid.emergency_contact_name || ""
                                    }
                                    onChange={(e) =>
                                        handleMaidInputChange(
                                            "emergency_contact_name",
                                            e.target.value
                                        )
                                    }
                                    className={
                                        displayErrors.emergency_contact_name
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {displayErrors.emergency_contact_name && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.emergency_contact_name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="emergency_contact_phone"
                                    className="text-sm font-medium"
                                >
                                    Emergency Contact Phone
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="emergency_contact_phone"
                                        type="tel"
                                        placeholder="+63 917 123 4567"
                                        value={
                                            data.maid.emergency_contact_phone ||
                                            ""
                                        }
                                        onChange={handleEmergencyPhoneChange}
                                        className={`pl-10 ${
                                            displayErrors.emergency_contact_phone
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {displayErrors.emergency_contact_phone && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.emergency_contact_phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Agency Settings Section */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Building className="w-4 h-4 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Agency Settings
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="agency_fee"
                                    className="text-sm font-medium"
                                >
                                    Agency Fee
                                </Label>
                                <div className="relative">
                                    <PhilippinePeso className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="agency_fee"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={agencyFeeInput}
                                        onChange={handleAgencyFeeChange}
                                        onBlur={handleAgencyFeeBlur}
                                        className="pl-10"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Commission or placement fee
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="status"
                                    className="text-sm font-medium"
                                >
                                    Status
                                </Label>
                                <Select
                                    value={data.maid.status || "available"}
                                    onValueChange={(value) =>
                                        handleMaidInputChange(
                                            "status",
                                            value || null
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STATUS_OPTIONS.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_premium"
                                        checked={!!data.agency_maid.is_premium}
                                        onCheckedChange={(checked) =>
                                            handleAgencyMaidInputChange(
                                                "is_premium",
                                                !!checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="is_premium"
                                        className="text-sm flex items-center gap-1"
                                    >
                                        <Star className="w-3 h-3" />
                                        Premium listing
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_trained"
                                        checked={!!data.agency_maid.is_trained}
                                        onCheckedChange={(checked) =>
                                            handleAgencyMaidInputChange(
                                                "is_trained",
                                                !!checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor="is_trained"
                                        className="text-sm"
                                    >
                                        Agency trained
                                    </Label>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="agency_notes"
                                    className="text-sm font-medium"
                                >
                                    Agency Notes
                                </Label>
                                <Textarea
                                    id="agency_notes"
                                    placeholder="Internal notes about this maid (visible only to agency)..."
                                    value={data.agency_maid.agency_notes || ""}
                                    onChange={(e) =>
                                        handleAgencyMaidInputChange(
                                            "agency_notes",
                                            e.target.value
                                        )
                                    }
                                    className={`min-h-[80px] ${
                                        displayErrors.agency_notes
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {displayErrors.agency_notes && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.agency_notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Alert */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            This information helps employers find the right maid
                            for their needs. All fields are optional but
                            providing more details increases visibility.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
