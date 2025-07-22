import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ExternalLink, FileText } from "lucide-react";

export default function MaidDocuments({ documents }: any) {
    if (!documents || documents.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Documents</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                        No documents available.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Documents</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {documents.map((doc: any) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                        >
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{doc.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {doc.type_label || doc.type}
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => window.open(doc.url, "_blank")}
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>View</span>
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
