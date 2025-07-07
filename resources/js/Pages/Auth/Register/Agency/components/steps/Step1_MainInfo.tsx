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
import { Button } from "@/Components/ui/button";
import {
    Building2,
    Mail,
    Lock,
    FileText,
    AlertCircle,
    Calendar,
    Phone,
    Upload,
    Eye,
    EyeOff,
} from "lucide-react";
import { InfoAlert } from "@/Components/Form/InfoAlert";
import { AgencyInfoStep } from "../../utils/types";
import { validateStep1 } from "../../utils/step1Validation";
import { useStepValidation } from "../../../../../../hooks/useStepValidation";

interface Step1MainInfoProps {
    data: AgencyInfoStep & {
        email?: string;
        password?: string;
        password_confirmation?: string;
    };
    onChange: (
        updates: Partial<
            AgencyInfoStep & {
                email?: string;
                password?: string;
                password_confirmation?: string;
            }
        >
    ) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
}

export default function Step1_MainInfo({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step1MainInfoProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

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

    const handleInputChange = (
        field: keyof (AgencyInfoStep & {
            email?: string;
            password?: string;
            password_confirmation?: string;
        }),
        value: any
    ) => {
        setHasUserInteracted(true);
        onChange({ [field]: value });
    };

    const handleFileChange = (
        field: "license_photo_front" | "license_photo_back",
        file: File | null
    ) => {
        setHasUserInteracted(true);
        onChange({ [field]: file });
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
                        <Building2 className="w-6 h-6 text-primary" />
                        Agency Information
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Set up your agency profile and account credentials
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Account Credentials */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Mail className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Account Credentials
                            </h3>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email Address *
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="agency@example.com"
                                    value={data.email || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.email
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            {displayErrors.email && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Password *
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Enter password"
                                        value={data.password || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 pr-10 h-11 ${
                                            displayErrors.password
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-11 px-3"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Minimum 8 characters
                                </p>
                                {displayErrors.password && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-medium"
                                >
                                    Confirm Password *
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password_confirmation"
                                        type={
                                            showPasswordConfirm
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Confirm password"
                                        value={data.password_confirmation || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 pr-10 h-11 ${
                                            displayErrors.password_confirmation
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-11 px-3"
                                        onClick={() =>
                                            setShowPasswordConfirm(
                                                !showPasswordConfirm
                                            )
                                        }
                                    >
                                        {showPasswordConfirm ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                {displayErrors.password_confirmation && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.password_confirmation}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Agency Information */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Agency Details
                            </h3>
                        </div>

                        {/* Agency Name */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                Agency Name *
                            </Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="e.g., Premier Domestic Services Inc."
                                    value={data.name || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.name
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            {displayErrors.name && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.name}
                                </p>
                            )}
                        </div>

                        {/* License Number */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="license_number"
                                className="text-sm font-medium"
                            >
                                License Number (Optional)
                            </Label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="license_number"
                                    type="text"
                                    placeholder="e.g., LIC-2024-001234"
                                    value={data.license_number || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "license_number",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.license_number
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            {displayErrors.license_number && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.license_number}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Agency Description (Optional)
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Describe your agency's services, experience, and what makes you unique..."
                                value={data.description || ""}
                                onChange={(e) =>
                                    handleInputChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                className={`min-h-[120px] ${
                                    displayErrors.description
                                        ? "border-red-500"
                                        : ""
                                }`}
                            />
                            <p className="text-xs text-muted-foreground">
                                Minimum 20 characters if provided
                            </p>
                            <span className="text-xs text-muted-foreground">
                                {data.description?.length || 0} / 2000
                            </span>
                            {displayErrors.description && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.description}
                                </p>
                            )}
                        </div>

                        {/* Established Date */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="established_at"
                                className="text-sm font-medium"
                            >
                                Established Date (Optional)
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="established_at"
                                    type="date"
                                    value={data.established_at || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "established_at",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.established_at
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            {displayErrors.established_at && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.established_at}
                                </p>
                            )}
                        </div>

                        {/* Business Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="business_email"
                                    className="text-sm font-medium"
                                >
                                    Business Email (Optional)
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="business_email"
                                        type="email"
                                        placeholder="info@agency.com"
                                        value={data.business_email || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "business_email",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 h-11 ${
                                            displayErrors.business_email
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {displayErrors.business_email && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.business_email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="business_phone"
                                    className="text-sm font-medium"
                                >
                                    Business Phone (Optional)
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="business_phone"
                                        type="tel"
                                        placeholder="+63 912 345 6789"
                                        value={data.business_phone || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "business_phone",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 h-11 ${
                                            displayErrors.business_phone
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                {displayErrors.business_phone && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.business_phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* License Photos */}
                    <div className="space-y-6 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                                <Upload className="w-4 h-4 text-green-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                License Documents (Optional)
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* License Photo Front */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="license_photo_front"
                                    className="text-sm font-medium"
                                >
                                    License Photo (Front)
                                </Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-2">
                                        <label
                                            htmlFor="license_photo_front"
                                            className="cursor-pointer"
                                        >
                                            <span className="mt-2 block text-sm font-medium text-secondary-foreground">
                                                Upload front of license
                                            </span>
                                            <span className="mt-1 block text-xs text-gray-500">
                                                PNG, JPG up to 5MB
                                            </span>
                                        </label>
                                        <input
                                            id="license_photo_front"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    "license_photo_front",
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                {data.license_photo_front && (
                                    <p className="text-sm text-green-600 break-words">
                                        ✓{" "}
                                        <span className="truncate inline-block max-w-[200px] align-bottom">
                                            {data.license_photo_front.name}
                                        </span>
                                    </p>
                                )}
                                {displayErrors.license_photo_front && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                        <span className="break-words">
                                            {displayErrors.license_photo_front}
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* License Photo Back */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="license_photo_back"
                                    className="text-sm font-medium"
                                >
                                    License Photo (Back)
                                </Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-2">
                                        <label
                                            htmlFor="license_photo_back"
                                            className="cursor-pointer"
                                        >
                                            <span className="mt-2 block text-sm font-medium text-secondary-foreground">
                                                Upload back of license
                                            </span>
                                            <span className="mt-1 block text-xs text-gray-500">
                                                PNG, JPG up to 5MB
                                            </span>
                                        </label>
                                        <input
                                            id="license_photo_back"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleFileChange(
                                                    "license_photo_back",
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                {data.license_photo_back && (
                                    <p className="text-sm text-green-600 break-words">
                                        ✓{" "}
                                        <span className="truncate inline-block max-w-[200px] align-bottom">
                                            {data.license_photo_back.name}
                                        </span>
                                    </p>
                                )}
                                {displayErrors.license_photo_back && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                                        <span className="break-words">
                                            {displayErrors.license_photo_back}
                                        </span>
                                    </p>
                                )}
                                {displayErrors.license_photo_back && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.license_photo_back}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Info Alert */}
                    <InfoAlert
                        icon={
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        }
                        colorClass="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        title="📋 Registration Tips:"
                        tips={[
                            "Use a valid email address for account verification",
                            "Choose a strong password with at least 8 characters",
                            "Provide accurate agency information for credibility",
                            "License documents help build trust with clients",
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
