import { useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Progress } from "@/Components/ui/progress";
import {
    Baby,
    Plus,
    Trash2,
    AlertCircle,
    Info,
    Calendar,
    Upload,
    X,
    Image,
    CheckCircle,
} from "lucide-react";

import type { Step4ChildrenProps, Child } from "../../utils/types";
import { useStep4Validation } from "../../hooks/useStep4Validation";
import { calculateAge, getAgeGroup } from "../../utils/step4Validation";

export default function Step4_Children({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step4ChildrenProps) {
    const {
        clientErrors,
        childErrors,
        completionPercentage,
        handleChildChange,
        handlePhotoUpload,
        addChild,
        removeChild,
        isValid,
    } = useStep4Validation(data);

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        if (onValidationChange && isValid !== prevIsValid.current) {
            onValidationChange(isValid);
            prevIsValid.current = isValid;
        }
    }, [isValid, onValidationChange]);

    // Use client errors if available, otherwise use server errors
    const displayErrors =
        showValidation && Object.keys(clientErrors).length > 0
            ? clientErrors
            : {};

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Children Information
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Tell us about your children so we can find helpers with
                        the right childcare experience (completely optional)
                    </CardDescription>

                    {/* Completion Progress */}
                    {data.children && data.children.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Children Info Completion
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                    {completionPercentage}%
                                </span>
                            </div>
                            <Progress
                                value={completionPercentage}
                                className="h-2"
                            />
                            <p className="text-xs text-muted-foreground text-center">
                                More details help us find better childcare
                                matches
                            </p>
                        </div>
                    )}
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Optional Notice */}
                    <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            <strong>Optional Step:</strong> You can skip this
                            entire section if you prefer. Adding children
                            information helps us match you with helpers who have
                            childcare experience, but it's not required to
                            complete registration.
                        </AlertDescription>
                    </Alert>

                    {/* General Errors */}
                    {displayErrors.general && (
                        <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                            <AlertDescription className="text-red-800 dark:text-red-200">
                                {displayErrors.general}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* No Children Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-pink-500/10 rounded-full flex items-center justify-center">
                                <Baby className="w-4 h-4 text-pink-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Children in Household
                            </h3>
                        </div>

                        {(!data.has_children ||
                            (data.children && data.children.length === 0)) && (
                            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <AlertDescription className="text-blue-800 dark:text-blue-200">
                                    <div className="space-y-2">
                                        <p>
                                            <strong>No children?</strong> You
                                            can skip this step and proceed to
                                            the next section.
                                        </p>
                                        <p>
                                            If you have children, adding their
                                            information helps us find helpers
                                            with appropriate childcare
                                            experience.
                                        </p>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Add First Child Button */}
                        {(!data.children || data.children.length === 0) && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => addChild(onChange)}
                                className="w-full h-12 border-dashed border-2 hover:border-primary/50"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Child Information (Optional)
                            </Button>
                        )}
                    </div>

                    {/* Children List */}
                    {data.children && data.children.length > 0 && (
                        <div className="space-y-6">
                            {data.children.map((child, index) => (
                                <Card
                                    key={child.id}
                                    className="border-2 border-muted"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">
                                                Child {index + 1}
                                                {childErrors[child.id] &&
                                                    Object.keys(
                                                        childErrors[child.id]
                                                    ).length > 0 && (
                                                        <span className="ml-2 text-red-500">
                                                            <AlertCircle className="w-4 h-4 inline" />
                                                        </span>
                                                    )}
                                            </CardTitle>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    removeChild(
                                                        child.id,
                                                        onChange
                                                    )
                                                }
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="space-y-4">
                                        {/* Basic Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`child_${child.id}_name`}
                                                    className="text-sm font-medium"
                                                >
                                                    Name
                                                </Label>
                                                <Input
                                                    id={`child_${child.id}_name`}
                                                    type="text"
                                                    placeholder="Child's name (optional)"
                                                    value={child.name}
                                                    onChange={(e) =>
                                                        handleChildChange(
                                                            child.id,
                                                            "name",
                                                            e.target.value,
                                                            onChange
                                                        )
                                                    }
                                                    className={`h-11 ${
                                                        childErrors[child.id]
                                                            ?.name
                                                            ? "border-red-500"
                                                            : ""
                                                    }`}
                                                />
                                                {childErrors[child.id]
                                                    ?.name && (
                                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {
                                                            childErrors[
                                                                child.id
                                                            ].name
                                                        }
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    You can leave this blank if
                                                    you prefer privacy
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`child_${child.id}_birth_date`}
                                                    className="text-sm font-medium"
                                                >
                                                    Birth Date
                                                </Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id={`child_${child.id}_birth_date`}
                                                        type="date"
                                                        value={child.birth_date}
                                                        onChange={(e) =>
                                                            handleChildChange(
                                                                child.id,
                                                                "birth_date",
                                                                e.target.value,
                                                                onChange
                                                            )
                                                        }
                                                        className={`pl-10 h-11 ${
                                                            childErrors[
                                                                child.id
                                                            ]?.birth_date
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                        max={
                                                            new Date()
                                                                .toISOString()
                                                                .split("T")[0]
                                                        }
                                                    />
                                                </div>
                                                {childErrors[child.id]
                                                    ?.birth_date && (
                                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {
                                                            childErrors[
                                                                child.id
                                                            ].birth_date
                                                        }
                                                    </p>
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    Optional - Helps match with
                                                    age-appropriate caregivers
                                                </p>
                                            </div>
                                        </div>

                                        {/* Photo Upload */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`child_${child.id}_photo`}
                                                className="text-sm font-medium"
                                            >
                                                Child Photo
                                            </Label>

                                            {/* Photo Upload Area */}
                                            {!child.photo ? (
                                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                                                    <input
                                                        id={`child_${child.id}_photo`}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file =
                                                                e.target
                                                                    .files?.[0] ||
                                                                null;
                                                            handlePhotoUpload(
                                                                child.id,
                                                                file,
                                                                onChange
                                                            );
                                                        }}
                                                        className="hidden"
                                                    />
                                                    <Label
                                                        htmlFor={`child_${child.id}_photo`}
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="space-y-2">
                                                            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                                                <Upload className="w-5 h-5 text-muted-foreground" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <p className="text-sm font-medium">
                                                                    Upload Photo
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Click to
                                                                    select an
                                                                    image
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Label>
                                                </div>
                                            ) : (
                                                /* Photo Preview */
                                                <div className="relative">
                                                    <div className="border rounded-lg p-4 bg-muted/20">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                                                    <Image className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium">
                                                                        {
                                                                            child
                                                                                .photo
                                                                                .name
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {(
                                                                            child
                                                                                .photo
                                                                                .size /
                                                                            1024 /
                                                                            1024
                                                                        ).toFixed(
                                                                            2
                                                                        )}{" "}
                                                                        MB
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handlePhotoUpload(
                                                                        child.id,
                                                                        null,
                                                                        onChange
                                                                    )
                                                                }
                                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {childErrors[child.id]?.photo && (
                                                <p className="text-sm text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {
                                                        childErrors[child.id]
                                                            .photo
                                                    }
                                                </p>
                                            )}

                                            <p className="text-xs text-muted-foreground">
                                                Optional - A photo can help
                                                helpers identify your child, but
                                                it's completely optional. Max
                                                file size: 2MB
                                            </p>
                                        </div>

                                        {/* General Child Errors */}
                                        {childErrors[child.id]?.general && (
                                            <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                                                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                <AlertDescription className="text-amber-800 dark:text-amber-200">
                                                    {
                                                        childErrors[child.id]
                                                            .general
                                                    }
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        {/* Age Display */}
                                        {child.birth_date && (
                                            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                                <p className="text-sm text-muted-foreground">
                                                    <strong>
                                                        Current Age:
                                                    </strong>{" "}
                                                    {calculateAge(
                                                        child.birth_date
                                                    )}{" "}
                                                    years old
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    <strong>Age Group:</strong>{" "}
                                                    {getAgeGroup(
                                                        calculateAge(
                                                            child.birth_date
                                                        )
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Add Another Child Button */}
                            {data.children.length < 10 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addChild(onChange)}
                                    className="w-full h-12 border-dashed border-2 hover:border-primary/50"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Another Child (Optional)
                                </Button>
                            )}

                            {data.children.length >= 10 && (
                                <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                                        Maximum of 10 children can be added. If
                                        you have more children, you can add them
                                        later in your profile.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    {/* Privacy Alert */}
                    <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertDescription className="text-amber-800 dark:text-amber-200">
                            <strong>Privacy & Safety:</strong> Children's
                            information is kept confidential and only shared
                            with verified helpers who have passed background
                            checks and childcare screening. Photos are encrypted
                            and access-controlled.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
