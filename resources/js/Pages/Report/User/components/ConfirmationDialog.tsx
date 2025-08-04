import React from "react";
import { Button } from "@/Components/ui/button";
import { Flag } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    userName: string;
    reportType: string;
    isProcessing: boolean;
}

export default function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    userName,
    reportType,
    isProcessing,
}: ConfirmationDialogProps) {
    const reportTypes = [
        { value: "harassment", label: "Harassment" },
        { value: "spam", label: "Spam or Scam" },
        { value: "inappropriate", label: "Inappropriate Content" },
        { value: "fraud", label: "Fraud" },
        { value: "impersonation", label: "Impersonation" },
        { value: "other", label: "Other Issue" },
    ];

    const reportTypeLabel =
        reportTypes.find((t) => t.value === reportType)?.label || reportType;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Report Submission</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to report this user? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4 bg-muted rounded-md">
                    <div className="font-medium">Report Details</div>
                    <div className="mt-2 space-y-1 text-sm">
                        <div>
                            <span className="text-muted-foreground">User:</span>{" "}
                            {userName}
                        </div>
                        <div>
                            <span className="text-muted-foreground">Type:</span>{" "}
                            {reportTypeLabel}
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="flex items-center"
                    >
                        <Flag className="mr-2 h-4 w-4" />
                        {isProcessing ? "Submitting..." : "Submit Report"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
