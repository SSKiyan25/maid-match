import { Card, CardContent } from "@/Components/ui/card";
import { User } from "lucide-react";

interface EmptyStateProps {
    hasApplicants: boolean;
}

export default function EmptyState({ hasApplicants }: EmptyStateProps) {
    return (
        <Card className="border border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-8">
                <div className="rounded-full bg-muted p-3 mb-3">
                    <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                    No hired applicants found
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                    {hasApplicants
                        ? "Try changing your search criteria or filter selection."
                        : "When you hire applicants, they will appear here."}
                </p>
            </CardContent>
        </Card>
    );
}
