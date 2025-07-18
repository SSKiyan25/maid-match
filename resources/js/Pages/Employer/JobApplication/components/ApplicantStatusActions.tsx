import { Button } from "@/Components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Star, X, RotateCcw, UserCheck, Loader2 } from "lucide-react";
import { router } from "@inertiajs/react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ApplicantStatusActionsProps {
    applicationId: number;
    currentStatus: string;
    onStatusChange?: (applicationId: number, newStatus: string) => void;
    onClose: () => void;
}

export default function ApplicantStatusActions({
    applicationId,
    currentStatus,
    onStatusChange,
    onClose,
}: ApplicantStatusActionsProps) {
    const [isLoading, setIsLoading] = useState(false);

    // Handle status change
    const handleStatusChange = async (newStatus: string) => {
        setIsLoading(true);
        try {
            await router.patch(
                route("employer.job-applications.update-status", {
                    application: applicationId,
                }),
                { status: newStatus },
                {
                    onSuccess: () => {
                        toast.success(
                            `Application status changed to ${newStatus}`
                        );
                        if (onStatusChange) {
                            onStatusChange(applicationId, newStatus);
                        }
                        if (newStatus === "rejected") {
                            onClose();
                        }
                    },
                    onError: (errors: any) => {
                        toast.error(
                            `Failed to change status: ${
                                errors?.status || "Unknown error"
                            }`
                        );
                    },
                    onFinish: () => setIsLoading(false),
                    preserveScroll: true,
                }
            );
        } catch (error: any) {
            toast.error(
                `Failed to change status: ${
                    error.response?.data?.message || error.message
                }`
            );
            setIsLoading(false);
        }
    };

    // Submitting Modal
    if (isLoading) {
        return (
            <Dialog open={true}>
                <DialogContent className="flex flex-col items-center gap-4 py-10">
                    <VisuallyHidden>
                        <DialogTitle>Submitting Application</DialogTitle>
                        <DialogDescription>
                            Please wait while we process your request.
                        </DialogDescription>
                    </VisuallyHidden>
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    <div className="text-lg font-medium text-center">
                        Submitting your action...
                    </div>
                    <div className="text-sm text-muted-foreground text-center">
                        Please wait while we process your request.
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // Render status-appropriate actions
    switch (currentStatus) {
        case "pending":
            return (
                <>
                    <div className="flex gap-2 flex-grow w-full sm:w-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-auto"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusChange("rejected")}
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="flex-1 sm:flex-auto"
                            onClick={() => handleStatusChange("shortlisted")}
                            disabled={isLoading}
                        >
                            <Star className="h-4 w-4 mr-1" />
                            Shortlist
                        </Button>
                    </div>
                </>
            );

        case "shortlisted":
            return (
                <>
                    <div className="flex gap-2 p-2 w-full mb-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleStatusChange("rejected")}
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                        </Button>
                    </div>
                    <div className="flex gap-2 p-2 w-full">
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleStatusChange("pending")}
                            disabled={isLoading}
                        >
                            <RotateCcw className="h-4 w-4 mr-1" />
                            Move to Pending
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleStatusChange("hired")}
                            disabled={isLoading}
                        >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Hire
                        </Button>
                    </div>
                </>
            );

        case "hired":
            return (
                <div className="flex justify-end gap-2 w-full">
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Close
                    </Button>
                </div>
            );

        case "rejected":
            return (
                <div className="flex justify-between w-full">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange("pending")}
                        disabled={isLoading}
                    >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Reconsider
                    </Button>
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Close
                    </Button>
                </div>
            );

        case "withdrawn":
            return (
                <div className="flex justify-end gap-2 w-full">
                    <Button variant="outline" size="sm" onClick={onClose}>
                        Close
                    </Button>
                </div>
            );

        default:
            return (
                <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    onClick={onClose}
                >
                    Close
                </Button>
            );
    }
}
