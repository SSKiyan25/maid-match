import { useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { JobPosting } from "../../utils/types";
import { toast } from "sonner";

interface JobArchiveModalProps {
    job: JobPosting | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function JobArchiveModal({
    job,
    isOpen,
    onClose,
}: JobArchiveModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = () => {
        if (!job) return;
        setIsLoading(true);
        router.patch(
            route("employer.job-postings.archive", job.id),
            {},
            {
                onFinish: () => {
                    setIsLoading(false);
                    onClose();
                    toast.success("Job posting archived successfully.");
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Archive Job Posting</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to archive "{job?.title}"? This
                        will hide it from public view but you can restore it
                        later.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? "Archiving..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
