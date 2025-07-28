import { AlertCircle, Calendar, PhilippinePeso } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Textarea } from "@/Components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useDecimalInput } from "@/hooks/useDecimalInput";
import { CreateMaidFormData } from "../../../utils/types";
import SocialMediaLinks from "./SocialMediaLinks";

const ACCOMMODATION_OPTIONS = [
    { value: "live_in", label: "Live-in" },
    { value: "live_out", label: "Live-out" },
    { value: "either", label: "Either" },
];

interface MaidProfessionalInfoProps {
    data: CreateMaidFormData;
    onChange: (updates: Partial<CreateMaidFormData>) => void;
    errors: Record<string, string>;
}

export default function MaidProfessionalInfo({
    data,
    onChange,
    errors,
}: MaidProfessionalInfoProps) {
    const handleMaidInputChange = (
        field: keyof CreateMaidFormData["maid"],
        value: any
    ) => {
        onChange({
            maid: {
                ...data.maid,
                [field]: value,
            },
        });
    };

    const {
        input: expectedSalaryInput,
        handleChange: handleExpectedSalaryChange,
        handleBlur: handleExpectedSalaryBlur,
    } = useDecimalInput(data.maid.expected_salary, (val) =>
        handleMaidInputChange("expected_salary", val)
    );

    // Helper to safely get social media links as an object
    const getSocialMediaLinks = (): Record<string, string> => {
        const links = data.maid.social_media_links;

        // If it's null or undefined, return empty object
        if (links === null || links === undefined) {
            return {};
        }

        // If it's already an object (not array), cast and return it
        if (typeof links === "object" && !Array.isArray(links)) {
            return links as Record<string, string>;
        }

        // If it's an array, convert it to an object with numeric keys
        if (Array.isArray(links)) {
            return Object.fromEntries(
                links.map((url, index) => [String(index), url])
            );
        }

        // Default case, return empty object
        return {};
    };

    return (
        <div className="space-y-4">
            {/* Bio */}
            <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
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
                        errors.bio ? "border-red-500" : ""
                    }`}
                    maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">
                    {(data.maid.bio || "").length}/1000 characters
                </p>
                {errors.bio && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.bio}
                    </p>
                )}
            </div>

            {/* Years of Experience */}
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
                    className={errors.years_experience ? "border-red-500" : ""}
                />
                {errors.years_experience && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.years_experience}
                    </p>
                )}
            </div>

            {/* Expected Salary */}
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
                            errors.expected_salary ? "border-red-500" : ""
                        }`}
                    />
                </div>
                {errors.expected_salary && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.expected_salary}
                    </p>
                )}
            </div>

            {/* Preferred Accommodation */}
            <div className="space-y-2">
                <Label
                    htmlFor="preferred_accommodation"
                    className="text-sm font-medium"
                >
                    Preferred Accommodation
                </Label>
                <Select
                    value={data.maid.preferred_accommodation || ""}
                    onValueChange={(value) =>
                        handleMaidInputChange(
                            "preferred_accommodation",
                            value || null
                        )
                    }
                >
                    <SelectTrigger
                        className={
                            errors.preferred_accommodation
                                ? "border-red-500"
                                : ""
                        }
                    >
                        <SelectValue placeholder="Select accommodation preference" />
                    </SelectTrigger>
                    <SelectContent>
                        {ACCOMMODATION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.preferred_accommodation && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.preferred_accommodation}
                    </p>
                )}
            </div>

            {/* Earliest Start Date */}
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
                                ? data.maid.earliest_start_date.slice(0, 10)
                                : ""
                        }
                        onChange={(e) =>
                            handleMaidInputChange(
                                "earliest_start_date",
                                e.target.value
                            )
                        }
                        className={`pl-10 ${
                            errors.earliest_start_date ? "border-red-500" : ""
                        }`}
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>
                {errors.earliest_start_date && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.earliest_start_date}
                    </p>
                )}
            </div>

            {/* Relocation */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Relocation</Label>
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="is_willing_to_relocate"
                        checked={!!data.maid.is_willing_to_relocate}
                        onCheckedChange={(checked) =>
                            handleMaidInputChange(
                                "is_willing_to_relocate",
                                !!checked
                            )
                        }
                    />
                    <Label htmlFor="is_willing_to_relocate" className="text-sm">
                        Willing to relocate
                    </Label>
                </div>
            </div>

            {/* Social Media Links */}
            <SocialMediaLinks
                links={getSocialMediaLinks()}
                onChange={(links) =>
                    handleMaidInputChange("social_media_links", links)
                }
                error={errors.social_media_links}
            />
        </div>
    );
}
