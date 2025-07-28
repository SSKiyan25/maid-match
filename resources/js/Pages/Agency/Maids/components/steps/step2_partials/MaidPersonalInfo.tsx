import { AlertCircle } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { formatPhoneNumber } from "../../../../../../utils/formFunctions";
import { CreateMaidFormData } from "../../../utils/types";

const MARITAL_STATUS_OPTIONS = [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
];

interface MaidPersonalInfoProps {
    data: CreateMaidFormData;
    onChange: (updates: Partial<CreateMaidFormData>) => void;
    errors: Record<string, string>;
}

export default function MaidPersonalInfo({
    data,
    onChange,
    errors,
}: MaidPersonalInfoProps) {
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

    const handleEmergencyPhoneChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const formatted = formatPhoneNumber(e.target.value);
        handleMaidInputChange("emergency_contact_phone", formatted);
    };

    return (
        <div className="space-y-4">
            {/* Nationality */}
            <div className="space-y-2">
                <Label htmlFor="nationality" className="text-sm font-medium">
                    Nationality
                </Label>
                <Input
                    id="nationality"
                    placeholder="e.g., Filipino, Indonesian"
                    value={data.maid.nationality || ""}
                    onChange={(e) =>
                        handleMaidInputChange("nationality", e.target.value)
                    }
                    className={errors.nationality ? "border-red-500" : ""}
                />
                {errors.nationality && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.nationality}
                    </p>
                )}
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
                <Label htmlFor="marital_status" className="text-sm font-medium">
                    Marital Status
                </Label>
                <Select
                    value={data.maid.marital_status || ""}
                    onValueChange={(value) =>
                        handleMaidInputChange("marital_status", value || null)
                    }
                >
                    <SelectTrigger
                        className={
                            errors.marital_status ? "border-red-500" : ""
                        }
                    >
                        <SelectValue placeholder="Select marital status" />
                    </SelectTrigger>
                    <SelectContent>
                        {MARITAL_STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.marital_status && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.marital_status}
                    </p>
                )}
            </div>

            {/* Children */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Children</Label>
                <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                        id="has_children"
                        checked={!!data.maid.has_children}
                        onCheckedChange={(checked) =>
                            handleMaidInputChange("has_children", !!checked)
                        }
                    />
                    <Label htmlFor="has_children" className="text-sm">
                        Has children
                    </Label>
                </div>
            </div>

            {/* Emergency Contact */}
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
                    value={data.maid.emergency_contact_name || ""}
                    onChange={(e) =>
                        handleMaidInputChange(
                            "emergency_contact_name",
                            e.target.value
                        )
                    }
                    className={
                        errors.emergency_contact_name ? "border-red-500" : ""
                    }
                />
                {errors.emergency_contact_name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.emergency_contact_name}
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
                <Input
                    id="emergency_contact_phone"
                    type="tel"
                    placeholder="+63 917 123 4567"
                    value={data.maid.emergency_contact_phone || ""}
                    onChange={handleEmergencyPhoneChange}
                    className={
                        errors.emergency_contact_phone ? "border-red-500" : ""
                    }
                />
                {errors.emergency_contact_phone && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.emergency_contact_phone}
                    </p>
                )}
            </div>
        </div>
    );
}
