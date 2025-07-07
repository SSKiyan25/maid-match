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
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Home, Users, AlertCircle, Info, MapPin } from "lucide-react";
import { InfoAlert } from "@/Components/Form/InfoAlert";

import type {
    Step2HouseholdInfoProps,
    Step2Data,
    AddressData,
} from "../../utils/types";
import { useStepValidation } from "../../../../../../hooks/useStepValidation";
import {
    validateStep2,
    parseAddress,
    stringifyAddress,
} from "../../utils/step2Validation";

export default function Step2_HouseholdInfo({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step2HouseholdInfoProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const addressData = parseAddress(data.address || "");
    const validationData = useMemo(
        () => ({
            ...data,
            addressData,
        }),
        [data, addressData]
    );

    const memoizedValidator = useCallback(
        (validationData: any) => validateStep2(validationData),
        []
    );

    const { clientErrors, isValid } = useStepValidation(
        validationData,
        memoizedValidator,
        onValidationChange
    );

    const handleInputChange = (
        field: keyof Step2Data,
        value: string | number
    ) => {
        setHasUserInteracted(true);
        onChange({ [field]: value });
    };

    const handleAddressChange = (field: keyof AddressData, value: string) => {
        setHasUserInteracted(true);
        const updatedAddressData = {
            ...addressData,
            [field]: value,
        };
        const addressString = stringifyAddress(updatedAddressData);
        onChange({ address: addressString });
    };

    const displayErrors =
        showValidation || hasUserInteracted ? clientErrors : {};

    return (
        <div className="max-w-5xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Household Information
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Tell us about your home and family to help us find the
                        perfect match
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Address Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-green-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Address Information
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
                                <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="street"
                                    type="text"
                                    placeholder="House number, street name, subdivision..."
                                    value={addressData.street}
                                    onChange={(e) =>
                                        handleAddressChange(
                                            "street",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.address ||
                                        displayErrors["address.street"]
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            {(displayErrors.address ||
                                displayErrors["address.street"]) && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.address ||
                                        displayErrors["address.street"]}
                                </p>
                            )}
                        </div>

                        {/* Barangay and City */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="barangay"
                                    className="text-sm font-medium"
                                >
                                    Barangay *
                                </Label>
                                <Input
                                    id="barangay"
                                    type="text"
                                    placeholder="Enter barangay"
                                    value={addressData.barangay}
                                    onChange={(e) =>
                                        handleAddressChange(
                                            "barangay",
                                            e.target.value
                                        )
                                    }
                                    className={`h-11 ${
                                        displayErrors["address.barangay"]
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {displayErrors["address.barangay"] && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors["address.barangay"]}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="city"
                                    className="text-sm font-medium"
                                >
                                    City/Municipality *
                                </Label>
                                <Input
                                    id="city"
                                    type="text"
                                    placeholder="Enter city or municipality"
                                    value={addressData.city}
                                    onChange={(e) =>
                                        handleAddressChange(
                                            "city",
                                            e.target.value
                                        )
                                    }
                                    className={`h-11 ${
                                        displayErrors["address.city"]
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {displayErrors["address.city"] && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors["address.city"]}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Province */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="province"
                                className="text-sm font-medium"
                            >
                                Province *
                            </Label>
                            <Input
                                id="province"
                                type="text"
                                placeholder="Enter province (e.g., Metro Manila, Cebu, Laguna...)"
                                value={addressData.province}
                                onChange={(e) =>
                                    handleAddressChange(
                                        "province",
                                        e.target.value
                                    )
                                }
                                className={`h-11 ${
                                    displayErrors["address.province"]
                                        ? "border-red-500"
                                        : ""
                                }`}
                            />
                            <p className="text-xs text-muted-foreground">
                                Enter the province where your home is located
                            </p>
                            {displayErrors["address.province"] && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors["address.province"]}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Family Information Section */}
                    <div className="space-y-4 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Family Details
                            </h3>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="family_size"
                                className="text-sm font-medium"
                            >
                                Family Size *
                            </Label>
                            <div className="relative">
                                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="family_size"
                                    type="number"
                                    min="1"
                                    max="20"
                                    placeholder="e.g., 4"
                                    value={data.family_size || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "family_size",
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    className={`pl-10 h-11 w-full md:w-1/2 ${
                                        displayErrors.family_size
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total number of family members living in the
                                house
                            </p>
                            {displayErrors.family_size && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.family_size}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="household_description"
                                className="text-sm font-medium"
                            >
                                Household Description
                            </Label>
                            <Textarea
                                id="household_description"
                                placeholder="Describe your household, living situation, house type, and any important details about your home environment..."
                                value={data.household_description}
                                onChange={(e) =>
                                    handleInputChange(
                                        "household_description",
                                        e.target.value
                                    )
                                }
                                className={`min-h-[120px] resize-none ${
                                    displayErrors.household_description
                                        ? "border-red-500"
                                        : ""
                                }`}
                                maxLength={1000}
                            />
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-muted-foreground">
                                    Include house type, layout, special
                                    features, or any details that help describe
                                    your home
                                </p>
                                <span className="text-xs text-muted-foreground">
                                    {data.household_description?.length || 0}
                                    /1000
                                </span>
                            </div>
                            {displayErrors.household_description && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.household_description}
                                </p>
                            )}
                        </div>
                    </div>
                    {/* Address Example */}
                    <InfoAlert
                        icon={
                            <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                        }
                        colorClass="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        title="Address Example:"
                        footer={
                            <div className="text-sm bg-white dark:bg-gray-800 p-3 rounded border">
                                <p>
                                    <strong>Street:</strong> 123 Main Street,
                                    Green Valley Subdivision
                                </p>
                                <p>
                                    <strong>Barangay:</strong> Barangay San
                                    Antonio
                                </p>
                                <p>
                                    <strong>City:</strong> Quezon City
                                </p>
                                <p>
                                    <strong>Province:</strong> Metro Manila
                                </p>
                            </div>
                        }
                    />

                    {/* Household Description Examples */}
                    <InfoAlert
                        icon={
                            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        }
                        colorClass="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        title="Household Description Examples:"
                        tips={[
                            '• "2-story townhouse with 3 bedrooms, modern kitchen, small garden"',
                            '• "Condo unit on 15th floor with elevator access, parking available"',
                            '• "Traditional house with elderly grandparents, quiet neighborhood"',
                            '• "Busy family home with young children, open kitchen concept"',
                        ]}
                    />

                    {/* Privacy Alert */}
                    <InfoAlert
                        icon={
                            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        }
                        colorClass="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                    >
                        <strong>Privacy Note:</strong> Your address will only be
                        shared with helpers you've matched with and approved. We
                        use this information to help find helpers in your area.
                    </InfoAlert>
                </CardContent>
            </Card>
        </div>
    );
}
