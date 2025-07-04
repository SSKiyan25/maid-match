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
    Home,
    Heart,
    Baby,
    PawPrint,
    AlertCircle,
    Info,
    Phone,
    Mail,
    MapPin,
    Users,
    DollarSign,
    Clock,
    FileImage,
} from "lucide-react";

import type { Step6ReviewProps } from "../../utils/types";

export default function Step6_Review({
    data,
    onEdit,
    onSubmit,
    isSubmitting,
    errors,
    submissionErrors,
}: Step6ReviewProps) {
    const safeSubmissionErrors = submissionErrors ?? {};
    const labels = {
        workType: {
            general_housework: "General Housework",
            childcare: "Childcare & Housework",
            elderly_care: "Elderly Care",
            cooking_cleaning: "Cooking & Cleaning",
            laundry_ironing: "Laundry & Ironing",
            pet_care: "Pet Care Included",
            all_around: "All-Around Helper",
        },
        accommodation: {
            live_in: "Live-in (Stay in our home)",
            live_out: "Live-out (Daily visits)",
            flexible: "Flexible/Either",
        },
        schedule: {
            full_time: "Full-time (Daily, 8+ hours)",
            part_time: "Part-time (Daily, 4-6 hours)",
            weekdays_only: "Weekdays Only",
            weekends_only: "Weekends Only",
            as_needed: "As Needed/Flexible",
        },
        experience: {
            no_experience: "No experience needed (will train)",
            some_experience: "Some experience (1-2 years)",
            experienced: "Experienced (3-5 years)",
            very_experienced: "Very experienced (5+ years)",
            specific_skills: "Specific skills required",
        },
        petType: {
            dog: "Dog",
            cat: "Cat",
            bird: "Bird",
            fish: "Fish",
            rabbit: "Rabbit",
            hamster: "Hamster",
            guinea_pig: "Guinea Pig",
            turtle: "Turtle",
            snake: "Snake",
            lizard: "Lizard",
            other: "Other",
        },
    };

    const getLabel = (type: keyof typeof labels, value: string) => {
        return (
            labels[type][value as keyof (typeof labels)[typeof type]] || value
        );
    };

    const calculateAge = (birthDate: string): number | null => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }
        return age;
    };

    const getAgeGroup = (age: number | null): string => {
        if (age === null) return "Unknown";
        if (age <= 3) return "Toddler";
        if (age <= 5) return "Preschooler";
        if (age <= 12) return "School Age";
        if (age <= 17) return "Teenager";
        return "Adult";
    };

    const formatAddress = () => {
        try {
            const addr = JSON.parse(data.address);
            return `${addr.street}, ${addr.barangay}, ${addr.city}, ${addr.province}`;
        } catch {
            return data.address;
        }
    };

    const formatBudget = () => {
        const min = data.budget_min
            ? `₱${data.budget_min.toLocaleString()}`
            : "No min";
        const max = data.budget_max
            ? `₱${data.budget_max.toLocaleString()}`
            : "No max";
        return `${min} - ${max}`;
    };

    const hasRequirements =
        data.work_type ||
        data.accommodation ||
        data.budget_min ||
        data.schedule ||
        data.experience_needed ||
        data.special_requirements;

    const hasChildren =
        data.has_children && data.children && data.children.length > 0;
    const hasPets = data.has_pets && data.pets && data.pets.length > 0;

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
        <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Review Your Information
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Please review all your information before submitting
                        your registration
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Step 1 - Basic Information */}
                    <div className="space-y-4">
                        <SectionHeader
                            icon={User}
                            title="Basic Information"
                            step={1}
                            color="bg-blue-500/10"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Full Name
                                </p>
                                <p className="font-medium">
                                    {data.first_name} {data.last_name}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Email
                                </p>
                                <p className="font-medium flex items-center gap-2">
                                    <Mail className="w-3 h-3" />
                                    {data.email}
                                </p>
                            </div>
                            {data.phone_number && (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Phone Number
                                    </p>
                                    <p className="font-medium flex items-center gap-2">
                                        <Phone className="w-3 h-3" />
                                        {data.phone_number}
                                    </p>
                                </div>
                            )}
                            {data.birth_date && (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Date of Birth
                                    </p>
                                    <p className="font-medium">
                                        {new Date(
                                            data.birth_date
                                        ).toLocaleDateString("en-PH", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Step 2 - Household Information */}
                    <div className="space-y-4">
                        <SectionHeader
                            icon={Home}
                            title="Household Information"
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
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Family Size
                                </p>
                                <p className="font-medium flex items-center gap-2">
                                    <Users className="w-3 h-3" />
                                    {data.family_size} family members
                                </p>
                            </div>
                            {data.household_description && (
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Household Description
                                    </p>
                                    <p className="font-medium">
                                        {data.household_description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Step 3 - Requirements */}
                    <div className="space-y-4">
                        <SectionHeader
                            icon={Heart}
                            title="Helper Requirements"
                            badge="Optional"
                            step={3}
                            color="bg-purple-500/10"
                        />
                        <div className="p-4 bg-muted/50 rounded-lg">
                            {hasRequirements ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.work_type && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">
                                                Type of Help
                                            </p>
                                            <Badge variant="secondary">
                                                {getLabel(
                                                    "workType",
                                                    data.work_type
                                                )}
                                            </Badge>
                                        </div>
                                    )}
                                    {data.accommodation && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">
                                                Living Arrangement
                                            </p>
                                            <Badge variant="secondary">
                                                {getLabel(
                                                    "accommodation",
                                                    data.accommodation
                                                )}
                                            </Badge>
                                        </div>
                                    )}
                                    {data.schedule && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">
                                                Work Schedule
                                            </p>
                                            <Badge
                                                variant="secondary"
                                                className="flex items-center gap-1 w-fit"
                                            >
                                                <Clock className="w-3 h-3" />
                                                {getLabel(
                                                    "schedule",
                                                    data.schedule
                                                )}
                                            </Badge>
                                        </div>
                                    )}
                                    {(data.budget_min || data.budget_max) && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground">
                                                Budget Range
                                            </p>
                                            <p className="font-medium flex items-center gap-2">
                                                <DollarSign className="w-3 h-3" />
                                                {formatBudget()}
                                            </p>
                                        </div>
                                    )}
                                    {data.experience_needed && (
                                        <div className="space-y-2 md:col-span-2">
                                            <p className="text-sm text-muted-foreground">
                                                Experience Requirements
                                            </p>
                                            <Badge variant="outline">
                                                {getLabel(
                                                    "experience",
                                                    data.experience_needed
                                                )}
                                            </Badge>
                                        </div>
                                    )}
                                    {data.special_requirements && (
                                        <div className="space-y-2 md:col-span-2">
                                            <p className="text-sm text-muted-foreground">
                                                Special Requirements
                                            </p>
                                            <p className="font-medium">
                                                {data.special_requirements}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground">
                                        No specific requirements set
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        You can add requirements later to help
                                        match with suitable helpers
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Step 4 - Children */}
                    <div className="space-y-4">
                        <SectionHeader
                            icon={Baby}
                            title="Children Information"
                            badge="Optional"
                            step={4}
                            color="bg-pink-500/10"
                        />
                        <div className="p-4 bg-muted/50 rounded-lg">
                            {hasChildren ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        {data.children!.length} child
                                        {data.children!.length !== 1
                                            ? "ren"
                                            : ""}{" "}
                                        in household:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {data.children!.map((child, index) => {
                                            const age = calculateAge(
                                                child.birth_date
                                            );
                                            return (
                                                <div
                                                    key={child.id}
                                                    className="flex items-center gap-3 p-3 bg-background rounded-lg"
                                                >
                                                    <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/20 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                                                            {index + 1}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">
                                                            {child.name ||
                                                                `Child ${
                                                                    index + 1
                                                                }`}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            {age !== null && (
                                                                <>
                                                                    <span>
                                                                        {age}{" "}
                                                                        years
                                                                        old
                                                                    </span>
                                                                    <span>
                                                                        •
                                                                    </span>
                                                                    <span>
                                                                        {getAgeGroup(
                                                                            age
                                                                        )}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {child.photo && (
                                                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                                            <FileImage className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {data.children_photos &&
                                        data.children_photos.length > 0 && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {data.children_photos.length}{" "}
                                                photo
                                                {data.children_photos.length !==
                                                1
                                                    ? "s"
                                                    : ""}{" "}
                                                uploaded
                                            </p>
                                        )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground">
                                        No children information provided
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        You can add children information later
                                        to find helpers with childcare
                                        experience
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Step 5 - Pets */}
                    <div className="space-y-4">
                        <SectionHeader
                            icon={PawPrint}
                            title="Pet Information"
                            badge="Optional"
                            step={5}
                            color="bg-orange-500/10"
                        />
                        <div className="p-4 bg-muted/50 rounded-lg">
                            {hasPets ? (
                                <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">
                                        {data.pets!.length} pet
                                        {data.pets!.length !== 1 ? "s" : ""} in
                                        household:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {data.pets!.map((pet, index) => (
                                            <div
                                                key={pet.id}
                                                className="flex items-center gap-3 p-3 bg-background rounded-lg"
                                            >
                                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                                                    <PawPrint className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium">
                                                        {pet.name ||
                                                            `${getLabel(
                                                                "petType",
                                                                pet.type
                                                            )} ${index + 1}`}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {getLabel(
                                                            "petType",
                                                            pet.type
                                                        )}
                                                    </p>
                                                </div>
                                                {pet.photo && (
                                                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                                        <FileImage className="w-3 h-3 text-green-600 dark:text-green-400" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {data.pets_photos &&
                                        data.pets_photos.length > 0 && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {data.pets_photos.length} photo
                                                {data.pets_photos.length !== 1
                                                    ? "s"
                                                    : ""}{" "}
                                                uploaded
                                            </p>
                                        )}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-muted-foreground">
                                        No pet information provided
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        You can add pet information later to
                                        find helpers comfortable with animals
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
                                <strong>Ready to Submit:</strong> Your profile
                                information looks complete! After submission,
                                you'll be able to browse and connect with
                                verified household helpers.
                            </AlertDescription>
                        </Alert>

                        {Object.keys(safeSubmissionErrors).length > 0 && (
                            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <AlertDescription className="text-red-800 dark:text-red-200">
                                    <strong>
                                        Please fix the following errors:
                                    </strong>
                                    <ul className="mt-2 list-disc list-inside">
                                        {Object.entries(
                                            safeSubmissionErrors
                                        ).map(([field, error]) => (
                                            <li key={field} className="text-sm">
                                                {error}
                                            </li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertDescription className="text-blue-800 dark:text-blue-200">
                                <strong>What happens next:</strong>
                                <ul className="mt-2 text-sm space-y-1">
                                    <li>
                                        • Your account will be created and
                                        verified
                                    </li>
                                    <li>
                                        • You'll receive a welcome email with
                                        next steps
                                    </li>
                                    <li>
                                        • You can start browsing helper profiles
                                        immediately
                                    </li>
                                    <li>
                                        • Our matching algorithm will suggest
                                        compatible helpers
                                    </li>
                                    <li>
                                        • You can add or update requirements
                                        anytime from your profile
                                    </li>
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
                                    Creating Your Account...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Complete Registration
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
