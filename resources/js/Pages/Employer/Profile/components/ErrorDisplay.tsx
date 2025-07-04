import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";

interface ErrorDisplayProps {
    errors: Record<string, string>;
    fieldName: string;
    className?: string;
}

export default function ErrorDisplay({
    errors,
    fieldName,
    className = "",
}: ErrorDisplayProps) {
    const error = errors[fieldName];

    if (!error) return null;

    return (
        <Alert variant="destructive" className={`mt-1 ${className}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
    );
}
