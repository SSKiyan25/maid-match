import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { PencilLine, Loader2 } from "lucide-react";
import { router } from "@inertiajs/react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
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
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ActionMenuProps {
    applicationId: number;
    maidName: string;
}

export default function ActionMenu({
    applicationId,
    maidName,
}: ActionMenuProps) {
    const [showActions, setShowActions] = useState(false);
    const [showHireConfirmation, setShowHireConfirmation] = useState(false);
    const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Backend action: Mark as Hired
    const handleMarkAsHired = () => {
        setIsLoading(true);
        router.post(
            route("agency.applications.markAsHired", applicationId),
            {},
            {
                onSuccess: () => {
                    setIsLoading(false);
                    setShowHireConfirmation(false);
                    setShowActions(false);
                },
                onFinish: () => setIsLoading(false),
            }
        );
    };

    // Backend action: Cancel Application
    const handleCancelApplication = () => {
        setIsLoading(true);
        router.post(
            route("agency.applications.cancel", applicationId),
            {},
            {
                onSuccess: () => {
                    setIsLoading(false);
                    setShowCancelConfirmation(false);
                    setShowActions(false);
                },
                onFinish: () => setIsLoading(false),
            }
        );
    };

    // Loading Dialog
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

    return (
        <>
            <Popover open={showActions} onOpenChange={setShowActions}>
                <PopoverTrigger asChild>
                    <Button
                        variant="default"
                        size="sm"
                        className="flex-1 text-xs opacity-90 hover:bg-primary"
                    >
                        <PencilLine className="h-3.5 w-3.5 mr-1.5" />
                        Actions
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0 shadow-lg" align="end">
                    <div className="py-1 px-1 border-b border-secondary">
                        <p className="text-xs text-muted-foreground px-2 py-1.5">
                            Application Actions
                        </p>
                    </div>
                    <div className="py-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm h-9 font-semibold text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => {
                                setShowActions(false);
                                setShowHireConfirmation(true);
                            }}
                        >
                            <span className="w-4 h-4 mr-2 flex items-center justify-center">
                                ✓
                            </span>
                            Mark as Hired
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-sm h-9 font-semibold text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                                setShowActions(false);
                                setShowCancelConfirmation(true);
                            }}
                        >
                            <span className="w-4 h-4 mr-2 flex items-center justify-center">
                                ✕
                            </span>
                            Cancel Application
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {/* Hire Confirmation Dialog */}
            <AlertDialog
                open={showHireConfirmation}
                onOpenChange={setShowHireConfirmation}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Mark as Hired</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to mark {maidName} as hired?
                            This will change the maid's status to "employed".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleMarkAsHired}
                        >
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Confirmation Dialog */}
            <AlertDialog
                open={showCancelConfirmation}
                onOpenChange={setShowCancelConfirmation}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Application</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to cancel this application?
                            This will remove the application and set {maidName}
                            's status back to "available".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>No, keep it</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleCancelApplication}
                        >
                            Yes, cancel it
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
