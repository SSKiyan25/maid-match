import { MapPin, Lock } from "lucide-react";
import { Badge } from "@/Components/ui/badge";

interface LocationDisplayProps {
    isPrivate: boolean;
    city: string | null;
    province: string | null;
    formattedLocation: string;
    compact?: boolean;
    showAsBadge?: boolean;
    isOverImage?: boolean;
}

export function LocationDisplay({
    isPrivate,
    city,
    province,
    formattedLocation,
    compact = false,
    showAsBadge = false,
    isOverImage = false,
}: LocationDisplayProps) {
    // Size adjustments based on compact mode
    const iconSize = compact ? "h-2.5 w-2.5" : "h-3 w-3";
    const textSize = compact ? "text-xs" : "text-sm";
    const textColor = isOverImage ? "text-white/90" : "text-muted-foreground";

    if (showAsBadge) {
        if (isPrivate) {
            return (
                <Badge
                    variant="outline"
                    className="bg-background/80 backdrop-blur-sm px-2 py-1 text-xs"
                >
                    <Lock className="h-3 w-3 mr-1" />
                    Private Address
                </Badge>
            );
        } else if (city || province) {
            return (
                <Badge
                    variant="secondary"
                    className="px-2 py-1 text-sm font-medium"
                >
                    <MapPin className="h-3 w-3 mr-1" />
                    {city || province}
                </Badge>
            );
        }
        return null;
    }

    const DisplayWrapper = ({ children }: { children: React.ReactNode }) => (
        <div className={`flex items-center ${textColor} ${textSize}`}>
            {children}
        </div>
    );

    if (isPrivate) {
        return (
            <DisplayWrapper>
                <Lock className={`${iconSize} mr-1 flex-shrink-0`} />
                <span className="truncate">Address is private</span>
            </DisplayWrapper>
        );
    } else if (city || province) {
        return (
            <DisplayWrapper>
                <MapPin className={`${iconSize} mr-1 flex-shrink-0`} />
                <span className="truncate">{formattedLocation}</span>
            </DisplayWrapper>
        );
    }

    return (
        <DisplayWrapper>
            <MapPin className={`${iconSize} mr-1 flex-shrink-0`} />
            <span className="truncate">Location not specified</span>
        </DisplayWrapper>
    );
}
