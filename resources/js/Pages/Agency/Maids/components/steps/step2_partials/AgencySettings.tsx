import { AlertCircle, PhilippinePeso, Star } from "lucide-react";
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

const STATUS_OPTIONS = [
    { value: "available", label: "Available" },
    { value: "employed", label: "Employed" },
    { value: "unavailable", label: "Unavailable" },
];

interface AgencySettingsProps {
    data: CreateMaidFormData;
    onChange: (updates: Partial<CreateMaidFormData>) => void;
    errors: Record<string, string>;
}

export default function AgencySettings({
    data,
    onChange,
    errors,
}: AgencySettingsProps) {
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

    const handleAgencyMaidInputChange = (
        field: keyof CreateMaidFormData["agency_maid"],
        value: any
    ) => {
        onChange({
            agency_maid: {
                ...data.agency_maid,
                [field]: value,
            },
        });
    };

    const {
        input: agencyFeeInput,
        handleChange: handleAgencyFeeChange,
        handleBlur: handleAgencyFeeBlur,
    } = useDecimalInput(data.agency_maid.agency_fee, (val) =>
        handleAgencyMaidInputChange("agency_fee", val)
    );

    return (
        <div className="space-y-4">
            {/* Agency Fee */}
            <div className="space-y-2">
                <Label htmlFor="agency_fee" className="text-sm font-medium">
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

            {/* Status */}
            <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                    Status
                </Label>
                <Select
                    value={data.maid.status || "available"}
                    onValueChange={(value) =>
                        handleMaidInputChange("status", value || null)
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Checkboxes */}
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
                        <Label htmlFor="is_trained" className="text-sm">
                            Agency trained
                        </Label>
                    </div>
                </div>

                {/* Agency Notes */}
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
                            errors.agency_notes ? "border-red-500" : ""
                        }`}
                    />
                    {errors.agency_notes && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.agency_notes}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
