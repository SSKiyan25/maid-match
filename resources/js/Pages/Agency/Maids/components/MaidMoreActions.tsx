import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    AlertTriangle,
    Trash2,
    MoreVertical,
    Edit,
    FileText,
} from "lucide-react";
import { router } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";

interface MaidMoreActionsModalProps {
    maidId: number;
    userId?: number;
    maidName: string;
}

export default function MaidMoreActionsModal({
    maidId,
    userId,
    maidName,
}: MaidMoreActionsModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);

    const handleArchive = () => {
        setIsArchiving(true);
        router.patch(
            route("agency.maids.archive", userId),
            {},
            {
                onSuccess: () => {
                    setIsOpen(false);
                    setIsArchiving(false);
                },
                onError: () => {
                    setIsArchiving(false);
                },
            }
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <a
                            href={route("agency.maids.edit", maidId)}
                            onClick={(e) => {
                                e.preventDefault();
                                router.visit(
                                    route("agency.maids.edit", maidId)
                                );
                            }}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </a>
                    </DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                type="button"
                                className="w-full flex items-center px-2 py-1.5 text-sm cursor-pointer select-none rounded-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:outline-none"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Documents
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Feature Coming Soon
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    The "View Documents" feature will be
                                    available in a future update.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction>OK</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setIsOpen(true)}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Archive
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="space-y-3">
                        <div className="mx-auto bg-destructive/10 p-3 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                        <DialogTitle className="text-center text-xl">
                            Archive Maid Profile
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Are you sure you want to archive{" "}
                            <span className="font-semibold">{maidName}</span>?
                            <br />
                            This will hide the profile from your active roster,
                            but you can restore it later.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="sm:mr-2"
                            disabled={isArchiving}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleArchive}
                            disabled={isArchiving}
                        >
                            {isArchiving ? (
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
                                    Archiving...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Archive Profile
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
