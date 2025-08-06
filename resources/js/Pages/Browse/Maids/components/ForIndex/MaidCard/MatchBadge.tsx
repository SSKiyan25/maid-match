import { CheckCircle2, AlertCircle, PercentIcon } from "lucide-react";
import { Badge } from "@/Components/ui/badge";

interface MatchBadgeProps {
    percentage: number;
    compact?: boolean;
}

export function MatchBadge({ percentage, compact = false }: MatchBadgeProps) {
    // Get badge variant based on percentage
    const getVariant = (percent: number) => {
        if (percent >= 80) return "default";
        if (percent >= 60) return "secondary";
        return "outline";
    };

    // Choose icon based on percentage
    const MatchIcon = () => {
        if (percentage >= 80) return <CheckCircle2 className="h-3 w-3 mr-1" />;
        if (percentage >= 40) return <PercentIcon className="h-3 w-3 mr-1" />;
        return <AlertCircle className="h-3 w-3 mr-1" />;
    };

    return (
        <Badge
            className={`px-2 py-1 text-sm ${
                compact ? "font-bold" : "font-medium"
            }`}
            variant={getVariant(percentage)}
        >
            <MatchIcon />
            {percentage}% Match
        </Badge>
    );
}
