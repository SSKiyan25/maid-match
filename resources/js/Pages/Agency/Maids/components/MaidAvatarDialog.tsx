import { useState, useRef } from "react";
import { Camera, ImageIcon, X, Upload } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from "@/Components/ui/dialog";
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from "@/Components/ui/tooltip";
import { router } from "@inertiajs/react";
import { MaidData } from "@/types";
import { toast } from "sonner";

interface MaidAvatarDialogProps {
    maid: MaidData;
}

export default function MaidAvatarDialog({ maid }: MaidAvatarDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };

            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!fileInputRef.current?.files?.length) return;

        const formData = new FormData();
        formData.append("avatar", fileInputRef.current.files[0]);

        setIsUploading(true);

        router.post(
            route("agency.maids.update-avatar", maid.maid.user.id),
            formData,
            {
                onSuccess: () => {
                    setIsOpen(false);
                    toast.success("Profile picture updated successfully!");
                    setImagePreview(null);
                    setIsUploading(false);
                },
                onError: () => {
                    setIsUploading(false);
                },
            }
        );
    };

    const handleReset = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="h-8 px-3 flex items-center gap-2 border-dashed"
                                aria-label="Change Profile Picture"
                                disabled={isUploading}
                            >
                                <Camera className="h-5 w-5 text-primary" />
                                <span className="text-xs text-primary font-medium">
                                    Change Photo
                                </span>
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p>Change Profile Picture</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Change Profile Picture</DialogTitle>
                    <DialogDescription>
                        Upload a new profile picture for{" "}
                        {maid.maid.user.profile.first_name}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center justify-center gap-4">
                        {/* Current image or preview */}
                        <div className="relative">
                            {imagePreview ? (
                                <div className="relative group">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-32 h-32 rounded-full object-cover border-2 border-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-sm"
                                        disabled={isUploading}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : maid.maid.user.avatar ? (
                                <div className="relative">
                                    <img
                                        src={`/storage/${maid.maid.user.avatar.replace(
                                            /^\/+/,
                                            ""
                                        )}`}
                                        alt="Current Avatar"
                                        className="w-32 h-32 rounded-full object-cover border-2 border-muted"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 rounded-full transition-opacity">
                                        <p className="text-white text-sm font-medium">
                                            Current Image
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-muted">
                                    {maid.maid.user.profile.first_name &&
                                    maid.maid.user.profile.last_name ? (
                                        <span className="text-2xl font-semibold text-muted-foreground">
                                            {maid.maid.user.profile.first_name.charAt(
                                                0
                                            )}
                                            {maid.maid.user.profile.last_name.charAt(
                                                0
                                            )}
                                        </span>
                                    ) : (
                                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                    )}
                                </div>
                            )}
                        </div>

                        {/* File Upload Area */}
                        <div className="w-full">
                            <label
                                htmlFor="avatar-upload"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer bg-primary/5 hover:bg-primary/10 transition-colors"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="h-6 w-6 text-primary mb-2" />
                                    <p className="mb-1 text-sm text-gray-700">
                                        <span className="font-semibold">
                                            Click to upload
                                        </span>{" "}
                                        or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, JPEG (MAX. 2MB)
                                    </p>
                                </div>
                                <input
                                    id="avatar-upload"
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    disabled={isUploading}
                                />
                            </label>
                        </div>
                    </div>

                    <DialogFooter className="flex sm:justify-between gap-2">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isUploading}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={!imagePreview || isUploading}
                            className="min-w-[120px]"
                        >
                            {isUploading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Uploading...
                                </>
                            ) : (
                                "Upload Image"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
