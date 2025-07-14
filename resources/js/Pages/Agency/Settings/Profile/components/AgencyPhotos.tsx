import React, { useState } from "react";
import { AgencyPhoto } from "@/types";
import { Button } from "@/Components/ui/button";
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
import { useForm } from "@inertiajs/react";
import { ImagePlus, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

import { usePhotoValidation } from "../utils/usePhotoValidation";

interface AgencyPhotosProps {
    photos: AgencyPhoto[];
    agencyId: number;
}

const photoTypes = [
    { value: "logo", label: "Logo" },
    { value: "office", label: "Office" },
    { value: "team", label: "Team" },
    { value: "certificate", label: "Certificate" },
    { value: "other", label: "Other" },
];

export default function AgencyPhotos({ photos, agencyId }: AgencyPhotosProps) {
    const [addPhotoOpen, setAddPhotoOpen] = useState(false);
    const [editPhotoId, setEditPhotoId] = useState<number | null>(null);
    const [deletePhotoId, setDeletePhotoId] = useState<number | null>(null);

    const editPhoto = photos.find((p) => p.id === editPhotoId);
    const deletePhoto = photos.find((p) => p.id === deletePhotoId);

    const { data, setData, post, processing, errors, reset, progress } =
        useForm({
            photos: [] as File[],
            caption: "",
            type: "office",
            is_primary: false as boolean,
            sort_order: 0,
        });

    const {
        data: editData,
        setData: setEditData,
        post: editPost,
        processing: editProcessing,
        errors: serverEditErrors,
        reset: editReset,
    } = useForm({
        photo: null as File | null,
        caption: "",
        type: "office",
        is_primary: false as boolean,
        sort_order: 0,
        _method: "PATCH",
    });

    const { clientErrors: addErrors, isValid: addIsValid } = usePhotoValidation(
        {
            photos: data.photos,
            caption: data.caption,
            type: data.type,
            is_primary: data.is_primary,
            sort_order: data.sort_order,
        }
    );

    const { clientErrors: editErrors, isValid: editIsValid } =
        usePhotoValidation({
            photo: editData.photo,
            caption: editData.caption,
            type: editData.type,
            is_primary: editData.is_primary,
            sort_order: editData.sort_order,
        });

    const { post: deletePost, processing: deleteProcessing } = useForm({
        _method: "DELETE",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Don't submit if validation fails
        if (!addIsValid) {
            return;
        }

        post(route("agency.settings.profile.photos.store"), {
            forceFormData: true,
            onSuccess: () => {
                setAddPhotoOpen(false);
                reset();
            },
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Don't submit if validation fails or no photo ID
        if (!editIsValid || !editPhotoId) {
            return;
        }

        editPost(route("agency.settings.profile.photos.update", editPhotoId), {
            forceFormData: true,
            onSuccess: () => {
                setEditPhotoId(null);
                editReset();
            },
        });
    };

    const handleDelete = () => {
        if (!deletePhotoId) return;

        deletePost(
            route("agency.settings.profile.photos.destroy", deletePhotoId),
            {
                onSuccess: () => {
                    setDeletePhotoId(null);
                },
            }
        );
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            setData("photos", selectedFiles);
        }
    };

    const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setEditData("photo", e.target.files[0]);
        }
    };

    const openEditModal = (photo: AgencyPhoto) => {
        setEditPhotoId(photo.id);
        setEditData({
            photo: null,
            caption: photo.caption || "",
            type: photo.type,
            is_primary: photo.is_primary,
            sort_order: photo.sort_order || 0,
            _method: "PATCH",
        });
    };

    const getPhotoTypeLabel = (type: string) => {
        const found = photoTypes.find((t) => t.value === type);
        return found ? found.label : "Unknown";
    };

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle className="text-xl font-semibold">
                        Agency Photos
                    </CardTitle>
                    <CardDescription>
                        Upload and manage photos of your agency
                    </CardDescription>
                    {/* Mobile: show button below description */}
                    <div className="mt-4 block sm:hidden">
                        <Button
                            onClick={() => setAddPhotoOpen(true)}
                            className="gap-2 w-full"
                        >
                            <ImagePlus className="h-4 w-4" />
                            Add Photos
                        </Button>
                    </div>
                </div>
                {/* Desktop: show button to the right */}
                <div className="hidden sm:block">
                    <Button
                        onClick={() => setAddPhotoOpen(true)}
                        className="gap-2"
                    >
                        <ImagePlus className="h-4 w-4" />
                        Add Photos
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {photos.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            No photos uploaded yet.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4 gap-2"
                            onClick={() => setAddPhotoOpen(true)}
                        >
                            <Plus className="h-4 w-4" />
                            Upload Your First Photo
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {photos.map((photo) => (
                            <div key={photo.id} className="relative group">
                                <div className="rounded-lg overflow-hidden border bg-card">
                                    <div className="aspect-video relative">
                                        <img
                                            src={
                                                photo.url
                                                    ? `/storage/${photo.url.replace(
                                                          /^\/?storage\//,
                                                          ""
                                                      )}`
                                                    : ""
                                            }
                                            alt={
                                                photo.caption || "Agency photo"
                                            }
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        {photo.is_primary && (
                                            <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 rounded-full px-2 py-1 text-xs flex items-center gap-1">
                                                <Star className="h-3 w-3" />
                                                Primary
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-8 w-8 p-0"
                                                onClick={() =>
                                                    openEditModal(photo)
                                                }
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="h-8 w-8 p-0"
                                                onClick={() =>
                                                    setDeletePhotoId(photo.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="text-xs font-medium bg-secondary text-secondary-foreground rounded-full px-2 py-1 inline-block mb-2">
                                            {getPhotoTypeLabel(photo.type)}
                                        </div>
                                        {photo.caption && (
                                            <p className="text-sm truncate">
                                                {photo.caption}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Add Photo Dialog */}
            <Dialog open={addPhotoOpen} onOpenChange={setAddPhotoOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Photos</DialogTitle>
                        <DialogDescription>
                            Upload photos for your agency. You can upload up to
                            5 photos at once.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="photos">Upload Photos</Label>
                            <Input
                                id="photos"
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                multiple
                                required
                                className={
                                    addErrors.photos || errors.photos
                                        ? "border-red-500"
                                        : ""
                                }
                            />
                            {addErrors.photos && (
                                <p className="text-red-500 text-sm mt-1">
                                    {addErrors.photos}
                                </p>
                            )}
                            {!addErrors.photos && errors.photos && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.photos}
                                </p>
                            )}
                            {progress && (
                                <progress
                                    value={progress.percentage}
                                    max="100"
                                    className="w-full h-2"
                                >
                                    {progress.percentage}%
                                </progress>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="caption">Caption</Label>
                            <Input
                                id="caption"
                                value={data.caption}
                                onChange={(e) =>
                                    setData("caption", e.target.value)
                                }
                                placeholder="Enter a caption for your photos"
                                className={
                                    addErrors.caption || errors.caption
                                        ? "border-red-500"
                                        : ""
                                }
                            />
                            {addErrors.caption && (
                                <p className="text-red-500 text-sm mt-1">
                                    {addErrors.caption}
                                </p>
                            )}
                            {!addErrors.caption && errors.caption && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.caption}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Photo Type</Label>
                            <Select
                                value={data.type}
                                onValueChange={(value) =>
                                    setData("type", value)
                                }
                            >
                                <SelectTrigger
                                    id="type"
                                    className={
                                        addErrors.type || errors.type
                                            ? "border-red-500"
                                            : ""
                                    }
                                >
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {photoTypes.map((type) => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {addErrors.type && (
                                <p className="text-red-500 text-sm mt-1">
                                    {addErrors.type}
                                </p>
                            )}
                            {!addErrors.type && errors.type && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.type}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="is_primary"
                                checked={data.is_primary}
                                onCheckedChange={(value) =>
                                    setData("is_primary", Boolean(value))
                                }
                            />
                            <Label
                                htmlFor="is_primary"
                                className="cursor-pointer"
                            >
                                Set as primary photo
                            </Label>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setAddPhotoOpen(false);
                                    reset();
                                }}
                                disabled={processing}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing || !addIsValid}
                            >
                                {processing && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Upload Photos
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Photo Dialog */}
            <Dialog
                open={editPhotoId !== null}
                onOpenChange={(open) => !open && setEditPhotoId(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Photo</DialogTitle>
                    </DialogHeader>

                    {editPhoto && (
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <div className="aspect-video rounded-lg overflow-hidden border">
                                    <img
                                        src={editPhoto.url}
                                        alt={
                                            editPhoto.caption || "Agency photo"
                                        }
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-photo">
                                    Replace Photo (Optional)
                                </Label>
                                <Input
                                    id="edit-photo"
                                    type="file"
                                    onChange={handleEditFileChange}
                                    accept="image/*"
                                    className={
                                        editErrors.photo ||
                                        serverEditErrors.photo
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {editErrors.photo && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {editErrors.photo}
                                    </p>
                                )}
                                {!editErrors.photo &&
                                    serverEditErrors.photo && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {serverEditErrors.photo}
                                        </p>
                                    )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-caption">Caption</Label>
                                <Input
                                    id="edit-caption"
                                    value={editData.caption}
                                    onChange={(e) =>
                                        setEditData("caption", e.target.value)
                                    }
                                    placeholder="Enter a caption for your photo"
                                    className={
                                        editErrors.caption ||
                                        serverEditErrors.caption
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {editErrors.caption && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {editErrors.caption}
                                    </p>
                                )}
                                {!editErrors.caption &&
                                    serverEditErrors.caption && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {serverEditErrors.caption}
                                        </p>
                                    )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-type">Photo Type</Label>
                                <Select
                                    value={editData.type}
                                    onValueChange={(value) =>
                                        setEditData("type", value)
                                    }
                                >
                                    <SelectTrigger
                                        id="edit-type"
                                        className={
                                            editErrors.type ||
                                            serverEditErrors.type
                                                ? "border-red-500"
                                                : ""
                                        }
                                    >
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {photoTypes.map((type) => (
                                            <SelectItem
                                                key={type.value}
                                                value={type.value}
                                            >
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editErrors.type && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {editErrors.type}
                                    </p>
                                )}
                                {!editErrors.type && serverEditErrors.type && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {serverEditErrors.type}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-sort-order">
                                    Sort Order
                                </Label>
                                <Input
                                    id="edit-sort-order"
                                    type="number"
                                    min="0"
                                    value={editData.sort_order}
                                    onChange={(e) =>
                                        setEditData(
                                            "sort_order",
                                            parseInt(e.target.value)
                                        )
                                    }
                                    className={
                                        editErrors.sort_order ||
                                        serverEditErrors.sort_order
                                            ? "border-red-500"
                                            : ""
                                    }
                                />
                                {editErrors.sort_order && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {editErrors.sort_order}
                                    </p>
                                )}
                                {!editErrors.sort_order &&
                                    serverEditErrors.sort_order && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {serverEditErrors.sort_order}
                                        </p>
                                    )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="edit-is-primary"
                                    checked={editData.is_primary}
                                    onCheckedChange={(value) =>
                                        setEditData(
                                            "is_primary",
                                            Boolean(value)
                                        )
                                    }
                                />
                                <Label
                                    htmlFor="edit-is-primary"
                                    className="cursor-pointer"
                                >
                                    Set as primary photo
                                </Label>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setEditPhotoId(null)}
                                    disabled={editProcessing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editProcessing || !editIsValid}
                                >
                                    {editProcessing && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Photo Dialog */}
            <Dialog
                open={deletePhotoId !== null}
                onOpenChange={(open) => !open && setDeletePhotoId(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete Photo</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this photo? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {deletePhoto && (
                        <div className="space-y-4">
                            <div className="aspect-video rounded-lg overflow-hidden border">
                                <img
                                    src={deletePhoto.url}
                                    alt={deletePhoto.caption || "Agency photo"}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setDeletePhotoId(null)}
                                    disabled={deleteProcessing}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={deleteProcessing}
                                >
                                    {deleteProcessing && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Delete Photo
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Card>
    );
}
