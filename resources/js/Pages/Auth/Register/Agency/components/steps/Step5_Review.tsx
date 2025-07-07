import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    CheckCircle,
    AlertCircle,
    Building2,
    User,
    MapPin,
    Globe,
    FileText,
    Eye,
    EyeOff,
    Edit,
    Loader2,
} from "lucide-react";
import { InfoAlert } from "@/Components/Form/InfoAlert";
import {
    AgencyInfoStep,
    AgencyUserStep,
    AgencyContactPerson,
    AgencyAddressStep,
    AgencyOtherInfoStep,
} from "../../utils/types";

interface Step5ReviewProps {
    step1Data: AgencyInfoStep & AgencyUserStep;
    step2Data: AgencyContactPerson;
    step3Data: AgencyAddressStep;
    step4Data: AgencyOtherInfoStep;
    onEditStep: (step: number) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    errors: Record<string, string>;
}

export default function Step5_Review({
    step1Data,
    step2Data,
    step3Data,
    step4Data,
    onEditStep,
    onSubmit,
    isSubmitting,
    errors,
}: Step5ReviewProps) {
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        // Validate required data
        const step1Valid = !!(
            step1Data.email &&
            step1Data.password &&
            step1Data.name &&
            step1Data.name.length >= 3
        );

        const step2Valid = !!(
            step2Data.name &&
            step2Data.phone &&
            step2Data.name.length >= 2
        );

        const step3Valid = !!(
            step3Data.street &&
            step3Data.barangay &&
            step3Data.city &&
            step3Data.province
        );

        setIsValid(step1Valid && step2Valid && step3Valid);
    }, [step1Data, step2Data, step3Data]);

    const formatAddress = (address: AgencyAddressStep): string => {
        return [
            address.street,
            address.barangay,
            address.city,
            address.province,
        ]
            .filter(Boolean)
            .join(", ");
    };

    const formatDate = (dateString?: string): string => {
        if (!dateString) return "Not specified";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className="w-full mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                        <CheckCircle className="w-6 h-6 text-primary" />
                        Review & Submit
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Review your agency information before submitting your
                        registration
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Step 1: Agency Information & Credentials */}
                    <Card className="border-2 border-primary/20">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Building2 className="w-4 h-4 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">
                                        Agency Information
                                    </CardTitle>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEditStep(1)}
                                    className="gap-2"
                                >
                                    <Edit className="w-3 h-3" />
                                    Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="text-base">
                                        {step1Data.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Agency Name
                                    </p>
                                    <p className="text-base font-semibold">
                                        {step1Data.name}
                                    </p>
                                </div>
                            </div>

                            {step1Data.license_number && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        License Number
                                    </p>
                                    <p className="text-base">
                                        {step1Data.license_number}
                                    </p>
                                </div>
                            )}

                            {step1Data.description && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Description
                                    </p>
                                    <p className="text-base">
                                        {step1Data.description}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {step1Data.established_at && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Established
                                        </p>
                                        <p className="text-base">
                                            {formatDate(
                                                step1Data.established_at
                                            )}
                                        </p>
                                    </div>
                                )}

                                {step1Data.business_email && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Business Email
                                        </p>
                                        <p className="text-base">
                                            {step1Data.business_email}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {step1Data.business_phone && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Business Phone
                                    </p>
                                    <p className="text-base">
                                        {step1Data.business_phone}
                                    </p>
                                </div>
                            )}

                            {/* License Photos */}
                            {(step1Data.license_photo_front ||
                                step1Data.license_photo_back) && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-2">
                                        License Documents
                                    </p>
                                    <div className="flex gap-2">
                                        {step1Data.license_photo_front && (
                                            <Badge
                                                variant="secondary"
                                                className="gap-1"
                                            >
                                                <FileText className="w-3 h-3" />
                                                Front:{" "}
                                                {
                                                    step1Data
                                                        .license_photo_front
                                                        .name
                                                }
                                            </Badge>
                                        )}
                                        {step1Data.license_photo_back && (
                                            <Badge
                                                variant="secondary"
                                                className="gap-1"
                                            >
                                                <FileText className="w-3 h-3" />
                                                Back:{" "}
                                                {
                                                    step1Data.license_photo_back
                                                        .name
                                                }
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Step 2: Contact Person */}
                    <Card className="border-2 border-blue-500/20">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center">
                                        <User className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <CardTitle className="text-lg">
                                        Contact Person
                                    </CardTitle>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEditStep(2)}
                                    className="gap-2"
                                >
                                    <Edit className="w-3 h-3" />
                                    Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Name
                                    </p>
                                    <p className="text-base font-semibold">
                                        {step2Data.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Phone
                                    </p>
                                    <p className="text-base">
                                        {step2Data.phone}
                                    </p>
                                </div>
                            </div>

                            {step2Data.email && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="text-base">
                                        {step2Data.email}
                                    </p>
                                </div>
                            )}

                            {step2Data.facebook && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Facebook
                                    </p>
                                    <p className="text-base break-all">
                                        {step2Data.facebook}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Step 3: Address */}
                    <Card className="border-2 border-green-500/20">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-green-500" />
                                    </div>
                                    <CardTitle className="text-lg">
                                        Address
                                    </CardTitle>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEditStep(3)}
                                    className="gap-2"
                                >
                                    <Edit className="w-3 h-3" />
                                    Edit
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Complete Address
                                </p>
                                <p className="text-base">
                                    {formatAddress(step3Data)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step 4: Other Information (Optional) */}
                    {(step4Data.website ||
                        step4Data.facebook_page ||
                        step4Data.placement_fee !== undefined) && (
                        <Card className="border-2 border-purple-500/20">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center">
                                            <Globe className="w-4 h-4 text-purple-500" />
                                        </div>
                                        <CardTitle className="text-lg">
                                            Additional Information
                                        </CardTitle>
                                        <Badge variant="secondary">
                                            Optional
                                        </Badge>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEditStep(4)}
                                        className="gap-2"
                                    >
                                        <Edit className="w-3 h-3" />
                                        Edit
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {step4Data.website && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Website
                                        </p>
                                        <p className="text-base break-all">
                                            {step4Data.website}
                                        </p>
                                    </div>
                                )}

                                {step4Data.facebook_page && (
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Facebook Page
                                        </p>
                                        <p className="text-base break-all">
                                            {step4Data.facebook_page}
                                        </p>
                                    </div>
                                )}

                                {step4Data.placement_fee !== undefined &&
                                    step4Data.placement_fee !== null && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Placement Fee
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-base font-semibold">
                                                    ₱
                                                    {Number(
                                                        step4Data.placement_fee
                                                    ).toLocaleString()}
                                                </p>
                                                {step4Data.show_fee_publicly ? (
                                                    <Badge
                                                        variant="default"
                                                        className="gap-1"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        Public
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="secondary"
                                                        className="gap-1"
                                                    >
                                                        <EyeOff className="w-3 h-3" />
                                                        Private
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Validation Status */}
                    <div className="space-y-4">
                        {isValid ? (
                            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <span className="text-green-800 dark:text-green-200 font-medium">
                                    All required information is complete and
                                    ready for submission
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <span className="text-red-800 dark:text-red-200 font-medium">
                                    Please complete all required fields before
                                    submitting
                                </span>
                            </div>
                        )}

                        {Object.keys(errors).length > 0 && (
                            <div className="space-y-2">
                                {Object.entries(errors).map(
                                    ([field, error]) => (
                                        <div
                                            key={field}
                                            className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                                        >
                                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                            <span className="text-red-800 dark:text-red-200 text-sm">
                                                {error}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-border">
                        <Button
                            onClick={onSubmit}
                            disabled={!isValid || isSubmitting}
                            className="w-full h-12 text-lg font-semibold"
                            size="lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Submitting Registration...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Submit Registration
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Info Alert */}
                    <InfoAlert
                        icon={
                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        }
                        colorClass="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        title="📝 Before You Submit:"
                        tips={[
                            "Double-check all information for accuracy",
                            "Ensure contact details are current and reachable",
                            "License documents will be reviewed by our team",
                            "You'll receive a confirmation email after submission",
                            "Account activation may take 24-48 hours",
                        ]}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
