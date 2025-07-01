import { useState, useEffect, useRef, useCallback } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Camera,
    Upload,
    Trash2,
    AlertCircle,
    Star,
    Image as ImageIcon,
    ArrowUp,
    ArrowDown,
    Eye,
} from "lucide-react";

import { validateStep4 } from "../../utils/step4Validation";
import { useStepValidation } from "../../hooks/useStepValidation";

interface PhotoData {
    file: File;
    caption?: string;
    type: string;
    sort_order?: number;
    is_primary?: boolean;
}

interface Step4PhotosProps {
    data: PhotoData[];
    onChange: (updates: PhotoData[]) => void;
    errors: Record<number, Record<string, string>>;
    onValidationChange?: (isValid: boolean) => void;
    showValidation?: boolean;
    isEditMode?: boolean;
}

const photoTypes = [
    { value: "interior", label: "Interior", icon: "🏠" },
    { value: "exterior", label: "Exterior", icon: "🌳" },
    { value: "room", label: "Room/Workspace", icon: "🛏️" },
    { value: "kitchen", label: "Kitchen", icon: "🍳" },
    { value: "bathroom", label: "Bathroom", icon: "🚿" },
    { value: "garden", label: "Garden/Outdoor", icon: "🌱" },
    { value: "general", label: "General", icon: "📷" },
];

export default function Step4_Photos({
    data,
    onChange,
    errors,
    onValidationChange,
    showValidation = false,
    isEditMode = false,
}: Step4PhotosProps) {
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { clientErrors, isValid } = useStepValidation(
        data,
        validateStep4,
        onValidationChange
    );

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        if (onValidationChange && isValid !== prevIsValid.current) {
            onValidationChange(isValid);
            prevIsValid.current = isValid;
        }
    }, [isValid, onValidationChange]);

    const handlePhotoChange = (
        index: number,
        field: keyof PhotoData,
        value: any
    ) => {
        setHasUserInteracted(true);
        const updatedPhotos = data.map((photo, idx) =>
            idx === index ? { ...photo, [field]: value } : photo
        );
        onChange(updatedPhotos);
    };

    const handleFileUpload = useCallback(
        (files: FileList | null) => {
            if (!files) return;

            setHasUserInteracted(true);
            const newPhotos: PhotoData[] = [];

            Array.from(files).forEach((file, index) => {
                if (file.type.startsWith("image/")) {
                    newPhotos.push({
                        file,
                        caption: "",
                        type: "general",
                        sort_order: data.length + index,
                        is_primary: data.length === 0 && index === 0, // First photo is primary by default
                    });
                }
            });

            onChange([...data, ...newPhotos]);
        },
        [data, onChange]
    );

    const removePhoto = (index: number) => {
        setHasUserInteracted(true);
        const updatedPhotos = data.filter((_, idx) => idx !== index);

        // If removed photo was primary, make first photo primary
        if (data[index].is_primary && updatedPhotos.length > 0) {
            updatedPhotos[0].is_primary = true;
        }

        onChange(updatedPhotos);
    };

    const movePhoto = (fromIndex: number, toIndex: number) => {
        setHasUserInteracted(true);
        const updatedPhotos = [...data];
        const [movedPhoto] = updatedPhotos.splice(fromIndex, 1);
        updatedPhotos.splice(toIndex, 0, movedPhoto);

        // Update sort orders
        updatedPhotos.forEach((photo, index) => {
            photo.sort_order = index;
        });

        onChange(updatedPhotos);
    };

    const setPrimaryPhoto = (index: number) => {
        setHasUserInteracted(true);
        const updatedPhotos = data.map((photo, idx) => ({
            ...photo,
            is_primary: idx === index,
        }));
        onChange(updatedPhotos);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Use client errors if available and user has interacted, otherwise use server errors
    const displayErrors =
        showValidation &&
        hasUserInteracted &&
        Object.keys(clientErrors).length > 0
            ? clientErrors
            : showValidation
            ? errors
            : {};
    const errorsByIndex = displayErrors as Record<
        number,
        Record<string, string>
    >;

    return (
        <div className="w-full mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                        <Camera className="w-6 h-6 text-primary" />
                        {isEditMode ? "Edit Job Photos" : "Job Photos"}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        {isEditMode
                            ? "Update photos to showcase your job location and environment"
                            : "Add photos to showcase your home and work environment (Optional)"}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Upload Section */}
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e.target.files)}
                            className="hidden"
                        />

                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                                <Upload className="w-8 h-8 text-primary" />
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-2">
                                    Upload Photos
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Drag and drop images here, or click to
                                    select files
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Supported formats: JPEG, PNG, GIF, WebP •
                                    Max size: 2MB per file
                                </p>
                            </div>

                            <Button
                                type="button"
                                onClick={triggerFileInput}
                                className="flex items-center gap-2 mx-auto"
                            >
                                <Upload className="w-4 h-4" />
                                Choose Files
                            </Button>
                        </div>
                    </div>

                    {/* Photos List */}
                    {data.length === 0 ? (
                        <div className="text-center py-12">
                            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                No photos added yet
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Photos help candidates visualize the work
                                environment and can increase applications
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    Uploaded Photos ({data.length})
                                </h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={triggerFileInput}
                                    className="flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    Add More
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.map((photo, index) => (
                                    <Card
                                        key={index}
                                        className="border-2 border-border relative"
                                    >
                                        {/* Primary Photo Badge */}
                                        {photo.is_primary && (
                                            <div className="absolute top-2 left-2 z-10">
                                                <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                                    <Star className="w-3 h-3" />
                                                    Primary
                                                </div>
                                            </div>
                                        )}

                                        {/* Sort Order Controls */}
                                        <div className="absolute top-2 right-2 z-10 flex gap-1">
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="secondary"
                                                onClick={() =>
                                                    index > 0 &&
                                                    movePhoto(index, index - 1)
                                                }
                                                disabled={index === 0}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ArrowUp className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="secondary"
                                                onClick={() =>
                                                    index < data.length - 1 &&
                                                    movePhoto(index, index + 1)
                                                }
                                                disabled={
                                                    index === data.length - 1
                                                }
                                                className="h-8 w-8 p-0"
                                            >
                                                <ArrowDown className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    removePhoto(index)
                                                }
                                                className="h-8 w-8 p-0"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>

                                        <CardContent className="p-4 space-y-4">
                                            {/* Photo Preview */}
                                            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                                                <img
                                                    src={URL.createObjectURL(
                                                        photo.file
                                                    )}
                                                    alt={
                                                        photo.caption ||
                                                        `Photo ${index + 1}`
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Photo Details */}
                                            <div className="space-y-3">
                                                {/* Photo Type */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`photo-type-${index}`}
                                                        className="text-sm font-medium"
                                                    >
                                                        Photo Type *
                                                    </Label>
                                                    <Select
                                                        value={photo.type || ""}
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            handlePhotoChange(
                                                                index,
                                                                "type",
                                                                value
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            className={`h-10 ${
                                                                errorsByIndex[
                                                                    index
                                                                ]?.type
                                                                    ? "border-red-500"
                                                                    : ""
                                                            }`}
                                                        >
                                                            <SelectValue placeholder="Select photo type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {photoTypes.map(
                                                                (type) => (
                                                                    <SelectItem
                                                                        key={
                                                                            type.value
                                                                        }
                                                                        value={
                                                                            type.value
                                                                        }
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <span>
                                                                                {
                                                                                    type.icon
                                                                                }
                                                                            </span>
                                                                            {
                                                                                type.label
                                                                            }
                                                                        </div>
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                    {errorsByIndex[index]
                                                        ?.type && (
                                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {
                                                                errorsByIndex[
                                                                    index
                                                                ].type
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Caption */}
                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor={`photo-caption-${index}`}
                                                        className="text-sm font-medium"
                                                    >
                                                        Caption
                                                    </Label>
                                                    <Input
                                                        id={`photo-caption-${index}`}
                                                        type="text"
                                                        placeholder="Describe what's shown in this photo..."
                                                        value={
                                                            photo.caption || ""
                                                        }
                                                        onChange={(e) =>
                                                            handlePhotoChange(
                                                                index,
                                                                "caption",
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`h-10 sm:text-sm text-xs ${
                                                            errorsByIndex[index]
                                                                ?.caption
                                                                ? "border-red-500"
                                                                : ""
                                                        }`}
                                                    />
                                                    {errorsByIndex[index]
                                                        ?.caption && (
                                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            {
                                                                errorsByIndex[
                                                                    index
                                                                ].caption
                                                            }
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Primary Photo Checkbox */}
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`photo-primary-${index}`}
                                                        checked={
                                                            photo.is_primary ||
                                                            false
                                                        }
                                                        onCheckedChange={() =>
                                                            setPrimaryPhoto(
                                                                index
                                                            )
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={`photo-primary-${index}`}
                                                        className="text-sm font-medium cursor-pointer flex items-center gap-2"
                                                    >
                                                        <Star className="w-4 h-4" />
                                                        Set as primary photo
                                                    </Label>
                                                </div>

                                                {/* File Info */}
                                                <div className="text-xs text-muted-foreground">
                                                    <p
                                                        className="truncate break-all max-w-full"
                                                        title={photo.file.name}
                                                    >
                                                        File: {photo.file.name}
                                                    </p>
                                                    <p>
                                                        Size:{" "}
                                                        {(
                                                            photo.file.size /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{" "}
                                                        MB
                                                    </p>
                                                    <p>
                                                        Type: {photo.file.type}
                                                    </p>
                                                </div>

                                                {/* File Validation Error */}
                                                {errorsByIndex[index]?.file && (
                                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        {
                                                            errorsByIndex[index]
                                                                .file
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Info Alert */}
                    <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                            <p className="font-medium mb-2">
                                📸 Photo Guidelines:
                            </p>
                            <ul className="text-sm space-y-1 list-disc list-inside">
                                <li>
                                    High-quality photos attract more candidates
                                </li>
                                <li>
                                    Show different areas: bedrooms, kitchen,
                                    common areas
                                </li>
                                <li>
                                    Good lighting makes photos more appealing
                                </li>
                                <li>
                                    The first photo (primary) appears in search
                                    results
                                </li>
                                <li>
                                    Captions help explain what candidates will
                                    see
                                </li>
                                <li>
                                    Keep photos current and representative of
                                    actual conditions
                                </li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
