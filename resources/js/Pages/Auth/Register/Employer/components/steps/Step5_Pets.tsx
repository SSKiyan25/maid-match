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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Progress } from "@/Components/ui/progress";
import {
    Heart,
    Plus,
    Trash2,
    AlertCircle,
    Info,
    Upload,
    Dog,
    Cat,
    Bird,
    Fish,
    X,
    Image,
    CheckCircle,
} from "lucide-react";

import type { Step5PetsProps, Pet } from "../../utils/types";
import { useStep5Validation } from "../../hooks/useStep5Validation";
import { getPetTypeInfo } from "../../utils/step5Validation";

export default function Step5_Pets({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
}: Step5PetsProps) {
    const {
        clientErrors,
        petErrors,
        completionPercentage,
        matchingTips,
        handlePetChange,
        handlePhotoUpload,
        addPet,
        removePet,
        isValid,
    } = useStep5Validation(data);

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

    const petTypes = [
        { value: "dog", label: "Dog", icon: Dog },
        { value: "cat", label: "Cat", icon: Cat },
        { value: "bird", label: "Bird", icon: Bird },
        { value: "fish", label: "Fish", icon: Fish },
        { value: "rabbit", label: "Rabbit", icon: Heart },
        { value: "hamster", label: "Hamster", icon: Heart },
        { value: "guinea_pig", label: "Guinea Pig", icon: Heart },
        { value: "turtle", label: "Turtle", icon: Heart },
        { value: "snake", label: "Snake", icon: Heart },
        { value: "lizard", label: "Lizard", icon: Heart },
        { value: "other", label: "Other", icon: Heart },
    ];

    const getCategoryColor = (category: string) => {
        switch (category) {
            case "common":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
            case "specialized":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300";
        }
    };

    const getPetTypeData = (type: string) => {
        return petTypes.find((pt) => pt.value === type);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground">
                        Pet Information
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Tell us about your pets so we can find helpers who are
                        comfortable with animals (completely optional)
                    </CardDescription>

                    {/* Completion Progress */}
                    {data.pets && data.pets.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">
                                    Pet Info Completion
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
                                More details help us find better pet-friendly
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
                            entire section if you prefer. Adding pet information
                            helps us match you with helpers who are comfortable
                            with animals, but it's not required to complete
                            registration.
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

                    {/* No Pets Option */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                                <Heart className="w-4 h-4 text-orange-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">
                                Pets in Household
                            </h3>
                        </div>

                        {(!data.has_pets ||
                            (data.pets && data.pets.length === 0)) && (
                            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <AlertDescription className="text-blue-800 dark:text-blue-200">
                                    <div className="space-y-2">
                                        <p>
                                            <strong>No pets?</strong> You can
                                            skip this step and proceed to the
                                            next section.
                                        </p>
                                        <p>
                                            If you have pets, adding their
                                            information helps us find helpers
                                            who are comfortable with animals.
                                        </p>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Add First Pet Button */}
                        {(!data.pets || data.pets.length === 0) && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => addPet(onChange)}
                                className="w-full h-12 border-dashed border-2 hover:border-primary/50"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Pet Information (Optional)
                            </Button>
                        )}
                    </div>

                    {/* Pets List */}
                    {data.pets && data.pets.length > 0 && (
                        <div className="space-y-6">
                            {data.pets.map((pet, index) => {
                                const petTypeData = getPetTypeData(pet.type);
                                const PetIcon = petTypeData?.icon || Heart;
                                const petInfo = getPetTypeInfo(pet.type);

                                return (
                                    <Card
                                        key={pet.id}
                                        className="border-2 border-muted"
                                    >
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <CardTitle className="text-lg">
                                                        Pet {index + 1}
                                                        {petErrors[pet.id] &&
                                                            Object.keys(
                                                                petErrors[
                                                                    pet.id
                                                                ]
                                                            ).length > 0 && (
                                                                <span className="ml-2 text-red-500">
                                                                    <AlertCircle className="w-4 h-4 inline" />
                                                                </span>
                                                            )}
                                                    </CardTitle>
                                                    {pet.type && (
                                                        <div className="flex items-center gap-2">
                                                            <PetIcon className="w-4 h-4 text-muted-foreground" />
                                                            <Badge
                                                                className={getCategoryColor(
                                                                    petInfo.category
                                                                )}
                                                            >
                                                                {
                                                                    petInfo.category
                                                                }
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        removePet(
                                                            pet.id,
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
                                            {/* Pet Type and Name */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`pet_${pet.id}_type`}
                                                        className="text-sm font-medium"
                                                    >
                                                        Pet Type
                                                    </Label>
                                                    <Select
                                                        value={pet.type}
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            handlePetChange(
                                                                pet.id,
                                                                "type",
                                                                value,
                                                                onChange
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            className={`h-11 ${
                                                                petErrors[
                                                                    pet.id
                                                                ]?.type
                                                                    ? "border-red-500"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <SelectValue placeholder="Select pet type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {petTypes.map(
                                                                (type) => {
                                                                    const Icon =
                                                                        type.icon;
                                                                    return (
                                                                        <SelectItem
                                                                            key={
                                                                                type.value
                                                                            }
                                                                            value={
                                                                                type.value
                                                                            }
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <Icon className="w-4 h-4" />
                                                                                <span>
                                                                                    {
                                                                                        type.label
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </SelectItem>
                                                                    );
                                                                }
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {petErrors[pet.id]
                                                        ?.type && (
                                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {
                                                                petErrors[
                                                                    pet.id
                                                                ].type
                                                            }
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        Required - Helps us
                                                        match with pet-friendly
                                                        helpers
                                                    </p>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`pet_${pet.id}_name`}
                                                        className="text-sm font-medium"
                                                    >
                                                        Pet Name
                                                    </Label>
                                                    <Input
                                                        id={`pet_${pet.id}_name`}
                                                        type="text"
                                                        placeholder="Pet's name (optional)"
                                                        value={pet.name}
                                                        onChange={(e) =>
                                                            handlePetChange(
                                                                pet.id,
                                                                "name",
                                                                e.target.value,
                                                                onChange
                                                            )
                                                        }
                                                        className={`h-11 ${
                                                            petErrors[pet.id]
                                                                ?.name
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                    />
                                                    {petErrors[pet.id]
                                                        ?.name && (
                                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {
                                                                petErrors[
                                                                    pet.id
                                                                ].name
                                                            }
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">
                                                        Helps helpers connect
                                                        with your pet
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Photo Upload */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`pet_${pet.id}_photo`}
                                                    className="text-sm font-medium"
                                                >
                                                    Pet Photo
                                                </Label>

                                                {!pet.photo ? (
                                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                                                        <input
                                                            id={`pet_${pet.id}_photo`}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file =
                                                                    e.target
                                                                        .files?.[0] ||
                                                                    null;
                                                                handlePhotoUpload(
                                                                    pet.id,
                                                                    file,
                                                                    onChange
                                                                );
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <Label
                                                            htmlFor={`pet_${pet.id}_photo`}
                                                            className="cursor-pointer"
                                                        >
                                                            <div className="space-y-2">
                                                                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                                                    <Upload className="w-5 h-5 text-muted-foreground" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-sm font-medium">
                                                                        Upload
                                                                        Photo
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Click to
                                                                        select
                                                                        an image
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                ) : (
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
                                                                                pet
                                                                                    .photo
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {(
                                                                                pet
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
                                                                            pet.id,
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

                                                {petErrors[pet.id]?.photo && (
                                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {
                                                            petErrors[pet.id]
                                                                .photo
                                                        }
                                                    </p>
                                                )}

                                                <p className="text-xs text-muted-foreground">
                                                    Optional - A photo helps
                                                    helpers recognize your pet.
                                                    Max file size: 2MB
                                                </p>
                                            </div>

                                            {/* General Pet Errors */}
                                            {petErrors[pet.id]?.general && (
                                                <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                                                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                                                        {
                                                            petErrors[pet.id]
                                                                .general
                                                        }
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            {/* Simple Pet Display */}
                                            {pet.type && (
                                                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                                    <p className="text-sm text-muted-foreground">
                                                        <strong>
                                                            Pet Type:
                                                        </strong>{" "}
                                                        {petInfo.label}
                                                        {pet.name && (
                                                            <span>
                                                                {" "}
                                                                •{" "}
                                                                <strong>
                                                                    Name:
                                                                </strong>{" "}
                                                                {pet.name}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}

                            {/* Add Another Pet Button */}
                            {data.pets.length < 20 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addPet(onChange)}
                                    className="w-full h-12 border-dashed border-2 hover:border-primary/50"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Another Pet (Optional)
                                </Button>
                            )}

                            {data.pets.length >= 20 && (
                                <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                                    <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                                        Maximum of 20 pets can be added. If you
                                        have more pets, you can add them later
                                        in your profile.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    {/* Simple Matching Tips */}
                    {matchingTips.length > 0 &&
                        data.pets &&
                        data.pets.length > 0 && (
                            <div className="pt-6 border-t border-border">
                                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                    <Heart className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <AlertDescription className="text-green-800 dark:text-green-200">
                                        <div className="space-y-2">
                                            <p>
                                                <strong>
                                                    Pet-Friendly Helper
                                                    Matching:
                                                </strong>
                                            </p>
                                            <ul className="text-sm space-y-1">
                                                {matchingTips.map(
                                                    (tip, index) => (
                                                        <li key={index}>
                                                            • {tip}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                    {/* Simple Safety Notice */}
                    <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertDescription className="text-amber-800 dark:text-amber-200">
                            <strong>Note:</strong> We'll match you with helpers
                            who are comfortable around your types of pets.
                            Specific care instructions can be discussed during
                            the interview process.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
