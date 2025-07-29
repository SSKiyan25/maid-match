import { useState } from "react";
import { UserPhoto } from "@/types";
import { toast } from "sonner";
import axios from "axios";

interface UploadData {
    user_id: number;
    url: File | null;
    caption: string;
    type: "banner" | "gallery" | "other";
    is_banner: boolean;
}

interface UsePhotoManagementProps {
    initialPhotos: UserPhoto[];
    userId: number;
}

export function usePhotoManagement({
    initialPhotos,
    userId,
}: UsePhotoManagementProps) {
    const [photos, setPhotos] = useState<UserPhoto[]>(
        Array.isArray(initialPhotos) ? initialPhotos : []
    );
    const [isUploading, setIsUploading] = useState(false);
    const [showPhotoDialog, setShowPhotoDialog] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<UserPhoto | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadData, setUploadData] = useState<UploadData>({
        user_id: userId,
        url: null,
        caption: "",
        type: "gallery",
        is_banner: false,
    });

    // Get the banner photo, if any
    const bannerPhoto =
        photos?.find(
            (photo) =>
                photo?.is_banner === true ||
                photo?.is_banner === 1 ||
                photo?.is_banner === "1"
        ) || null;

    // Function to open the add photo dialog
    const openAddPhotoDialog = (forBanner = false) => {
        // Check if we've reached the gallery photo limit (6)
        if (!forBanner) {
            const galleryPhotoCount = photos.filter(
                (photo) => !photo.is_banner && !photo.is_archived
            ).length;

            if (galleryPhotoCount >= 6) {
                toast.error(
                    "You've reached the maximum of 6 gallery photos. Delete some to add more."
                );
                return;
            }
        }

        setUploadData({
            user_id: userId,
            url: null,
            caption: "",
            type: forBanner ? "banner" : "gallery",
            is_banner: forBanner,
        });
        setEditingPhoto(null);
        setPreviewUrl(null);
        setShowPhotoDialog(true);
    };

    // Function to open the edit photo dialog
    const openEditPhotoDialog = (photo: UserPhoto) => {
        setUploadData({
            user_id: userId,
            url: null,
            caption: photo.caption || "",
            type: photo.type,
            is_banner:
                photo.is_banner === true ||
                photo.is_banner === 1 ||
                photo.is_banner === "1",
        });
        setEditingPhoto(photo);

        setPreviewUrl(
            photo.url.startsWith("blob:") ? photo.url : `/storage/${photo.url}`
        );

        setShowPhotoDialog(true);
    };

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setUploadData({ ...uploadData, url: file });

            // Create a preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form field changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setUploadData({ ...uploadData, [name]: value });
    };

    // Handle checkbox changes
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setUploadData({ ...uploadData, [name]: checked });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        // Create FormData
        const formData = new FormData();
        formData.append("user_id", uploadData.user_id.toString());

        // Only append URL if a new file is selected
        if (uploadData.url) {
            formData.append("url", uploadData.url);
        }

        formData.append("caption", uploadData.caption || "");
        formData.append("type", uploadData.type);
        formData.append("is_banner", uploadData.is_banner ? "1" : "0");

        try {
            if (editingPhoto) {
                // Update existing photo with axios
                const response = await axios.post(
                    `/user-photos/${editingPhoto.id}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            "X-HTTP-Method-Override": "PUT",
                        },
                    }
                );

                if (response.data.success) {
                    // Get the updated photo from the response
                    const updatedPhoto = response.data.photo;

                    setPhotos((prevPhotos) =>
                        prevPhotos.map((p) =>
                            p.id === editingPhoto.id
                                ? {
                                      ...updatedPhoto,
                                      // Use blob URL for new uploads or keep the server path
                                      url: uploadData.url
                                          ? URL.createObjectURL(uploadData.url)
                                          : updatedPhoto.url,
                                  }
                                : uploadData.is_banner
                                ? { ...p, is_banner: false }
                                : p
                        )
                    );

                    setShowPhotoDialog(false);
                    toast.success(
                        "Photo updated successfully, , click the refresh button to see the changes."
                    );
                }
            } else {
                // Add new photo with axios
                const response = await axios.post("/user-photos", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.data.success) {
                    const newPhoto = response.data.photo;

                    // Add the new photo to state
                    setPhotos((prevPhotos) => {
                        // Remove any temporary blob photos
                        const filtered = prevPhotos.filter(
                            (p) => !p.url.startsWith("blob:")
                        );
                        // Add the real photo from the server
                        const photoWithLocalUrl = {
                            ...newPhoto,
                            // Create a local blob URL for immediate display
                            url: uploadData.url
                                ? URL.createObjectURL(uploadData.url)
                                : newPhoto.url,
                        };

                        // If this is a banner, update other photos
                        const updatedPhotos = uploadData.is_banner
                            ? filtered.map((p) => ({ ...p, is_banner: false }))
                            : filtered;
                        return [...updatedPhotos, photoWithLocalUrl];
                    });

                    setShowPhotoDialog(false);
                    toast.success(
                        "Photo added successfully, click the refresh button to see the changes."
                    );
                }
            }
        } catch (error) {
            console.error("Photo operation error:", error);
            toast.error(
                editingPhoto ? "Failed to update photo" : "Failed to add photo"
            );
        } finally {
            setIsUploading(false);
        }
    };

    // Handle photo deletion
    const handleDeletePhoto = async (photoId: number) => {
        // Check if this is a temporary photo (client-side only, not yet saved to server)
        const photoToDelete = photos.find((p) => p.id === photoId);

        if (!photoToDelete) {
            console.error(`Photo with ID ${photoId} not found`);
            return;
        }

        // If URL starts with blob, it's a temporary photo that only exists client-side
        if (photoToDelete.url.startsWith("blob:")) {
            // Remove it from local state without server request
            setPhotos((prevPhotos) =>
                prevPhotos.filter((p) => p.id !== photoId)
            );
            toast.success("Photo removed");
            return;
        }

        // For server-stored photos, proceed with deletion request using axios
        try {
            const response = await axios.delete(`/user-photos/${photoId}`);

            if (response.data.success) {
                // Update local state to remove the photo
                setPhotos((prevPhotos) =>
                    prevPhotos.filter((p) => p.id !== photoId)
                );
                toast.success("Photo deleted successfully");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete photo");
        }
    };

    // Set a photo as banner
    const setAsBanner = async (photoId: number) => {
        const formData = new FormData();
        formData.append("user_id", userId.toString());
        formData.append("is_banner", "1");

        try {
            const response = await axios.post(
                `/user-photos/${photoId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "X-HTTP-Method-Override": "PUT",
                    },
                }
            );

            if (response.data.success) {
                // Update local state - set this photo as banner, remove banner flag from others
                setPhotos((prevPhotos) =>
                    prevPhotos.map((p) => ({
                        ...p,
                        is_banner: p.id === photoId,
                    }))
                );
                toast.success("Banner photo updated");
            }
        } catch (error) {
            console.error("Set banner error:", error);
            toast.error("Failed to set banner photo");
        }
    };

    return {
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
    };
}
