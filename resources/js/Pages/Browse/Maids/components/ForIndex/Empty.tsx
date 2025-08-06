import { UserX } from "lucide-react";

interface EmptyProps {
    message: string;
}

export function Empty({ message }: EmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/30 rounded-xl border border-dashed">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <UserX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-1">{message}</h3>
            <p className="text-sm text-muted-foreground max-w-md">
                Try adjusting your search criteria or removing some filters to
                see more results.
            </p>
        </div>
    );
}
