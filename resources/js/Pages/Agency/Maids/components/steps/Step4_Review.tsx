import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Separator } from "@/Components/ui/separator";
import {
    CheckCircle,
    Edit,
    User,
    MapPin,
    Phone,
    Star,
    PhilippinePeso,
    File,
    FileCheck,
    AlertCircle,
    Calendar,
    ShieldCheck,
} from "lucide-react";
import { CreateMaidFormData } from "../../utils/types";
import { formatDate } from "@/utils/formFunctions";

interface Step4ReviewProps {
    formData: CreateMaidFormData;
    onEdit: (step: number) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    errors: Record<string, string>;
    submissionErrors: Record<string, string>;
    isEditMode?: boolean;
}

const maritalStatusLabels: Record<string, string> = {
    single: "Single",
    married: "Married",
    divorced: "Divorced",
    widowed: "Widowed",
};

const accommodationLabels: Record<string, string> = {
    live_in: "Live-in",
    live_out: "Live-out",
    either: "Either",
};

const statusLabels: Record<string, string> = {
    available: "Available",
    employed: "Employed",
    unavailable: "Unavailable",
};

const documentTypeLabels: Record<string, string> = {
    id: "Identification",
    passport: "Passport",
    certificate: "Certificate",
    resume: "Resume/CV",
    reference: "Reference Letter",
    medical: "Medical Certificate",
    other: "Other Document",
};

export default function Step4_Review({
    formData,
    onEdit,
    onSubmit,
    isSubmitting,
    errors,
    submissionErrors,
    isEditMode = false,
}: Step4ReviewProps) {
    const { user, profile, maid, agency_maid, documents } = formData;

    // Helper to display array as comma-separated string
    const displayList = (arr?: string[]) =>
        arr && arr.length > 0 ? (
            arr.join(", ")
        ) : (
            <span className="text-muted-foreground">None</span>
        );

    // Helper for language display
    const displayLanguages = (langs?: string[]) =>
        langs && langs.length > 0 ? (
            langs.map((lang) => (
                <Badge key={lang} variant="outline" className="mr-1">
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </Badge>
            ))
        ) : (
            <span className="text-muted-foreground">None</span>
        );

    const InfoRowCompact = ({
        label,
        value,
    }: {
        label: string;
        value?: React.ReactNode;
    }) => {
        return (
            <div className="flex flex-col">
                <span className="text-xs font-medium text-secondary">
                    {label}
                </span>
                <span className="mt-0.5">
                    {value !== undefined && value !== null && value !== "" ? (
                        value
                    ) : (
                        <span className="text-muted-foreground text-sm">
                            None
                        </span>
                    )}
                </span>
            </div>
        );
    };

    return (
        <div className="w-full mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        {isEditMode ? "Review Changes" : "Review Maid Profile"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {isEditMode
                            ? "Review your changes before saving"
                            : "Please review all information before submitting the maid profile"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                        {/* Contact Information */}
                        <div>
                            <h5 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                                <User className="w-3.5 h-3.5 mr-1.5 text-blue-500/70" />
                                Contact Details
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <span className="text-xs font-medium text-secondary block">
                                        Email:
                                    </span>
                                    <span className="text-sm">
                                        {user.email}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-secondary block">
                                        Name:
                                    </span>
                                    <span className="text-sm">
                                        {profile.first_name} {profile.last_name}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-secondary block">
                                        Phone:
                                    </span>
                                    <span className="text-sm">
                                        {profile.phone_number ? (
                                            <span className="flex items-center">
                                                <Phone className="w-3 h-3 mr-1.5 text-blue-500/70" />
                                                {profile.phone_number}
                                                {profile.is_phone_private && (
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-2 text-xs"
                                                    >
                                                        Private
                                                    </Badge>
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-medium text-secondary block">
                                        Birth Date:
                                    </span>
                                    <span className="text-sm">
                                        {profile.birth_date ? (
                                            <span className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1.5 text-blue-500/70" />
                                                {formatDate(profile.birth_date)}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                None
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        {profile.address && (
                            <div className="mt-4 pt-4 border-t border-border/60">
                                <h5 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-green-500/70" />
                                    Address Information
                                    {profile.is_address_private && (
                                        <Badge
                                            variant="outline"
                                            className="ml-2 text-xs"
                                        >
                                            Private
                                        </Badge>
                                    )}
                                </h5>
                                <div className="rounded-md bg-background/60 p-3 border border-border/40">
                                    <div className="space-y-1">
                                        {profile.address.street && (
                                            <div className="text-sm">
                                                <span className="text-xs font-medium text-secondary">
                                                    Street/Purok:
                                                </span>{" "}
                                                {profile.address.street}
                                            </div>
                                        )}
                                        {profile.address.barangay && (
                                            <div className="text-sm">
                                                <span className="text-xs font-medium text-secondary">
                                                    Barangay:
                                                </span>{" "}
                                                {profile.address.barangay}
                                            </div>
                                        )}
                                        <div className="text-sm flex items-center">
                                            {profile.address.city && (
                                                <span>
                                                    <span className="text-xs font-medium text-secondary">
                                                        City:
                                                    </span>{" "}
                                                    {profile.address.city}
                                                </span>
                                            )}
                                            {profile.address.city &&
                                                profile.address.province && (
                                                    <span className="mx-1">
                                                        ,
                                                    </span>
                                                )}
                                            {profile.address.province && (
                                                <span>
                                                    <span className="text-xs font-medium text-secondary">
                                                        Province:
                                                    </span>{" "}
                                                    {profile.address.province}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Step 2 - Maid & Agency Info */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Star className="w-4 h-4 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    Maid & Agency Information
                                </h3>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(2)}
                                className="text-primary hover:text-primary/80 hover:bg-primary/10"
                            >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                            </Button>
                        </div>

                        <div className="rounded-lg overflow-hidden border border-border">
                            {/* Maid Details Card */}
                            <div className="bg-card">
                                <div className="bg-primary/5 px-4 py-2 border-b border-border">
                                    <h4 className="font-medium text-primary">
                                        Maid Details
                                    </h4>
                                </div>

                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Left Column */}
                                    <div className="space-y-3">
                                        <div className="rounded-md bg-muted/50 p-3">
                                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                                Personal Information
                                            </h5>
                                            <div className="space-y-2">
                                                <InfoRowCompact
                                                    label="Nationality"
                                                    value={maid.nationality}
                                                />
                                                <InfoRowCompact
                                                    label="Marital Status"
                                                    value={
                                                        maid.marital_status
                                                            ? maritalStatusLabels[
                                                                  maid
                                                                      .marital_status
                                                              ]
                                                            : undefined
                                                    }
                                                />
                                                <InfoRowCompact
                                                    label="Has Children"
                                                    value={
                                                        <Badge
                                                            variant={
                                                                maid.has_children
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            className="font-normal"
                                                        >
                                                            {maid.has_children
                                                                ? "Yes"
                                                                : "No"}
                                                        </Badge>
                                                    }
                                                />
                                                <InfoRowCompact
                                                    label="Languages"
                                                    value={displayLanguages(
                                                        maid.languages
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-md bg-muted/50 p-3">
                                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                                Contact Information
                                            </h5>
                                            <div className="space-y-2">
                                                <InfoRowCompact
                                                    label="Emergency Contact"
                                                    value={
                                                        <>
                                                            <div>
                                                                {maid.emergency_contact_name ||
                                                                    "-"}
                                                            </div>
                                                            {maid.emergency_contact_phone && (
                                                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                                                    <Phone className="inline w-3 h-3 mr-1" />
                                                                    {
                                                                        maid.emergency_contact_phone
                                                                    }
                                                                </div>
                                                            )}
                                                        </>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-3">
                                        <div className="rounded-md bg-muted/50 p-3">
                                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                                Employment Information
                                            </h5>
                                            <div className="space-y-2">
                                                <InfoRowCompact
                                                    label="Years Experience"
                                                    value={
                                                        maid.years_experience !==
                                                            null &&
                                                        maid.years_experience !==
                                                            undefined
                                                            ? `${
                                                                  maid.years_experience
                                                              } ${
                                                                  Number(
                                                                      maid.years_experience
                                                                  ) === 1
                                                                      ? "year"
                                                                      : "years"
                                                              }`
                                                            : undefined
                                                    }
                                                />
                                                <InfoRowCompact
                                                    label="Expected Salary"
                                                    value={
                                                        maid.expected_salary ? (
                                                            <div className="flex items-center font-medium text-foreground">
                                                                <PhilippinePeso className="inline w-3.5 h-3.5 mr-1 text-primary/70" />
                                                                {Number(
                                                                    maid.expected_salary
                                                                ).toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    }
                                                                )}
                                                            </div>
                                                        ) : undefined
                                                    }
                                                />
                                                <InfoRowCompact
                                                    label="Status"
                                                    value={
                                                        maid.status && (
                                                            <Badge
                                                                variant={
                                                                    maid.status ===
                                                                    "available"
                                                                        ? "default"
                                                                        : maid.status ===
                                                                          "employed"
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                            >
                                                                {
                                                                    statusLabels[
                                                                        maid
                                                                            .status
                                                                    ]
                                                                }
                                                            </Badge>
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="rounded-md bg-muted/50 p-3">
                                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                                Preferences
                                            </h5>
                                            <div className="space-y-2">
                                                <InfoRowCompact
                                                    label="Accommodation"
                                                    value={
                                                        maid.preferred_accommodation
                                                            ? accommodationLabels[
                                                                  maid
                                                                      .preferred_accommodation
                                                              ]
                                                            : undefined
                                                    }
                                                />
                                                <InfoRowCompact
                                                    label="Start Date"
                                                    value={
                                                        maid.earliest_start_date
                                                            ? formatDate(
                                                                  maid.earliest_start_date
                                                              )
                                                            : undefined
                                                    }
                                                />
                                                <InfoRowCompact
                                                    label="Willing to Relocate"
                                                    value={
                                                        <Badge
                                                            variant={
                                                                maid.is_willing_to_relocate
                                                                    ? "default"
                                                                    : "outline"
                                                            }
                                                            className="font-normal"
                                                        >
                                                            {maid.is_willing_to_relocate
                                                                ? "Yes"
                                                                : "No"}
                                                        </Badge>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills & Bio - Full Width */}
                                <div className="p-4 border-t border-border">
                                    <div className="rounded-md bg-muted/50 p-3">
                                        <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                            Skills & Description
                                        </h5>
                                        <div className="space-y-3">
                                            <div>
                                                <div className="text-sm font-medium text-secondary">
                                                    Skills:
                                                </div>
                                                <div className="mt-1 flex flex-wrap gap-1">
                                                    {maid.skills &&
                                                    maid.skills.length > 0 ? (
                                                        maid.skills.map(
                                                            (skill) => (
                                                                <Badge
                                                                    key={skill}
                                                                    variant="outline"
                                                                    className="font-normal"
                                                                >
                                                                    {skill}
                                                                </Badge>
                                                            )
                                                        )
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">
                                                            None specified
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-sm font-medium text-secondary">
                                                    Bio:
                                                </div>
                                                <div className="mt-1 text-sm bg-background/50 p-2 rounded border border-border/50">
                                                    {maid.bio || (
                                                        <span className="text-muted-foreground">
                                                            No bio provided
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Agency Details Card */}
                            <div className="bg-card border-t border-border">
                                <div className="bg-primary/5 px-4 py-2 border-b border-border">
                                    <h4 className="font-medium text-primary">
                                        Agency Details
                                    </h4>
                                </div>

                                <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Left Column */}
                                        <div className="rounded-md bg-muted/50 p-3">
                                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                                Service Information
                                            </h5>
                                            <div className="space-y-2">
                                                <InfoRowCompact
                                                    label="Agency Fee"
                                                    value={
                                                        agency_maid.agency_fee ? (
                                                            <div className="flex items-center font-medium text-foreground">
                                                                <PhilippinePeso className="inline w-3.5 h-3.5 mr-1 text-primary/70" />
                                                                {Number(
                                                                    agency_maid.agency_fee
                                                                ).toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    }
                                                                )}
                                                            </div>
                                                        ) : undefined
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="rounded-md bg-muted/50 p-3">
                                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                                Qualifications
                                            </h5>
                                            <div className="flex flex-wrap gap-3">
                                                <div className="flex items-center">
                                                    <Badge
                                                        variant={
                                                            agency_maid.is_premium
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className="font-normal"
                                                    >
                                                        {agency_maid.is_premium
                                                            ? "Premium Listing"
                                                            : "Standard Listing"}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center">
                                                    <Badge
                                                        variant={
                                                            agency_maid.is_trained
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        className="font-normal"
                                                    >
                                                        {agency_maid.is_trained
                                                            ? "Agency Trained"
                                                            : "Not Agency Trained"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Agency Notes */}
                                    {agency_maid.agency_notes && (
                                        <div className="mt-4 rounded-md bg-muted/50 p-3">
                                            <h5 className="text-sm font-medium text-muted-foreground mb-2">
                                                Agency Notes
                                            </h5>
                                            <div className="text-sm bg-background/50 p-2 rounded border border-border/50">
                                                {agency_maid.agency_notes}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Step 3 - Documents */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-yellow-500/10 rounded-full flex items-center justify-center">
                                    <File className="w-4 h-4 text-yellow-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    Documents
                                </h3>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(3)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                            </Button>
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                            {documents && documents.length > 0 ? (
                                <div className="space-y-3">
                                    {documents.map((doc, idx) => (
                                        <div
                                            key={idx}
                                            className="rounded-md border border-border/40 bg-background/70 p-3 flex flex-col gap-2"
                                        >
                                            <div className="flex flex-wrap items-center gap-2">
                                                {doc.type && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="flex items-center gap-1"
                                                    >
                                                        <FileCheck className="w-3 h-3" />
                                                        {documentTypeLabels[
                                                            doc.type
                                                        ] || doc.type}
                                                    </Badge>
                                                )}
                                                <span className="font-medium break-words">
                                                    {doc.title}
                                                </span>
                                            </div>
                                            {doc.file && (
                                                <div className="text-xs text-muted-foreground break-all">
                                                    <span className="font-medium">
                                                        File:
                                                    </span>{" "}
                                                    {doc.file.name}
                                                </div>
                                            )}
                                            {doc.description && (
                                                <div className="text-xs text-muted-foreground break-words">
                                                    <span className="font-medium">
                                                        Description:
                                                    </span>{" "}
                                                    {doc.description}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground text-sm">
                                    No documents uploaded.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submission Alerts */}
                    <div className="space-y-4 pt-6 border-t border-border">
                        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <AlertDescription className="text-green-800 dark:text-green-200">
                                <strong>
                                    Ready to {isEditMode ? "Save" : "Submit"}:
                                </strong>{" "}
                                Your maid profile looks great!
                                {isEditMode
                                    ? " Your changes will be saved and the profile updated."
                                    : " After submitting, the maid will be added to your agency's roster."}
                            </AlertDescription>
                        </Alert>

                        {Object.keys(submissionErrors).length > 0 && (
                            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <AlertDescription className="text-red-800 dark:text-red-200">
                                    <strong>
                                        Please fix the following errors:
                                    </strong>
                                    <ul className="mt-2 list-disc list-inside">
                                        {Object.entries(submissionErrors).map(
                                            ([field, error]) => (
                                                <li
                                                    key={field}
                                                    className="text-sm"
                                                >
                                                    {error}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertDescription className="text-blue-800 dark:text-blue-200">
                                <strong>What happens next:</strong>
                                <ul className="mt-2 text-sm space-y-1">
                                    {isEditMode ? (
                                        <>
                                            <li>
                                                • Your changes will be saved
                                                immediately
                                            </li>
                                            <li>
                                                • The updated profile will be
                                                visible to employers
                                            </li>
                                            <li>
                                                • You can continue to edit
                                                anytime from your dashboard
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                • The maid profile will be added
                                                to your agency's roster
                                            </li>
                                            <li>
                                                • You can manage and update the
                                                profile anytime
                                            </li>
                                            <li>
                                                • Verified documents increase
                                                trust and visibility
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center pt-6">
                        <Button
                            onClick={onSubmit}
                            disabled={
                                isSubmitting || Object.keys(errors).length > 0
                            }
                            className="px-8 py-3 text-lg font-medium"
                            size="lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                    {isEditMode
                                        ? "Saving Changes..."
                                        : "Submitting..."}
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    {isEditMode
                                        ? "Save Changes"
                                        : "Submit Maid Profile"}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
