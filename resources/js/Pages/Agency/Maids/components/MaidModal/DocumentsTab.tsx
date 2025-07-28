import { Card, CardContent } from "@/Components/ui/card";
import { FileText, FileCheck, FileBadge, Eye, Download } from "lucide-react";

interface DocumentsTabProps {
    documents: Array<{
        type: string;
        title: string;
        description?: string;
        url: string;
    }>;
}

export default function DocumentsTab({ documents }: DocumentsTabProps) {
    return (
        <div className="p-6 pt-5 space-y-4">
            {documents.length > 0 ? (
                documents.map((doc, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex items-center gap-2 min-w-[90px]">
                                    {[
                                        "id",
                                        "passport",
                                        "medical",
                                        "police",
                                    ].includes(doc.type) ? (
                                        <FileCheck className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <FileBadge className="h-5 w-5 text-blue-500" />
                                    )}
                                    <span className="font-medium capitalize">
                                        {doc.type}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold">
                                        {doc.title}
                                    </div>
                                    {doc.description && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {doc.description}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-2 sm:mt-0">
                                    <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                                    >
                                        <Eye className="h-3.5 w-3.5 mr-1.5" />
                                        View
                                    </a>
                                    <a
                                        href={doc.url}
                                        download
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3"
                                    >
                                        <Download className="h-3.5 w-3.5 mr-1.5" />
                                        Download
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center py-8">
                    <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                    <p className="text-muted-foreground">
                        No documents uploaded
                    </p>
                </div>
            )}
        </div>
    );
}
