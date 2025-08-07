import { Card, CardContent } from "@/Components/ui/card";
import { AgencyDisplayData } from "./types";
import AgencyCardImage from "./CardImage";
import AgencyCardBadges from "./CardBadges";
import { Button } from "@/Components/ui/button";
import { ExternalLink, MapPin, Users, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface RegularCardProps {
    agencyData: AgencyDisplayData;
    featured?: boolean;
    highlightPremium?: boolean;
    highlightVerified?: boolean;
    highlightMaidCount?: boolean;
    highlightNew?: boolean;
}

export function RegularCard({
    agencyData,
    featured = false,
    highlightPremium = false,
    highlightVerified = false,
    highlightMaidCount = false,
    highlightNew = false,
}: RegularCardProps) {
    const {
        id,
        name,
        mainPhoto,
        description,
        formattedAddress,
        maidsCount,
        isPremium,
        isVerified,
        createdAt,
        website,
    } = agencyData;

    const cardClasses = cn(
        "overflow-hidden h-full flex flex-col transition-all duration-200",
        featured ? "hover:shadow-lg hover:-translate-y-1" : "hover:shadow-md"
    );

    const timeAgo = createdAt
        ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
        : "";

    return (
        <Card className={cardClasses}>
            <AgencyCardImage
                mainPhoto={mainPhoto}
                name={name}
                isPremium={isPremium}
                height="h-40"
            />

            <AgencyCardBadges
                isPremium={isPremium && highlightPremium}
                isVerified={isVerified && highlightVerified}
                isNew={highlightNew}
                className="absolute top-2 right-2"
            />

            <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{name}</h3>

                    <div className="space-y-2 mb-3">
                        {/* Location */}
                        <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                            <span className="line-clamp-1">
                                {formattedAddress}
                            </span>
                        </div>

                        {/* Maid count */}
                        <div
                            className={cn(
                                "flex items-center text-sm",
                                highlightMaidCount && maidsCount > 0
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground"
                            )}
                        >
                            <Users className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                            {maidsCount}{" "}
                            {maidsCount === 1 ? "helper" : "helpers"} available
                        </div>

                        {/* Created date */}
                        {timeAgo && (
                            <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarDays className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                Joined {timeAgo}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {description}
                        </p>
                    )}
                </div>

                <div className="mt-2 pt-2 border-t flex justify-between items-center">
                    <a href={route("browse.agencies.show", { id })}>
                        <Button variant="default" size="sm">
                            View Details
                        </Button>
                    </a>

                    {website && (
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                            title={website}
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
