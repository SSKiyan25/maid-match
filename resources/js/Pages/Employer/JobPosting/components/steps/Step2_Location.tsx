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
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
    MapPin,
    Navigation,
    Eye,
    EyeOff,
    AlertCircle,
    Landmark,
    MapPinned,
} from "lucide-react";

import { JobLocation } from "../../utils/types";
import { validateStep2 } from "../../utils/step2Validation";
import { useStepValidation } from "../../hooks/useStepValidation";

interface Step2LocationProps {
    data: JobLocation;
    onChange: (updates: Partial<JobLocation>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
    isEditMode?: boolean;
}

export default function Step2_Location({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
    isEditMode = false,
}: Step2LocationProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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

    const handleInputChange = (field: keyof JobLocation, value: any) => {
        setHasUserInteracted(true);
        onChange({ [field]: value });
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by this browser.");
            return;
        }

        setIsLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleInputChange("latitude", latitude);
                handleInputChange("longitude", longitude);
                setIsLoadingLocation(false);
            },
            (error) => {
                console.error("Error getting location:", error);
                setIsLoadingLocation(false);
                alert("Unable to get your location. Please enter it manually.");
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };

    // Use client errors if available and user has interacted, otherwise use server errors
    const displayErrors =
        showValidation &&
        hasUserInteracted &&
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
                        {isEditMode ? "Edit Job Location" : "Job Location"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {isEditMode
                            ? "Update the location details for your job posting"
                            : "Specify where the job will be performed"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Address Information */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Address Details
                            </h3>
                        </div>

                        {/* Barangay */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="brgy"
                                className="text-sm font-medium"
                            >
                                Barangay *
                            </Label>
                            <div className="relative">
                                <MapPinned className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="brgy"
                                    type="text"
                                    placeholder="Enter barangay name"
                                    value={data.brgy || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "brgy",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.brgy
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            {displayErrors.brgy && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.brgy}
                                </p>
                            )}
                        </div>

                        {/* City and Province */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="city"
                                    className="text-sm font-medium"
                                >
                                    City *
                                </Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="city"
                                        type="text"
                                        placeholder="Enter city name"
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
                                        placeholder="Enter province name"
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

                        {/* Postal Code */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="postal_code"
                                className="text-sm font-medium"
                            >
                                Postal Code
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="postal_code"
                                    type="text"
                                    placeholder="e.g., 1000"
                                    value={data.postal_code || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "postal_code",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.postal_code
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Optional - Helps with location accuracy
                            </p>
                            {displayErrors.postal_code && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.postal_code}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Additional Location Details */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Landmark className="w-4 h-4 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Additional Details
                            </h3>
                        </div>

                        {/* Landmark */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="landmark"
                                className="text-sm font-medium"
                            >
                                Nearby Landmark
                            </Label>
                            <div className="relative">
                                <Landmark className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="landmark"
                                    type="text"
                                    placeholder="e.g., Near SM Mall, Beside McDonald's"
                                    value={data.landmark || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "landmark",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.landmark
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Optional - Helps applicants find your location
                                easier
                            </p>
                            {displayErrors.landmark && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.landmark}
                                </p>
                            )}
                        </div>

                        {/* Directions */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="directions"
                                className="text-sm font-medium"
                            >
                                Directions
                            </Label>
                            <Textarea
                                id="directions"
                                placeholder="Provide detailed directions to help applicants find your location..."
                                value={data.directions || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        "directions",
                                        e.target.value
                                    )
                                }
                                className={`min-h-[100px] ${
                                    displayErrors.directions
                                        ? "border-red-500"
                                        : ""
                                }`}
                            />
                            <p className="text-xs text-muted-foreground">
                                Optional - Include public transportation routes,
                                landmarks, or specific instructions
                            </p>
                            {displayErrors.directions && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.directions}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* GPS Coordinates */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                                <Navigation className="w-4 h-4 text-green-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                GPS Coordinates{" "}
                                <span className="text-xs text-muted-foreground font-normal">
                                    (Optional)
                                </span>
                            </h3>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                            You may skip this if you don't want to provide exact
                            coordinates.
                        </p>

                        {/* Auto-detect location button */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 bg-muted/30 rounded-lg">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={getCurrentLocation}
                                disabled={isLoadingLocation}
                                className="flex items-center gap-2"
                            >
                                {isLoadingLocation ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        Getting Location...
                                    </>
                                ) : (
                                    <>
                                        <Navigation className="w-4 h-4" />
                                        Use Current Location
                                    </>
                                )}
                            </Button>
                            {/* Show below button on mobile, beside on desktop */}
                            <p className="text-sm text-muted-foreground sm:ml-4 sm:mt-0 mt-2">
                                This will automatically fill in your GPS
                                coordinates for precise location mapping
                            </p>
                        </div>

                        {/* Manual coordinates input */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="latitude"
                                    className="text-sm font-medium"
                                >
                                    Latitude
                                </Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    placeholder="14.5995"
                                    value={data.latitude || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "latitude",
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null
                                        )
                                    }
                                    className={`h-11 ${
                                        displayErrors.latitude
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {displayErrors.latitude && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.latitude}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="longitude"
                                    className="text-sm font-medium"
                                >
                                    Longitude
                                </Label>
                                <Input
                                    id="longitude"
                                    type="number"
                                    step="any"
                                    placeholder="120.9842"
                                    value={data.longitude || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "longitude",
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null
                                        )
                                    }
                                    className={`h-11 ${
                                        displayErrors.longitude
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {displayErrors.longitude && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.longitude}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                                <Eye className="w-4 h-4 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Privacy Settings
                            </h3>
                        </div>

                        <div className="flex items-center space-x-3 p-4 rounded-lg border">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="is_hidden"
                                    checked={data.is_hidden || false}
                                    onCheckedChange={(checked) =>
                                        handleInputChange("is_hidden", checked)
                                    }
                                />
                                <Label
                                    htmlFor="is_hidden"
                                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                                >
                                    {data.is_hidden ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                    Hide exact location from public view
                                </Label>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            When enabled, only the general area (city/province)
                            will be shown publicly. Exact address will only be
                            shared with serious applicants.
                        </p>
                    </div>

                    {/* Info Alert */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-2">
                                🏠 Location Guidelines:
                            </p>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                                <li>
                                    Be as accurate as possible to help
                                    applicants find you
                                </li>
                                <li>
                                    Use the privacy setting if you prefer to
                                    share details later
                                </li>
                                <li>
                                    GPS coordinates help with mapping and
                                    distance calculations
                                </li>
                                <li>
                                    Good directions can help applicants estimate
                                    commute time
                                </li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
