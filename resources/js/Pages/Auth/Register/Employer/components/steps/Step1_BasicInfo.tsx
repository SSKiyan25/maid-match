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
import { Alert, AlertDescription } from "@/Components/ui/alert";
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Calendar,
} from "lucide-react";

// Import from utils
import { Step1Data, ValidationResult } from "../../utils/types";
import {
    validateStep1,
    validateEmail,
    validatePassword,
    validateName,
    validatePhoneNumber,
} from "../../utils/step1Validation";
import {
    formatPhoneNumber,
    calculatePasswordStrength,
    getPasswordStrengthColor,
    getPasswordStrengthText,
} from "../../utils/phoneUtils";

interface Step1BasicInfoProps {
    data: Step1Data;
    onChange: (updates: Partial<Step1Data>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
}

export default function Step1_BasicInfo({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step1BasicInfoProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>(
        {}
    );

    const initialRender = useRef(true);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false;
            return;
        }
        if (!hasUserInteracted) return;

        const validation = validateStep1(data);
        setClientErrors(validation.errors);

        // Only call onValidationChange if validity changed
        if (onValidationChange && validation.isValid !== prevIsValid.current) {
            onValidationChange(validation.isValid);
            prevIsValid.current = validation.isValid;
        }
    }, [data, onValidationChange, hasUserInteracted]);

    const handleInputChange = (field: keyof Step1Data, value: string) => {
        // Mark that user has interacted with the form
        setHasUserInteracted(true);

        onChange({ [field]: value });

        if (field === "password") {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        // Only do real-time validation if user has already interacted
        if (hasUserInteracted) {
            const newErrors = { ...clientErrors };

            switch (field) {
                case "email":
                    const emailValidation = validateEmail(value);
                    if (!emailValidation.isValid && emailValidation.error) {
                        newErrors.email = emailValidation.error;
                    } else {
                        delete newErrors.email;
                    }
                    break;

                case "password":
                    const passwordValidation = validatePassword(value);
                    if (
                        !passwordValidation.isValid &&
                        passwordValidation.error
                    ) {
                        newErrors.password = passwordValidation.error;
                    } else {
                        delete newErrors.password;
                    }
                    break;

                case "password_confirmation":
                    if (data.password !== value) {
                        newErrors.password_confirmation =
                            "Passwords do not match";
                    } else {
                        delete newErrors.password_confirmation;
                    }
                    break;

                case "first_name":
                    const firstNameValidation = validateName(
                        value,
                        "First name"
                    );
                    if (
                        !firstNameValidation.isValid &&
                        firstNameValidation.error
                    ) {
                        newErrors.first_name = firstNameValidation.error;
                    } else {
                        delete newErrors.first_name;
                    }
                    break;

                case "last_name":
                    const lastNameValidation = validateName(value, "Last name");
                    if (
                        !lastNameValidation.isValid &&
                        lastNameValidation.error
                    ) {
                        newErrors.last_name = lastNameValidation.error;
                    } else {
                        delete newErrors.last_name;
                    }
                    break;

                case "phone_number":
                    const phoneValidation = validatePhoneNumber(value);
                    if (!phoneValidation.isValid && phoneValidation.error) {
                        newErrors.phone_number = phoneValidation.error;
                    } else {
                        delete newErrors.phone_number;
                    }
                    break;
            }

            setClientErrors(newErrors);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        handleInputChange("phone_number", formatted);
    };

    const getPhoneNumberHelperText = () => {
        return (
            <div className="text-xs text-muted-foreground space-y-1">
                <p>Accepted formats:</p>
                <div className="grid grid-cols-2 gap-1 text-xs">
                    <span>• +639171234567</span>
                    <span>• 09171234567</span>
                    <span>• +6329876543</span>
                    <span>• 029876543</span>
                </div>
            </div>
        );
    };

    // Use client errors if available, otherwise use server errors
    const displayErrors =
        showValidation && Object.keys(clientErrors).length > 0
            ? clientErrors
            : {};

    const passwordsMatch =
        data.password &&
        data.password_confirmation &&
        data.password === data.password_confirmation;

    const isPhoneValid = !data.phone_number || !displayErrors.phone_number;

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Create Your Account
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Let's start with your basic information to create your
                        employer account
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
                                    placeholder="Enter your email address"
                                    value={data.email ?? ""}
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
                                    value={data.password ?? ""}
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
                            {data.password && (
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
                                    placeholder="Confirm your password"
                                    value={data.password_confirmation ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 pr-10 h-11 ${
                                        displayErrors.password_confirmation
                                            ? "border-red-500"
                                            : data.password_confirmation &&
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
                                {data.password_confirmation &&
                                    passwordsMatch && (
                                        <CheckCircle className="absolute right-10 top-3 h-4 w-4 text-green-500" />
                                    )}
                            </div>
                            {data.password_confirmation && !passwordsMatch && (
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
                                <User className="w-4 h-4 text-blue-500" />
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
                                        placeholder="Enter your first name"
                                        value={data.first_name ?? ""}
                                        onChange={(e) =>
                                            handleInputChange(
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
                                        placeholder="Enter your last name"
                                        value={data.last_name ?? ""}
                                        onChange={(e) =>
                                            handleInputChange(
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
                                    value={data.birth_date ?? ""}
                                    onChange={(e) =>
                                        handleInputChange(
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
                                Optional - You can fill this in later if you
                                prefer.
                            </p>
                            {displayErrors.birth_date && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.birth_date}
                                </p>
                            )}
                        </div>

                        {/* Phone Number Field with Philippine Validation */}
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
                                    value={data.phone_number ?? ""}
                                    onChange={handlePhoneChange}
                                    className={`pl-10 h-11 ${
                                        displayErrors.phone_number
                                            ? "border-red-500"
                                            : isPhoneValid && data.phone_number
                                            ? "border-green-500"
                                            : ""
                                    }`}
                                    autoComplete="tel"
                                />
                                {isPhoneValid &&
                                    data.phone_number &&
                                    !displayErrors.phone_number && (
                                        <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                                    )}
                            </div>

                            {/* Show helper text when focused or empty */}
                            {(!data.phone_number ||
                                displayErrors.phone_number) &&
                                getPhoneNumberHelperText()}

                            {displayErrors.phone_number && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.phone_number}
                                </p>
                            )}

                            <p className="text-xs text-muted-foreground">
                                Optional - You can fill this in later if you
                                prefer. It helps household helpers contact you.
                            </p>
                        </div>
                    </div>

                    {/* Info Alert */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            Your personal information is secure and will only be
                            shared with verified household helpers and agencies.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
