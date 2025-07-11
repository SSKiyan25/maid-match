import { useState, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Checkbox } from "@/Components/ui/checkbox";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    CheckCircle,
    AlertCircle,
    Calendar,
    UserPlus,
    MapPin,
    EyeOff,
} from "lucide-react";

import { AddressInput, CreateMaidFormData } from "../../utils/types";
import { useStepValidation } from "../../../../../hooks/useStepValidation";
import { validateStep1 } from "../../utils/step1Validation";
import {
    formatPhoneNumber,
    calculatePasswordStrength,
    getPasswordStrengthColor,
    getPasswordStrengthText,
} from "../../../../../utils/formFunctions";

interface Step1AccountProps {
    data: CreateMaidFormData;
    onChange: (updates: Partial<CreateMaidFormData>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
    isEdit?: boolean;
}

export default function Step1_Account({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
    isEdit,
}: Step1AccountProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

    const { clientErrors, isValid } = useStepValidation(
        data,
        (d) => validateStep1(d, isEdit),
        onValidationChange
    );

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        if (onValidationChange && isValid !== prevIsValid.current) {
            onValidationChange(isValid);
            prevIsValid.current = isValid;
        }
    }, [isValid, onValidationChange]);

    const handleUserInputChange = (
        field: keyof CreateMaidFormData["user"],
        value: string
    ) => {
        setHasUserInteracted(true);
        onChange({
            user: {
                ...data.user,
                [field]: value,
            },
        });

        if (field === "password") {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    const handleProfileInputChange = (
        field: keyof CreateMaidFormData["profile"],
        value: string | AddressInput | boolean
    ) => {
        setHasUserInteracted(true);
        onChange({
            profile: {
                ...data.profile,
                [field]: value,
            },
        });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        handleProfileInputChange("phone_number", formatted);
    };

    const getPhoneNumberHelperText = () => {
        return (
            <div className="text-xs text-muted-foreground space-y-1">
                <p>Accepted formats:</p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                    <span>• +639171234567</span>
                    <span>• 09171234567</span>
                </div>
            </div>
        );
    };

    const displayErrors =
        showValidation || hasUserInteracted ? clientErrors : {};

    const passwordsMatch =
        data.user.password &&
        data.user.password_confirmation &&
        data.user.password === data.user.password_confirmation;

    const isPhoneValid =
        !data.profile.phone_number || !displayErrors.phone_number;

    return (
        <div className="max-w-5xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Create Maid Account
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Set up the account and personal information for the new
                        maid
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Account Information Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Mail className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Account Information
                            </h3>
                        </div>

                        {/* Email Field */}
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
                                    placeholder="Enter maid's email address"
                                    value={data.user.email}
                                    onChange={(e) =>
                                        handleUserInputChange(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.email
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    autoComplete="email"
                                />
                            </div>
                            {displayErrors.email && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
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
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={data.user.password}
                                    onChange={(e) =>
                                        handleUserInputChange(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 pr-10 h-11 ${
                                        displayErrors.password
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {data.user.password && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground">
                                            Password strength:
                                        </span>
                                        <span
                                            className={`font-medium ${
                                                passwordStrength < 50
                                                    ? "text-red-500"
                                                    : passwordStrength < 75
                                                    ? "text-yellow-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {getPasswordStrengthText(
                                                passwordStrength
                                            )}
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(
                                                passwordStrength
                                            )}`}
                                            style={{
                                                width: `${passwordStrength}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {displayErrors.password && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
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
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm the password"
                                    value={
                                        data.user.password_confirmation || ""
                                    }
                                    onChange={(e) =>
                                        handleUserInputChange(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 pr-10 h-11 ${
                                        displayErrors.password_confirmation
                                            ? "border-red-500"
                                            : data.user.password_confirmation &&
                                              passwordsMatch
                                            ? "border-green-500"
                                            : ""
                                    }`}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                                {data.user.password_confirmation &&
                                    passwordsMatch && (
                                        <CheckCircle className="absolute right-10 top-3 h-4 w-4 text-green-500" />
                                    )}
                            </div>
                            {data.user.password_confirmation &&
                                !passwordsMatch && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Passwords do not match
                                    </p>
                                )}
                            {displayErrors.password_confirmation && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.password_confirmation}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Personal Information Section */}
                    <div className="space-y-4 pt-6 border-t border-border">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <UserPlus className="w-4 h-4 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Personal Information
                            </h3>
                        </div>

                        {/* Name Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="first_name"
                                    className="text-sm font-medium"
                                >
                                    First Name *
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="first_name"
                                        type="text"
                                        placeholder="Enter first name"
                                        value={data.profile.first_name}
                                        onChange={(e) =>
                                            handleProfileInputChange(
                                                "first_name",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 h-11 ${
                                            displayErrors.first_name
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        autoComplete="given-name"
                                    />
                                </div>
                                {displayErrors.first_name && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.first_name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="last_name"
                                    className="text-sm font-medium"
                                >
                                    Last Name *
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="last_name"
                                        type="text"
                                        placeholder="Enter last name"
                                        value={data.profile.last_name}
                                        onChange={(e) =>
                                            handleProfileInputChange(
                                                "last_name",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 h-11 ${
                                            displayErrors.last_name
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        autoComplete="family-name"
                                    />
                                </div>
                                {displayErrors.last_name && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.last_name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="birth_date"
                                className="text-sm font-medium"
                            >
                                Date of Birth
                            </Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={
                                        data.profile.birth_date
                                            ? data.profile.birth_date.slice(
                                                  0,
                                                  10
                                              )
                                            : ""
                                    }
                                    onChange={(e) =>
                                        handleProfileInputChange(
                                            "birth_date",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.birth_date
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                    max={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Optional - Birth date helps with age
                                verification
                            </p>
                            {displayErrors.birth_date && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.birth_date}
                                </p>
                            )}
                        </div>

                        {/* Phone Number Field */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="phone_number"
                                className="text-sm font-medium"
                            >
                                Phone Number
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone_number"
                                    type="tel"
                                    placeholder="+63 917 123 4567 or 09171234567"
                                    value={data.profile.phone_number || ""}
                                    onChange={handlePhoneChange}
                                    className={`pl-10 h-11 ${
                                        displayErrors.phone_number
                                            ? "border-red-500"
                                            : isPhoneValid &&
                                              data.profile.phone_number
                                            ? "border-green-500"
                                            : ""
                                    }`}
                                    autoComplete="tel"
                                />
                                {isPhoneValid &&
                                    data.profile.phone_number &&
                                    !displayErrors.phone_number && (
                                        <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                                    )}
                            </div>

                            {/* Show helper text when focused or empty */}
                            {(!data.profile.phone_number ||
                                displayErrors.phone_number) &&
                                getPhoneNumberHelperText()}

                            {displayErrors.phone_number && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.phone_number}
                                </p>
                            )}

                            <p className="text-xs text-muted-foreground">
                                Optional - Contact number for employers to reach
                                the maid
                            </p>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center">
                                    <MapPin className="w-3 h-3 text-green-500" />
                                </div>
                                <h4 className="text-base font-medium text-foreground">
                                    Address Information
                                </h4>
                            </div>

                            {/* Street */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="street"
                                    className="text-sm font-medium"
                                >
                                    Street/Purok
                                </Label>
                                <Input
                                    id="street"
                                    type="text"
                                    placeholder="Enter street or purok"
                                    value={data.profile.address?.street || ""}
                                    onChange={(e) =>
                                        handleProfileInputChange("address", {
                                            street: e.target.value,
                                            barangay:
                                                data.profile.address
                                                    ?.barangay || "",
                                            city:
                                                data.profile.address?.city ||
                                                "",
                                            province:
                                                data.profile.address
                                                    ?.province || "",
                                        })
                                    }
                                    className={`h-11 ${
                                        displayErrors.street
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
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
                                    Barangay
                                </Label>
                                <Input
                                    id="barangay"
                                    type="text"
                                    placeholder="Enter barangay"
                                    value={data.profile.address?.barangay || ""}
                                    onChange={(e) =>
                                        handleProfileInputChange("address", {
                                            street:
                                                data.profile.address?.street ||
                                                "",
                                            barangay: e.target.value,
                                            city:
                                                data.profile.address?.city ||
                                                "",
                                            province:
                                                data.profile.address
                                                    ?.province || "",
                                        })
                                    }
                                    className={`h-11 ${
                                        displayErrors.barangay
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {displayErrors.barangay && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.barangay}
                                    </p>
                                )}
                            </div>

                            {/* City */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="city"
                                    className="text-sm font-medium"
                                >
                                    City/Municipality
                                </Label>
                                <Input
                                    id="city"
                                    type="text"
                                    placeholder="Enter city or municipality"
                                    value={data.profile.address?.city || ""}
                                    onChange={(e) =>
                                        handleProfileInputChange("address", {
                                            street:
                                                data.profile.address?.street ||
                                                "",
                                            barangay:
                                                data.profile.address
                                                    ?.barangay || "",
                                            city: e.target.value,
                                            province:
                                                data.profile.address
                                                    ?.province || "",
                                        })
                                    }
                                    className={`h-11 ${
                                        displayErrors.city
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
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
                                    Province
                                </Label>
                                <Input
                                    id="province"
                                    type="text"
                                    placeholder="Enter province"
                                    value={data.profile.address?.province || ""}
                                    onChange={(e) =>
                                        handleProfileInputChange("address", {
                                            street:
                                                data.profile.address?.street ||
                                                "",
                                            barangay:
                                                data.profile.address
                                                    ?.barangay || "",
                                            city:
                                                data.profile.address?.city ||
                                                "",
                                            province: e.target.value,
                                        })
                                    }
                                    className={`h-11 ${
                                        displayErrors.province
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {displayErrors.province && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.province}
                                    </p>
                                )}
                            </div>

                            {/* Privacy Option */}
                            <div className="flex items-center space-x-2 mt-2">
                                <Checkbox
                                    id="is_address_private"
                                    checked={!!data.profile.is_address_private}
                                    onCheckedChange={(checked) =>
                                        handleProfileInputChange(
                                            "is_address_private",
                                            !!checked
                                        )
                                    }
                                />
                                <Label
                                    htmlFor="is_address_private"
                                    className="text-sm flex items-center gap-1 cursor-pointer"
                                >
                                    <EyeOff className="w-3 h-3" />
                                    Keep address private from employers
                                </Label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                When enabled, your full address will only be
                                shared with employers after you accept their job
                                offer.
                            </p>
                        </div>
                    </div>

                    {/* Info Alert */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            This account will be created for the maid with
                            agency management privileges. The maid will be able
                            to log in and manage their own profile later.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
