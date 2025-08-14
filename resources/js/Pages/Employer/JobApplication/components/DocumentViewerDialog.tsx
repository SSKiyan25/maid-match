import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    FileText,
    ShieldCheck,
    X,
    FileIcon,
    Download,
    ExternalLink,
    Maximize2,
} from "lucide-react";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Alert, AlertTitle, AlertDescription } from "@/Components/ui/alert";
import { useState } from "react";
import DocumentPreviewModal from "./DocumenetPreviewModal";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function DocumentViewerDialog({
    open,
    onClose,
    documents,
    documentsByType,
    hasRequiredDocuments,
    missingDocuments,
    maidName,
    documentTypes,
    requiredDocuments,
}: {
    open: boolean;
    onClose: () => void;
    documents: any[];
    documentsByType: Record<string, any[]>;
    hasRequiredDocuments: boolean;
    missingDocuments: string[];
    maidName: string;
    documentTypes: Record<string, string>;
    requiredDocuments: Record<string, string>;
}) {
    const [expandedDoc, setExpandedDoc] = useState<null | {
        url: string;
        title: string;
    }>(null);

    const isMobile = useMediaQuery("(max-width: 640px)");

    const fixDocumentUrl = (url: string) => {
        if (!url) return "";
        // Remove double storage path if present
        return url.replace("/storage//storage/", "/storage/");
    };

    // Function to render the correct document preview
    const renderDocumentPreview = (doc: any) => {
        const url = fixDocumentUrl(doc.url);
        const isPdf = url.toLowerCase().endsWith(".pdf");
        const isImage = /\.(jpe?g|png|gif|bmp|webp)$/i.test(url);

        // Special handling for mobile devices
        if (isMobile) {
            return (
                <div className="relative h-[180px] w-full border rounded-md bg-muted/30 overflow-hidden">
                    <div className="absolute inset-0 flex mb-4 flex-col items-center justify-center p-3 text-center">
                        {isPdf ? (
                            <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                        ) : isImage ? (
                            <img
                                src={url}
                                alt={doc.title}
                                className="h-16 w-auto object-contain mb-2"
                            />
                        ) : (
                            <FileIcon className="h-10 w-10 text-muted-foreground mb-2" />
                        )}
                        <p className="text-sm font-medium mb-1">{doc.title}</p>
                        <p className="text-xs text-muted-foreground ">
                            {isPdf
                                ? "PDF Document"
                                : isImage
                                ? "Image"
                                : "File"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tap "Open" to view on your device
                        </p>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background to-transparent">
                        <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full"
                        >
                            <Button size="sm" className="w-full">
                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                Open{" "}
                                {isPdf ? "PDF" : isImage ? "Image" : "File"}
                            </Button>
                        </a>
                    </div>
                </div>
            );
        }

        // Desktop view remains the same as before
        if (isPdf) {
            return (
                <div className="relative h-[240px] w-full border rounded-md bg-muted/30 overflow-hidden">
                    {/* PDF thumbnail/preview */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-1">{doc.title}</p>
                        <p className="text-xs text-muted-foreground mb-4">
                            PDF Document
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background to-transparent flex justify-between">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                                setExpandedDoc({ url, title: doc.title })
                            }
                        >
                            <Maximize2 className="h-3.5 w-3.5 mr-1.5" />
                            Preview
                        </Button>
                        <a href={url} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="outline">
                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                                Open
                            </Button>
                        </a>
                    </div>
                </div>
            );
        } else if (isImage) {
            return (
                <div className="relative h-[240px] w-full border rounded-md bg-muted/10 overflow-hidden">
                    <div className="h-full w-full flex items-center justify-center p-2">
                        <img
                            src={url}
                            alt={doc.title}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Action buttons with gradient background */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background to-transparent flex justify-between">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                                setExpandedDoc({ url, title: doc.title })
                            }
                        >
                            <Maximize2 className="h-3.5 w-3.5 mr-1.5" />
                            View Full
                        </Button>
                        <a href={url} target="_blank" rel="noreferrer">
                            <Button size="sm" variant="outline">
                                <Download className="h-3.5 w-3.5 mr-1.5" />
                                Download
                            </Button>
                        </a>
                    </div>
                </div>
            );
        } else {
            // For other file types, show a download link
            return (
                <div className="flex flex-col items-center justify-center h-[200px] border rounded-md bg-muted/10">
                    <FileIcon className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-sm mb-4">{doc.title}</p>
                    <a href={url} download target="_blank" rel="noreferrer">
                        <Button size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download File
                        </Button>
                    </a>
                </div>
            );
        }
    };

    // Group documents by category for tabbed navigation
    const documentCategories = {
        identification: ["id", "passport"],
        qualification: ["resume", "certificate", "training"],
        medical: ["medical"],
        other: ["reference", "other"],
    };

    // Get documents for a category
    const getDocumentsForCategory = (category: string[]) => {
        return documents.filter((doc) => category.includes(doc.type));
    };

    // Check if a document type is required
    const isRequiredDocument = (type: string) => {
        return Object.keys(requiredDocuments).includes(type);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-5">
                    <DialogHeader className="pb-2">
                        <DialogTitle className="flex items-center text-xl">
                            <FileText className="h-5 w-5 mr-2" />
                            {maidName}'s Documents
                        </DialogTitle>
                        <DialogDescription>
                            Review all submitted documents for verification
                        </DialogDescription>
                    </DialogHeader>

                    {/* Document status summary */}
                    <div className="mb-4">
                        {hasRequiredDocuments ? (
                            <Alert
                                variant="default"
                                className="bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
                            >
                                <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                                <AlertTitle className="text-green-800 dark:text-green-300">
                                    Complete Documentation
                                </AlertTitle>
                                <AlertDescription className="text-green-700 dark:text-green-400">
                                    All required documents have been submitted.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert variant="destructive">
                                <X className="h-4 w-4" />
                                <AlertTitle>
                                    Incomplete Documentation
                                </AlertTitle>
                                <AlertDescription>
                                    Missing required documents:{" "}
                                    {missingDocuments.join(", ")}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Document tabs - using overflow-x-auto for horizontal scrolling on mobile */}
                    <div className="overflow-x-auto pb-1">
                        <Tabs defaultValue="all" className="w-full">
                            <TabsList className="mb-4">
                                <TabsTrigger value="all">
                                    All Documents ({documents.length})
                                </TabsTrigger>
                                <TabsTrigger value="identification">
                                    Identification
                                </TabsTrigger>
                                <TabsTrigger value="qualification">
                                    Qualifications
                                </TabsTrigger>
                                <TabsTrigger value="medical">
                                    Medical
                                </TabsTrigger>
                                <TabsTrigger value="other">Other</TabsTrigger>
                            </TabsList>

                            {/* Using the ScrollArea component instead of a div with scroll */}
                            <ScrollArea
                                className="h-[calc(90vh-340px)]"
                                type="always"
                            >
                                <div className="pr-4">
                                    {/* All documents tab */}
                                    <TabsContent value="all" className="mt-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {documents.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="space-y-2 border rounded-md p-3 bg-card"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium flex items-center text-sm">
                                                            {doc.title}
                                                            {isRequiredDocument(
                                                                doc.type
                                                            ) && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="ml-2 bg-primary/10 text-primary text-[10px]"
                                                                >
                                                                    Required
                                                                </Badge>
                                                            )}
                                                        </h3>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px]"
                                                        >
                                                            {doc.type_label ||
                                                                doc.type}
                                                        </Badge>
                                                    </div>
                                                    {renderDocumentPreview(doc)}
                                                    {doc.description && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {documents.length === 0 && (
                                            <div className="text-center py-12">
                                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-medium mb-1">
                                                    No Documents Available
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    This domestic helper hasn't
                                                    uploaded any documents yet.
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Identification documents tab */}
                                    <TabsContent
                                        value="identification"
                                        className="mt-0"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {getDocumentsForCategory(
                                                documentCategories.identification
                                            ).map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="space-y-2 border rounded-md p-3 bg-card"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium flex items-center text-sm">
                                                            {doc.title}
                                                            {isRequiredDocument(
                                                                doc.type
                                                            ) && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="ml-2 bg-primary/10 text-primary text-[10px]"
                                                                >
                                                                    Required
                                                                </Badge>
                                                            )}
                                                        </h3>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px]"
                                                        >
                                                            {doc.type_label ||
                                                                doc.type}
                                                        </Badge>
                                                    </div>
                                                    {renderDocumentPreview(doc)}
                                                    {doc.description && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {getDocumentsForCategory(
                                            documentCategories.identification
                                        ).length === 0 && (
                                            <div className="text-center py-12">
                                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-medium mb-1">
                                                    No Identification Documents
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    No identification documents
                                                    have been uploaded.
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Qualification documents tab */}
                                    <TabsContent
                                        value="qualification"
                                        className="mt-0"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {getDocumentsForCategory(
                                                documentCategories.qualification
                                            ).map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="space-y-2 border rounded-md p-3 bg-card"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium flex items-center text-sm">
                                                            {doc.title}
                                                            {isRequiredDocument(
                                                                doc.type
                                                            ) && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="ml-2 bg-primary/10 text-primary text-[10px]"
                                                                >
                                                                    Required
                                                                </Badge>
                                                            )}
                                                        </h3>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px]"
                                                        >
                                                            {doc.type_label ||
                                                                doc.type}
                                                        </Badge>
                                                    </div>
                                                    {renderDocumentPreview(doc)}
                                                    {doc.description && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {getDocumentsForCategory(
                                            documentCategories.qualification
                                        ).length === 0 && (
                                            <div className="text-center py-12">
                                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-medium mb-1">
                                                    No Qualification Documents
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    No qualification documents
                                                    have been uploaded.
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Medical documents tab */}
                                    <TabsContent
                                        value="medical"
                                        className="mt-0"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {getDocumentsForCategory(
                                                documentCategories.medical
                                            ).map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="space-y-2 border rounded-md p-3 bg-card"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium flex items-center text-sm">
                                                            {doc.title}
                                                            {isRequiredDocument(
                                                                doc.type
                                                            ) && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="ml-2 bg-primary/10 text-primary text-[10px]"
                                                                >
                                                                    Required
                                                                </Badge>
                                                            )}
                                                        </h3>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px]"
                                                        >
                                                            {doc.type_label ||
                                                                doc.type}
                                                        </Badge>
                                                    </div>
                                                    {renderDocumentPreview(doc)}
                                                    {doc.description && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {getDocumentsForCategory(
                                            documentCategories.medical
                                        ).length === 0 && (
                                            <div className="text-center py-12">
                                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-medium mb-1">
                                                    No Medical Documents
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    No medical documents have
                                                    been uploaded.
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    {/* Other documents tab */}
                                    <TabsContent value="other" className="mt-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {getDocumentsForCategory(
                                                documentCategories.other
                                            ).map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="space-y-2 border rounded-md p-3 bg-card"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="font-medium flex items-center text-sm">
                                                            {doc.title}
                                                            {isRequiredDocument(
                                                                doc.type
                                                            ) && (
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="ml-2 bg-primary/10 text-primary text-[10px]"
                                                                >
                                                                    Required
                                                                </Badge>
                                                            )}
                                                        </h3>
                                                        <Badge
                                                            variant="outline"
                                                            className="text-[10px]"
                                                        >
                                                            {doc.type_label ||
                                                                doc.type}
                                                        </Badge>
                                                    </div>
                                                    {renderDocumentPreview(doc)}
                                                    {doc.description && (
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {getDocumentsForCategory(
                                            documentCategories.other
                                        ).length === 0 && (
                                            <div className="text-center py-12">
                                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-medium mb-1">
                                                    No Other Documents
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    No other documents have been
                                                    uploaded.
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>
                                </div>
                            </ScrollArea>
                        </Tabs>
                    </div>

                    {/* Close button */}
                    <div className="mt-4 flex justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Document preview modal */}
            {!isMobile && (
                <DocumentPreviewModal
                    expandedDoc={expandedDoc}
                    onClose={() => setExpandedDoc(null)}
                />
            )}
        </>
    );
}
