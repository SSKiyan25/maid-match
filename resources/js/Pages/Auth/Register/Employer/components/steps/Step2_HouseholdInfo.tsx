import React, { useEffect, useRef } from "react";
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

// Import types and hooks
import type {
    Step2HouseholdInfoProps,
    Step2Data,
    AddressData,
} from "../../utils/types";
import { useStep2Validation } from "../../hooks/useStep2Validation";

export default function Step2_HouseholdInfo({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step2HouseholdInfoProps) {
    const { clientErrors, addressData, updateAddressData, isValid } =
        useStep2Validation(data);

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        if (onValidationChange && isValid !== prevIsValid.current) {
            onValidationChange(isValid);
            prevIsValid.current = isValid;
        }
    }, [isValid, onValidationChange]);

    const handleInputChange = (
        field: keyof Step2Data,
        value: string | number
    ) => {
        onChange({ [field]: value });
    };

    const handleAddressChange = (field: keyof AddressData, value: string) => {
        const addressString = updateAddressData(field, value);
        handleInputChange("address", addressString);
    };

    // Use client errors if available, otherwise use server errors
    const displayErrors =
        showValidation && Object.keys(clientErrors).length > 0
            ? clientErrors
            : {};

    return (
        <div className="max-w-2xl mx-auto">
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
                    <div className="pt-6 border-t border-border">
                        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertDescription className="text-green-800 dark:text-green-200">
                                <div className="space-y-2">
                                    <p>
                                        <strong>Address Example:</strong>
                                    </p>
                                    <div className="text-sm bg-white dark:bg-gray-800 p-3 rounded border">
                                        <p>
                                            <strong>Street:</strong> 123 Main
                                            Street, Green Valley Subdivision
                                        </p>
                                        <p>
                                            <strong>Barangay:</strong> Barangay
                                            San Antonio
                                        </p>
                                        <p>
                                            <strong>City:</strong> Quezon City
                                        </p>
                                        <p>
                                            <strong>Province:</strong> Metro
                                            Manila
                                        </p>
                                    </div>
                                </div>
                            </AlertDescription>
                        </Alert>
                    </div>

                    {/* Examples Section */}
                    <div>
                        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertDescription className="text-blue-800 dark:text-blue-200">
                                <div className="space-y-2">
                                    <p>
                                        <strong>
                                            Household Description Examples:
                                        </strong>
                                    </p>
                                    <ul className="text-sm space-y-1 ml-4">
                                        <li>
                                            • "2-story townhouse with 3
                                            bedrooms, modern kitchen, small
                                            garden"
                                        </li>
                                        <li>
                                            • "Condo unit on 15th floor with
                                            elevator access, parking available"
                                        </li>
                                        <li>
                                            • "Traditional house with elderly
                                            grandparents, quiet neighborhood"
                                        </li>
                                        <li>
                                            • "Busy family home with young
                                            children, open kitchen concept"
                                        </li>
                                    </ul>
                                </div>
                            </AlertDescription>
                        </Alert>
                    </div>

                    {/* Privacy Alert */}
                    <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertDescription className="text-amber-800 dark:text-amber-200">
                            <strong>Privacy Note:</strong> Your address will
                            only be shared with helpers you've matched with and
                            approved. We use this information to help find
                            helpers in your area.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
