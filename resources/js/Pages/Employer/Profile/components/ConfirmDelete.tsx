import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteProps {
    title?: string;
    description?: string;
    onConfirm: () => void;
    triggerLabel?: React.ReactNode;
    actionLabel?: React.ReactNode;
    cancelLabel?: React.ReactNode;
    destructive?: boolean;
    cancelDisabled: boolean;
    disabled?: boolean;
}

export default function ConfirmDelete({
    title = "Are you absolutely sure?",
    description = "This action cannot be undone.",
    onConfirm,
    triggerLabel = <Trash2 className="h-4 w-4" />,
    actionLabel = "Delete",
    cancelLabel = "Cancel",
    destructive = true,
    disabled = false,
    cancelDisabled = false,
}: ConfirmDeleteProps) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className={
                        destructive
                            ? "text-destructive hover:text-destructive"
                            : ""
                    }
                    disabled={disabled}
                >
                    {triggerLabel}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
                    <AlertDialogAction
                        className={
                            destructive
                                ? "bg-destructive text-white hover:bg-destructive/90"
                                : ""
                        }
                        onClick={onConfirm}
                    >
                        {actionLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
