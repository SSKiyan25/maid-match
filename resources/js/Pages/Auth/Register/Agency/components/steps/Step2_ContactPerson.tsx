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
import { User, Phone, Mail, Facebook, AlertCircle } from "lucide-react";
import { InfoAlert } from "@/Components/Form/InfoAlert";
import { AgencyContactPerson } from "../../utils/types";
import { validateStep2 } from "../../utils/step2Validation";
import { useStepValidation } from "../../../../../../hooks/useStepValidation";

interface Step2ContactPersonProps {
    data: AgencyContactPerson;
    onChange: (updates: Partial<AgencyContactPerson>) => void;
    errors: Record<string, string>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
}

export default function Step2_ContactPerson({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step2ContactPersonProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);

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

    const handleInputChange = (
        field: keyof AgencyContactPerson,
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
                        <User className="w-6 h-6 text-primary" />
                        "Contact Person
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Provide contact details for client communication
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Primary Contact Information
                            </h3>
                        </div>

                        {/* Contact Name */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium"
                            >
                                Contact Person Name *
                            </Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="e.g., Maria Santos"
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
                            <p className="text-xs text-muted-foreground">
                                This person will be the main point of contact
                                for clients
                            </p>
                            {displayErrors.name && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.name}
                                </p>
                            )}
                        </div>

                        {/* Contact Phone */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="phone"
                                className="text-sm font-medium"
                            >
                                Phone Number *
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+63 912 345 6789"
                                    value={data.phone || ""}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                    className={`pl-10 h-11 ${
                                        displayErrors.phone
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Include country code for international numbers
                            </p>
                            {displayErrors.phone && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {displayErrors.phone}
                                </p>
                            )}
                        </div>

                        {/* Optional Contact Information */}
                        <div className="space-y-6 pt-6 border-t border-border">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    Additional Contact Options (Optional)
                                </h3>
                            </div>

                            {/* Contact Email */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email Address (Optional)
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="contact@agency.com"
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
                                <p className="text-xs text-muted-foreground">
                                    Alternative email for client communication
                                </p>
                                {displayErrors.email && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.email}
                                    </p>
                                )}
                            </div>

                            {/* Facebook Profile */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="facebook"
                                    className="text-sm font-medium"
                                >
                                    Facebook Profile/Page (Optional)
                                </Label>
                                <div className="relative">
                                    <Facebook className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="facebook"
                                        type="url"
                                        placeholder="https://facebook.com/your-profile"
                                        value={data.facebook || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "facebook",
                                                e.target.value
                                            )
                                        }
                                        className={`pl-10 h-11 ${
                                            displayErrors.facebook
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Link to Facebook profile or business page
                                </p>
                                {displayErrors.facebook && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {displayErrors.facebook}
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
                        title="👤 Contact Person Guidelines:"
                        tips={[
                            "Provide accurate contact information for reliable communication",
                            "This person should be available to respond to client inquiries",
                            "Phone number is required - email and Facebook are optional",
                            "Additional contact methods help build trust with potential clients",
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
