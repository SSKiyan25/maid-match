import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { X, ExternalLink, AlertCircle } from "lucide-react";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";

type DocumentPreviewProps = {
    expandedDoc: { url: string; title: string } | null;
    onClose: () => void;
};

export default function DocumentPreviewModal({
    expandedDoc,
    onClose,
}: DocumentPreviewProps) {
    if (!expandedDoc) return null;

    const url = expandedDoc.url.replace("/storage//storage/", "/storage/");
    const isPdf = url.toLowerCase().endsWith(".pdf");
    const isMobile = useMediaQuery("(max-width: 640px)");

    // For mobile devices, we'll use browser's native viewers
    if (isMobile) {
        window.open(url, "_blank");
        // Close this modal since we're opening in browser
        setTimeout(onClose, 100);
        return null;
    }

    return (
        <Dialog open={!!expandedDoc} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl w-[95vw] min-h-full p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>{expandedDoc.title}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col h-full">
                    {/* Header with title and close button */}
                    <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-medium">{expandedDoc.title}</h3>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>

                    {/* Document viewer area */}
                    <div
                        className="flex-1 overflow-hidden bg-muted"
                        style={{ height: "calc(95vh - 120px)" }}
                    >
                        {isPdf ? (
                            <iframe
                                src={`${url}#view=FitH`}
                                className="w-full h-full"
                                title={expandedDoc.title}
                                style={{ border: 0 }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center p-4 bg-black/10 dark:bg-black/30">
                                <img
                                    src={url}
                                    alt={expandedDoc.title}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer with action buttons */}
                    <div className="p-4 border-t flex justify-between items-center">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block"
                        >
                            <Button variant="default">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open in New Tab
                            </Button>
                        </a>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
