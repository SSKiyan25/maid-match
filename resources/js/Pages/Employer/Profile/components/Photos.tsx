import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Image, Upload, Trash2, Pencil, Star } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { UserPhoto } from "@/types";
import { usePhotoManagement } from "@/hooks/usePhotoManagement";
import axios from "axios";
import { toast } from "sonner";

interface PhotosComponentProps {
    photos: UserPhoto[];
    userId: number;
}

export default function PhotosComponent({
    photos: initialPhotos,
    userId,
}: PhotosComponentProps) {
    const {
        photos,
        setPhotos,
        bannerPhoto,
        isUploading,
        showPhotoDialog,
        setShowPhotoDialog,
        editingPhoto,
        previewUrl,
        uploadData,
        openAddPhotoDialog,
        openEditPhotoDialog,
        handleFileChange,
        handleInputChange,
        handleCheckboxChange,
        handleSubmit,
        handleDeletePhoto,
        setAsBanner,
    } = usePhotoManagement({ initialPhotos, userId });

    // States for better mobile UX
    const [activePhotoId, setActivePhotoId] = useState<number | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
    // Track whether we're in banner context for the upload dialog
    const [isBannerContext, setIsBannerContext] = useState(false);

    // Toggle photo actions visibility
    const togglePhotoActions = (photoId: number) => {
        setActivePhotoId(activePhotoId === photoId ? null : photoId);
    };

    // Open delete confirmation dialog
    const confirmDelete = (photoId: number, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setPhotoToDelete(photoId);
        setShowDeleteDialog(true);
    };

    // Execute photo deletion after confirmation
    const executeDelete = () => {
        if (photoToDelete !== null) {
            handleDeletePhoto(photoToDelete);
            setPhotoToDelete(null);
            setShowDeleteDialog(false);
        }
    };

    // Helper function to determine the correct image URL
    const getImageUrl = (photoUrl: string) => {
        // Check if this is a blob URL (starts with blob:)
        if (photoUrl.startsWith("blob:")) {
            return photoUrl; // Use blob URL directly
        }
        // Regular URL from storage
        return `/storage/${photoUrl}`;
    };

    // Enhanced openAddPhotoDialog to track context
    const handleOpenAddPhotoDialog = (forBanner = false) => {
        setIsBannerContext(forBanner);
        openAddPhotoDialog(forBanner);
    };

    // Enhanced openEditPhotoDialog to track context
    const handleOpenEditPhotoDialog = (photo: UserPhoto) => {
        setIsBannerContext(
            Boolean(
                photo.is_banner === true ||
                    photo.is_banner === 1 ||
                    photo.is_banner === "1"
            )
        );
        openEditPhotoDialog(photo);
    };

    const galleryPhotoCount = photos.filter(
        (photo) => !photo.is_banner && !photo.is_archived
    ).length;

    const refreshPhotos = async () => {
        try {
            const response = await axios.get(`/user-photos?user_id=${userId}`);
            if (response.data.success) {
                setPhotos(response.data.photos);
                toast.success("Photos refreshed");
            }
        } catch (error) {
            console.error("Failed to refresh photos:", error);
            toast.error("Failed to refresh photos");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Photos
                </CardTitle>
                <CardDescription>
                    <div className="flex flex-col items-start sm:flex-row  sm:items-center justify-between">
                        <span>
                            Click on a photo to manage it. Use the buttons below
                            to edit or remove photos.
                        </span>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={refreshPhotos}
                            className="text-xs ml-0 mt-4 sm:mt-0 sm:ml-4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-1"
                            >
                                <path d="M21 2v6h-6"></path>
                                <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                                <path d="M3 22v-6h6"></path>
                                <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                            </svg>
                            Refresh Photos
                        </Button>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Banner Photo Section */}
                <div>
                    <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                        <Image className="h-4 w-4 text-primary/70" />
                        Profile Banner
                    </h3>

                    <div className="border rounded-lg p-4 bg-muted/30">
                        {bannerPhoto ? (
                            <div
                                className="relative cursor-pointer"
                                onClick={() =>
                                    togglePhotoActions(bannerPhoto.id)
                                }
                            >
                                <img
                                    src={getImageUrl(bannerPhoto.url)}
                                    alt={
                                        bannerPhoto.caption || "Profile Banner"
                                    }
                                    className="w-full h-[200px] object-cover rounded-md"
                                    onError={(e) => {
                                        console.error(
                                            "Failed to load banner image:",
                                            bannerPhoto.url
                                        );
                                        e.currentTarget.src =
                                            "/placeholder-image.jpg"; // Fallback image
                                    }}
                                />
                                {bannerPhoto.caption && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                                        {bannerPhoto.caption}
                                    </div>
                                )}
                                {activePhotoId === bannerPhoto.id && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenEditPhotoDialog(
                                                        bannerPhoto
                                                    );
                                                    setActivePhotoId(null);
                                                }}
                                            >
                                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={(e) =>
                                                    confirmDelete(
                                                        bannerPhoto.id,
                                                        e
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[200px] border-2 border-dashed rounded-md p-4 text-center">
                                <Image className="h-10 w-10 text-muted-foreground/50 mb-2" />
                                <p className="text-muted-foreground mb-2">
                                    No banner photo uploaded
                                </p>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() =>
                                        handleOpenAddPhotoDialog(true)
                                    }
                                >
                                    <Upload className="h-3.5 w-3.5 mr-1" />
                                    Upload Banner
                                </Button>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                            Recommended size: 1200 x 400 pixels. Max file size:
                            2MB
                        </p>
                    </div>
                </div>

                {/* Gallery Photos Section */}
                <div>
                    <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                        <Image className="h-4 w-4 text-primary/70" />
                        Photo Gallery ({galleryPhotoCount}/6)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Actual photos */}
                        {photos
                            .filter(
                                (photo) =>
                                    !photo.is_banner && !photo.is_archived
                            )
                            .map((photo) => (
                                <div
                                    key={photo.id}
                                    className="relative aspect-square cursor-pointer"
                                    onClick={() => togglePhotoActions(photo.id)}
                                >
                                    <img
                                        src={getImageUrl(photo.url)}
                                        alt={photo.caption || `Gallery photo`}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                    {photo.caption && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                                            {photo.caption}
                                        </div>
                                    )}
                                    {activePhotoId === photo.id && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                            <div className="flex flex-col gap-2 w-full px-4">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenEditPhotoDialog(
                                                                photo
                                                            );
                                                            setActivePhotoId(
                                                                null
                                                            );
                                                        }}
                                                    >
                                                        <Pencil className="h-3.5 w-3.5 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={(e) =>
                                                            confirmDelete(
                                                                photo.id,
                                                                e
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}

                        {/* Upload new photo placeholder */}
                        {galleryPhotoCount < 6 && (
                            <div
                                className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                onClick={() => handleOpenAddPhotoDialog(false)}
                            >
                                <Upload className="h-8 w-8 text-muted-foreground/50 mb-2" />
                                <p className="text-muted-foreground text-sm mb-2">
                                    Add photo
                                </p>
                                <Button size="sm" variant="outline">
                                    Upload
                                </Button>
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-3">
                        Upload up to 6 photos. Max file size: 2MB per photo.
                        {galleryPhotoCount >= 6 && (
                            <span className="text-amber-600 ml-1">
                                You've reached the maximum of 6 photos. Delete
                                some to add more.
                            </span>
                        )}
                    </p>
                </div>

                {/* Photo Upload/Edit Dialog */}
                <Dialog
                    open={showPhotoDialog}
                    onOpenChange={setShowPhotoDialog}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingPhoto
                                    ? isBannerContext
                                        ? "Edit Banner Photo"
                                        : "Edit Gallery Photo"
                                    : isBannerContext
                                    ? "Upload Banner Photo"
                                    : "Upload Gallery Photo"}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Photo Preview */}
                            <div className="border rounded-md overflow-hidden">
                                {previewUrl ? (
                                    <div className="relative aspect-square">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center aspect-square bg-muted/50">
                                        <Upload className="h-10 w-10 text-muted-foreground/50" />
                                    </div>
                                )}
                            </div>

                            {/* File Input */}
                            <div className="space-y-2">
                                <Label htmlFor="photo-upload">
                                    Select Photo
                                </Label>
                                <Input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="cursor-pointer"
                                />
                            </div>

                            {/* Caption */}
                            <div className="space-y-2">
                                <Label htmlFor="caption">
                                    Caption (optional)
                                </Label>
                                <Textarea
                                    id="caption"
                                    name="caption"
                                    placeholder="Add a description for this photo"
                                    value={uploadData.caption}
                                    onChange={handleInputChange}
                                    rows={2}
                                />
                            </div>

                            {/* Is Banner Checkbox - Only show if explicitly in banner context */}
                            {isBannerContext && (
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_banner"
                                        name="is_banner"
                                        checked={uploadData.is_banner}
                                        onChange={handleCheckboxChange}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <Label
                                        htmlFor="is_banner"
                                        className="cursor-pointer"
                                    >
                                        Set as banner photo
                                    </Label>
                                </div>
                            )}

                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowPhotoDialog(false)}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        isUploading ||
                                        (!uploadData.url && !editingPhoto)
                                    }
                                >
                                    {isUploading ? (
                                        <span className="flex items-center">
                                            <span className="animate-spin mr-1">
                                                ◌
                                            </span>
                                            Uploading...
                                        </span>
                                    ) : editingPhoto ? (
                                        "Save Changes"
                                    ) : (
                                        "Upload Photo"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <AlertDialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the photo from your profile.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => {
                                    setShowDeleteDialog(false);
                                    setPhotoToDelete(null);
                                }}
                            >
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={executeDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
