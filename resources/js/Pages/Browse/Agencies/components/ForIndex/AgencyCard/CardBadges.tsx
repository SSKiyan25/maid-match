import { cn } from "@/lib/utils";
import { Badge } from "@/Components/ui/badge";
import { Award, CheckCircle, Clock } from "lucide-react";

interface CardBadgesProps {
    isPremium: boolean;
    isVerified: boolean;
    isNew: boolean;
    className?: string;
}

export default function AgencyCardBadges({
    isPremium,
    isVerified,
    isNew,
    className,
}: CardBadgesProps) {
    if (!isPremium && !isVerified && !isNew) {
        return null;
    }

    return (
        <div className={cn("flex flex-wrap gap-1", className)}>
            {isPremium && (
                <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200"
                >
                    <Award className="h-3 w-3 mr-1" />
                    Premium
                </Badge>
            )}
            {isVerified && (
                <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200"
                >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                </Badge>
            )}
            {isNew && (
                <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                >
                    <Clock className="h-3 w-3 mr-1" />
                    New
                </Badge>
            )}
        </div>
    );
}
