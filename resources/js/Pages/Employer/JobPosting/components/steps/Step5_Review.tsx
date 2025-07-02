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
    Briefcase,
    MapPin,
    Gift,
    Camera,
    AlertCircle,
    Info,
    Clock,
    Star,
    Eye,
    EyeOff,
    Utensils,
    Bath,
    PhilippinePeso,
} from "lucide-react";

import { JobPostingForm, JobLocation, JobBonus } from "../../utils/types";

interface PhotoData {
    file?: File;
    url?: string;
    caption?: string;
    type: string;
    sort_order?: number;
    is_primary?: boolean;
}

interface Step5ReviewProps {
    formData: JobPostingForm;
    location: JobLocation;
    bonuses: JobBonus[];
    photos: PhotoData[];
    onEdit: (step: number) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    errors: Record<string, string>;
    submissionErrors: Record<string, string>;
    isEditMode?: boolean;
}

export default function Step5_Review({
    formData,
    location,
    bonuses,
    photos,
    onEdit,
    onSubmit,
    isSubmitting,
    errors,
    submissionErrors,
    isEditMode = false,
}: Step5ReviewProps) {
    console.log("Review Step Form Data:", formData);
    const workTypeLabels: Record<string, string> = {
        cleaning: "House Cleaning",
        cooking: "Cooking",
        childcare: "Childcare",
        eldercare: "Elder Care",
        laundry: "Laundry",
        gardening: "Gardening",
        petcare: "Pet Care",
        general: "General Housework",
    };

    const accommodationLabels: Record<string, string> = {
        live_in: "Live-in",
        live_out: "Live-out",
        flexible: "Flexible",
    };

    const dayOffLabels: Record<string, string> = {
        weekly: "Weekly",
        monthly: "Monthly",
        flexible: "Flexible",
        none: "No Fixed Day Off",
    };

    const languageLabels: Record<string, string> = {
        filipino: "Filipino",
        english: "English",
        tagalog: "Tagalog",
        cebuano: "Cebuano",
        ilocano: "Ilocano",
        bisaya: "Bisaya",
    };

    const bonusTypeLabels: Record<string, string> = {
        monetary: "Monetary Bonus",
        "13th_month": "13th Month Pay",
        performance: "Performance Bonus",
        holiday: "Holiday Bonus",
        loyalty: "Loyalty Bonus",
        completion: "Task Completion Bonus",
        referral: "Referral Bonus",
        overtime: "Overtime Pay",
        other: "Other",
    };

    const photoTypeLabels: Record<string, string> = {
        interior: "Interior",
        exterior: "Exterior",
        room: "Room/Workspace",
        kitchen: "Kitchen",
        bathroom: "Bathroom",
        garden: "Garden/Outdoor",
        general: "General",
    };

    const formatAddress = () => {
        const parts = [location.brgy, location.city, location.province].filter(
            Boolean
        );
        return parts.join(", ");
    };

    const formatSalary = () => {
        const min = formData.min_salary
            ? `₱${formData.min_salary.toLocaleString()}`
            : "No min";
        const max = formData.max_salary
            ? `₱${formData.max_salary.toLocaleString()}`
            : "No max";
        return `${min} - ${max}`;
    };

    const primaryPhoto = photos.find((photo) => photo.is_primary) || photos[0];

    // Reusable section header component
    const SectionHeader = ({
        icon: Icon,
        title,
        badge,
        step,
        color,
    }: {
        icon: any;
        title: string;
        badge?: string;
        step: number;
        color: string;
    }) => (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div
                    className={`w-8 h-8 ${color} rounded-full flex items-center justify-center`}
                >
                    <Icon
                        className={`w-4 h-4 ${color
                            .replace("/10", "")
                            .replace("bg-", "text-")}`}
                    />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                    {title}
                    {badge && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                            {badge}
                        </Badge>
                    )}
                </h3>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(step)}
                className="text-blue-500 hover:text-blue-700"
            >
                <Edit className="w-3 h-3 mr-1" />
                Edit
            </Button>
        </div>
    );

    return (
        <div className="w-full mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        {isEditMode ? "Review Changes" : "Review Job Posting"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {isEditMode
                            ? "Review your changes before saving"
                            : "Please review all information before publishing your job posting"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Step 1 - Job Information */}
                    <div className="space-y-4">
                        <SectionHeader
                            icon={Briefcase}
                            title="Job Information"
                            step={1}
                            color="bg-blue-500/10"
                        />
                        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Job Title
                                </p>
                                <p className="font-medium text-lg">
                                    {formData.title}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Work Types Required
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.work_types.map((type) => (
                                        <Badge key={type} variant="secondary">
                                            {workTypeLabels[type] || type}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Job Description
                                </p>
                                <p className="font-medium sm:text-sm text-xs">
                                    {formData.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Accommodation
                                    </p>
                                    <Badge variant="outline">
                                        {accommodationLabels[
                                            formData.accommodation_type
                                        ] || formData.accommodation_type}
                                    </Badge>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Day Off
                                    </p>
                                    <div className="flex flex-col gap-1">
                                        <Badge variant="outline">
                                            {dayOffLabels[
                                                formData.day_off_type
                                            ] || formData.day_off_type}
                                        </Badge>
                                        {formData.day_off_preference && (
                                            <p className="text-xs text-muted-foreground">
                                                Preference:{" "}
                                                {formData.day_off_preference}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Salary Range
                                    </p>
                                    <p className="font-medium flex items-center gap-2">
                                        <PhilippinePeso className="w-3 h-3" />
                                        {formatSalary()}
                                    </p>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Benefits Provided
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.provides_toiletries && (
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            <Bath className="w-3 h-3" />
                                            Toiletries
                                        </Badge>
                                    )}
                                    {formData.provides_food && (
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            <Utensils className="w-3 h-3" />
                                            Meals
                                        </Badge>
                                    )}
                                    {!formData.provides_toiletries &&
                                        !formData.provides_food && (
                                            <p className="text-sm text-muted-foreground">
                                                No additional benefits specified
                                            </p>
                                        )}
                                </div>
                            </div>

                            {/* Language Preferences */}
                            {formData.language_preferences &&
                                formData.language_preferences.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            Language Preferences
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.language_preferences.map(
                                                (lang) => (
                                                    <Badge
                                                        key={lang}
                                                        variant="outline"
                                                    >
                                                        {languageLabels[lang] ||
                                                            lang}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    <Separator />

                    {/* Step 2 - Location */}
                    <div className="space-y-4">
                        <SectionHeader
                            icon={MapPin}
                            title="Job Location"
                            step={2}
                            color="bg-green-500/10"
                        />
                        <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Address
                                </p>
                                <p className="font-medium flex items-start gap-2">
                                    <MapPin className="w-3 h-3 mt-1 flex-shrink-0" />
                                    {formatAddress()}
                                </p>
                                {location.postal_code && (
                                    <p className="text-sm text-muted-foreground ml-5">
                                        Postal Code: {location.postal_code}
                                    </p>
                                )}
                            </div>

                            {location.landmark && (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Nearby Landmark
                                    </p>
                                    <p className="font-medium">
                                        {location.landmark}
                                    </p>
                                </div>
                            )}

                            {location.directions && (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Directions
                                    </p>
                                    <p className="font-medium">
                                        {location.directions}
                                    </p>
                                </div>
                            )}

                            {(location.latitude || location.longitude) && (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        GPS Coordinates
                                    </p>
                                    <p className="font-medium">
                                        {location.latitude},{" "}
                                        {location.longitude}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                {location.is_hidden ? (
                                    <>
                                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Exact location will be hidden from
                                            public view
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Eye className="w-4 h-4 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            Location will be visible to
                                            applicants
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Step 3 - Bonuses */}
                    <div className="space-y-4">
                        <SectionHeader
                            icon={Gift}
                            title="Job Bonuses & Incentives"
                            badge="Optional"
                            step={3}
                            color="bg-purple-500/10"
                        />
                        <div className="p-4 bg-muted/50 rounded-lg">
                            {bonuses.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        {bonuses.length} bonus
                                        {bonuses.length !== 1 ? "es" : ""}{" "}
                                        offered:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {bonuses.map((bonus, index) => (
                                            <div
                                                key={index}
                                                className="p-3 bg-background rounded-lg border"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-medium">
                                                        {bonus.title}
                                                    </h4>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {bonusTypeLabels[
                                                            bonus.type
                                                        ] || bonus.type}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    {bonus.amount && (
                                                        <p className="flex items-center gap-1">
                                                            <PhilippinePeso className="w-3 h-3" />
                                                            ₱
                                                            {bonus.amount.toLocaleString()}
                                                        </p>
                                                    )}
                                                    <p className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {bonus.frequency}
                                                    </p>
                                                    {bonus.description && (
                                                        <p className="text-muted-foreground">
                                                            {bonus.description}
                                                        </p>
                                                    )}
                                                    {bonus.conditions && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Conditions:{" "}
                                                            {bonus.conditions}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground">
                                        No bonuses added
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        You can add bonuses later to make your
                                        posting more attractive
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Step 4 - Photos */}
                    <div className="space-y-4">
                        <SectionHeader
                            icon={Camera}
                            title="Job Photos"
                            badge="Optional"
                            step={4}
                            color="bg-orange-500/10"
                        />
                        <div className="p-4 bg-muted/50 rounded-lg">
                            {photos.length > 0 ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        {photos.length} photo
                                        {photos.length !== 1 ? "s" : ""}{" "}
                                        uploaded:
                                    </p>

                                    {/* Primary Photo */}
                                    {primaryPhoto && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <p className="text-sm font-medium">
                                                    Primary Photo
                                                </p>
                                            </div>
                                            <div className="relative w-full max-w-md">
                                                {primaryPhoto.file instanceof
                                                File ? (
                                                    <img
                                                        src={URL.createObjectURL(
                                                            primaryPhoto.file
                                                        )}
                                                        alt="Primary photo"
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                ) : primaryPhoto.url ? (
                                                    <img
                                                        src={`/storage/${primaryPhoto.url}`}
                                                        alt="Primary photo"
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                ) : null}
                                                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                                                    {photoTypeLabels[
                                                        primaryPhoto.type
                                                    ] || primaryPhoto.type}
                                                </div>
                                            </div>
                                            {primaryPhoto.caption && (
                                                <p className="text-sm text-muted-foreground mt-2">
                                                    {primaryPhoto.caption}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Other Photos */}
                                    {photos.filter((photo) => !photo.is_primary)
                                        .length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium mb-2">
                                                Additional Photos
                                            </p>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {photos
                                                    .filter(
                                                        (photo) =>
                                                            !photo.is_primary
                                                    )
                                                    .map((photo, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative"
                                                        >
                                                            {photo.file instanceof
                                                            File ? (
                                                                <img
                                                                    src={URL.createObjectURL(
                                                                        photo.file
                                                                    )}
                                                                    alt={
                                                                        photo.caption ||
                                                                        `Photo ${
                                                                            index +
                                                                            1
                                                                        }`
                                                                    }
                                                                    className="w-full h-24 object-cover rounded-lg"
                                                                />
                                                            ) : photo.url ? (
                                                                <img
                                                                    src={`/storage/${photo.url}`}
                                                                    alt={
                                                                        photo.caption ||
                                                                        `Photo ${
                                                                            index +
                                                                            1
                                                                        }`
                                                                    }
                                                                    className="w-full h-24 object-cover rounded-lg"
                                                                />
                                                            ) : null}
                                                            <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                                                                {photoTypeLabels[
                                                                    photo.type
                                                                ] || photo.type}
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground">
                                        No photos uploaded
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Photos help candidates visualize the
                                        work environment
                                    </p>
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
                                    Ready to {isEditMode ? "Save" : "Publish"}:
                                </strong>{" "}
                                Your job posting looks great!
                                {isEditMode
                                    ? " Your changes will be saved and the posting updated."
                                    : " After publishing, candidates will be able to view and apply for this position."}
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
                            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                                                • The updated posting will be
                                                visible to candidates
                                            </li>
                                            <li>
                                                • You can continue to edit
                                                anytime from your dashboard
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                • Your job posting will be
                                                published and visible to
                                                candidates
                                            </li>
                                            <li>
                                                • You'll receive notifications
                                                when candidates apply
                                            </li>
                                            <li>
                                                • You can manage applications
                                                from your employer dashboard
                                            </li>
                                            <li>
                                                • You can edit or deactivate the
                                                posting anytime
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
                                        : "Publishing Job..."}
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    {isEditMode
                                        ? "Save Changes"
                                        : "Publish Job Posting"}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
