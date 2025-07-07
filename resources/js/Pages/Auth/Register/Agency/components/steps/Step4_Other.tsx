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
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Globe,
    Facebook,
    PhilippinePeso,
    Eye,
    EyeOff,
    AlertCircle,
    Info,
    Star,
} from "lucide-react";
import { InfoAlert } from "@/Components/Form/InfoAlert";
import { AgencyOtherInfoStep } from "../../utils/types";
import { validateStep4 } from "../../utils/step4Validation";
import { useStepValidation } from "../../../../../../hooks/useStepValidation";

interface Step4OtherInfoProps {
    data: AgencyOtherInfoStep;
    onChange: (updates: Partial<AgencyOtherInfoStep>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
}

export default function Step4_OtherInfo({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step4OtherInfoProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    const { clientErrors, isValid } = useStepValidation(
        data,
        validateStep4,
        onValidationChange
    );

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        if (onValidationChange && isValid !== prevIsValid.current) {
            onValidationChange(isValid);
            prevIsValid.current = isValid;
        }
    }, [isValid, onValidationChange]);

    const handleInputChange = (
        field: keyof AgencyOtherInfoStep,
        value: any
    ) => {
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
                        <Star className="w-6 h-6 text-primary" />
                        Additional Information
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Optional information to enhance your agency profile
                    </CardDescription>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-600 font-medium">
                            This step is optional but recommended
                        </span>
                    </div>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Online Presence */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Globe className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Online Presence
                            </h3>
                        </div>

                        {/* Website */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="website"
                                className="text-sm font-medium"
                            >
                                Website URL (Optional)
                            </Label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="website"
                                    type="url"
                                    placeholder="https://www.youragency.com"
                                    value={data.website || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "website",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.website
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Your agency's official website or landing page
                            </p>
                            {displayErrors.website && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.website}
                                </p>
                            )}
                        </div>

                        {/* Facebook Page */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="facebook_page"
                                className="text-sm font-medium"
                            >
                                Facebook Page (Optional)
                            </Label>
                            <div className="relative">
                                <Facebook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="facebook_page"
                                    type="url"
                                    placeholder="https://facebook.com/youragency"
                                    value={data.facebook_page || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "facebook_page",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.facebook_page
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Link to your agency's Facebook business page
                            </p>
                            {displayErrors.facebook_page && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.facebook_page}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Pricing Information */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                                <PhilippinePeso className="w-4 h-4 text-green-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Placement Fee Information
                            </h3>
                        </div>

                        {/* Placement Fee */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="placement_fee"
                                className="text-sm font-medium"
                            >
                                Placement Fee (₱) (Optional)
                            </Label>
                            <div className="relative">
                                <PhilippinePeso className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="placement_fee"
                                    type="number"
                                    placeholder="0"
                                    value={data.placement_fee ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "placement_fee",
                                            e.target.value
                                        )
                                    }
                                    onBlur={(e) =>
                                        handleInputChange(
                                            "placement_fee",
                                            e.target.value
                                                ? Number(
                                                      Number(
                                                          e.target.value
                                                      ).toFixed(2)
                                                  )
                                                : null
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.placement_fee
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Standard fee you charge clients for placement
                                services
                            </p>
                            {displayErrors.placement_fee && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.placement_fee}
                                </p>
                            )}
                        </div>

                        {/* Show Fee Publicly */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="show_fee_publicly"
                                    checked={data.show_fee_publicly || false}
                                    onCheckedChange={(checked) =>
                                        handleInputChange(
                                            "show_fee_publicly",
                                            checked
                                        )
                                    }
                                />
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="show_fee_publicly"
                                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                                    >
                                        {data.show_fee_publicly ? (
                                            <Eye className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <EyeOff className="w-4 h-4 text-gray-500" />
                                        )}
                                        Display placement fee publicly
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                        {data.show_fee_publicly
                                            ? "Your placement fee will be visible to potential clients"
                                            : "Your placement fee will be hidden from public view"}
                                    </p>
                                </div>
                            </div>

                            {data.placement_fee && data.show_fee_publicly && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                                            Public Preview:
                                        </span>
                                    </div>
                                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                        "Placement Fee: ₱
                                        {Number(
                                            data.placement_fee
                                        ).toLocaleString()}
                                        "
                                    </p>
                                </div>
                            )}

                            {data.placement_fee && !data.show_fee_publicly && (
                                <div className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            Private:
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                        Your placement fee will only be visible
                                        to you and can be shared with clients
                                        individually.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Alert */}
                    <InfoAlert
                        icon={
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        }
                        colorClass="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        title="✨ Optional Information Benefits:"
                        tips={[
                            "Website and social media links build credibility and trust",
                            "Transparent pricing helps clients make informed decisions",
                            "Public placement fees can attract price-conscious clients",
                            "Private fees allow for negotiation flexibility",
                            "Complete profiles receive more client inquiries",
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
