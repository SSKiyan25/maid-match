import { useState } from "react";
import { UserPhoto } from "@/types";
import { Image, X } from "lucide-react";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { cn } from "@/lib/utils";

interface MaidPhotosProps {
    photos: UserPhoto[];
}

export default function MaidPhotos({ photos }: MaidPhotosProps) {
    const [selectedPhoto, setSelectedPhoto] = useState<UserPhoto | null>(null);

    // Filter out archived photos
    const activePhotos = photos?.filter((photo) => !photo.is_archived) || [];

    // Separate banner from gallery photos
    const bannerPhoto = activePhotos.find(
        (photo) =>
            photo.is_banner === true ||
            photo.is_banner === 1 ||
            photo.is_banner === "1"
    );

    const galleryPhotos = activePhotos.filter(
        (photo) =>
            !(
                photo.is_banner === true ||
                photo.is_banner === 1 ||
                photo.is_banner === "1"
            )
    );

    // Get URL for display
    const getPhotoUrl = (photoUrl: string) => {
        if (!photoUrl) return "/placeholder-image.jpg";
        if (photoUrl.startsWith("blob:")) return photoUrl;
        return `/storage/${photoUrl}`;
    };

    // Handle photo click to open the dialog
    const handlePhotoClick = (photo: UserPhoto) => {
        setSelectedPhoto(photo);
    };

    // If no photos available
    if (activePhotos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <Image className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                    No Photos Available
                </h3>
                <p className="text-muted-foreground max-w-md">
                    This maid hasn't added any photos to their profile yet.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Banner photo if available */}
            {bannerPhoto && (
                <div className="space-y-2">
                    <h3 className="text-base font-medium">Profile Banner</h3>
                    <div
                        className="relative cursor-pointer rounded-lg overflow-hidden"
                        onClick={() => handlePhotoClick(bannerPhoto)}
                    >
                        <img
                            src={getPhotoUrl(bannerPhoto.url)}
                            alt={bannerPhoto.caption || "Maid banner photo"}
                            className="w-full h-[200px] object-cover rounded-lg"
                            onError={(e) => {
                                e.currentTarget.src = "/placeholder-image.jpg";
                            }}
                        />
                        {bannerPhoto.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">
                                {bannerPhoto.caption}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Gallery photos */}
            <div className="space-y-2">
                <h3 className="text-base font-medium">Photo Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {galleryPhotos.map((photo) => (
                        <div
                            key={photo.id}
                            className="relative aspect-square cursor-pointer rounded-md overflow-hidden"
                            onClick={() => handlePhotoClick(photo)}
                        >
                            <img
                                src={getPhotoUrl(photo.url)}
                                alt={photo.caption || "Maid photo"}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "/placeholder-image.jpg";
                                }}
                            />
                            {photo.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                                    {photo.caption}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Full size photo dialog */}
            <Dialog
                open={!!selectedPhoto}
                onOpenChange={(open) => !open && setSelectedPhoto(null)}
            >
                <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black/90">
                    <button
                        onClick={() => setSelectedPhoto(null)}
                        className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="relative w-full max-h-[80vh] flex items-center justify-center">
                        <img
                            src={
                                selectedPhoto
                                    ? getPhotoUrl(selectedPhoto.url)
                                    : ""
                            }
                            alt={selectedPhoto?.caption || "Photo"}
                            className={cn(
                                "max-w-full max-h-[80vh] object-contain",
                                selectedPhoto?.type === "banner"
                                    ? "w-full"
                                    : "h-full"
                            )}
                        />
                    </div>

                    {selectedPhoto?.caption && (
                        <div className="p-4 bg-black text-white text-sm">
                            {selectedPhoto.caption}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
