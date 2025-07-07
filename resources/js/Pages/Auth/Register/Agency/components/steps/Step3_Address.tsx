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
import { MapPin, Building, Navigation, Map, AlertCircle } from "lucide-react";
import { InfoAlert } from "@/Components/Form/InfoAlert";
import { AgencyAddressStep } from "../../utils/types";
import { validateStep3 } from "../../utils/step3Validation";
import { useStepValidation } from "../../../../../../hooks/useStepValidation";

interface Step3AddressProps {
    data: AgencyAddressStep;
    onChange: (updates: Partial<AgencyAddressStep>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
}

export default function Step3_Address({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step3AddressProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    const { clientErrors, isValid } = useStepValidation(
        data,
        validateStep3,
        onValidationChange
    );

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        if (onValidationChange && isValid !== prevIsValid.current) {
            onValidationChange(isValid);
            prevIsValid.current = isValid;
        }
    }, [isValid, onValidationChange]);

    const handleInputChange = (field: keyof AgencyAddressStep, value: any) => {
        setHasUserInteracted(true);
        onChange({ ...data, [field]: value });
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
                        <MapPin className="w-6 h-6 text-primary" />
                        Address Information
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Provide your agency's physical address for client
                        reference
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Address Information */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Building className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Physical Address
                            </h3>
                        </div>

                        {/* Street Address */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="street"
                                className="text-sm font-medium"
                            >
                                Street Address *
                            </Label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="street"
                                    type="text"
                                    placeholder="e.g., 123 Main Street, Unit 4B"
                                    value={data.street || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "street",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.street
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Include building name, unit number, and street
                                name
                            </p>
                            {displayErrors.street && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.street}
                                </p>
                            )}
                        </div>

                        {/* Barangay */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="barangay"
                                className="text-sm font-medium"
                            >
                                Barangay *
                            </Label>
                            <div className="relative">
                                <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="barangay"
                                    type="text"
                                    placeholder="e.g., Barangay San Antonio"
                                    value={data.barangay || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "barangay",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.barangay
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            {displayErrors.barangay && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.barangay}
                                </p>
                            )}
                        </div>

                        {/* City and Province */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* City */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="city"
                                    className="text-sm font-medium"
                                >
                                    City/Municipality *
                                </Label>
                                <div className="relative">
                                    <Map className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="city"
                                        type="text"
                                        placeholder="e.g., Manila"
                                        value={data.city || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "city",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 h-11 ${
                                            displayErrors.city
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {displayErrors.city && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.city}
                                    </p>
                                )}
                            </div>

                            {/* Province */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="province"
                                    className="text-sm font-medium"
                                >
                                    Province *
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="province"
                                        type="text"
                                        placeholder="e.g., Metro Manila"
                                        value={data.province || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "province",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 h-11 ${
                                            displayErrors.province
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {displayErrors.province && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.province}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Preview */}
                    {(data.street ||
                        data.barangay ||
                        data.city ||
                        data.province) && (
                        <div className="space-y-4 pt-6 border-t border-border">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                    <Map className="w-4 h-4 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    Address Preview
                                </h3>
                            </div>

                            <div className="bg-muted/50 rounded-lg p-4">
                                <p className="text-sm text-muted-foreground mb-2">
                                    Your complete address will appear as:
                                </p>
                                <div className="text-base font-medium text-foreground">
                                    {[
                                        data.street,
                                        data.barangay,
                                        data.city,
                                        data.province,
                                    ]
                                        .filter(Boolean)
                                        .join(", ")}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Alert */}
                    <InfoAlert
                        icon={
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        }
                        colorClass="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        title="📍 Address Guidelines:"
                        tips={[
                            "Provide accurate address information for client reference",
                            "Include specific details like unit numbers or floor levels",
                            "Use official barangay and city names",
                            "This address will be visible to potential clients",
                            "Ensure the address is easily accessible for meetings",
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
