import { Card, CardContent } from "@/Components/ui/card";
import { AgencyDisplayData } from "./types";
import AgencyCardImage from "./CardImage";
import AgencyCardBadges from "./CardBadges";
import { Button } from "@/Components/ui/button";
import { ExternalLink, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompactCardProps {
    agencyData: AgencyDisplayData;
    highlightPremium?: boolean;
    highlightVerified?: boolean;
    highlightMaidCount?: boolean;
    highlightNew?: boolean;
}

export function CompactCard({
    agencyData,
    highlightPremium = false,
    highlightVerified = false,
    highlightMaidCount = false,
    highlightNew = false,
}: CompactCardProps) {
    const {
        id,
        name,
        mainPhoto,
        formattedAddress,
        maidsCount,
        isPremium,
        isVerified,
        website,
    } = agencyData;

    return (
        <Card className="overflow-hidden h-full flex flex-col transition-all hover:shadow-md">
            <AgencyCardImage
                mainPhoto={mainPhoto}
                name={name}
                isPremium={isPremium}
            />

            <AgencyCardBadges
                isPremium={isPremium && highlightPremium}
                isVerified={isVerified && highlightVerified}
                isNew={highlightNew}
                className="absolute top-2 right-2"
            />

            <CardContent className="p-3 pt-3 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="font-semibold text-base line-clamp-1 mb-1">
                        {name}
                    </h3>

                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                        {formattedAddress}
                    </p>

                    {/* Maid count display */}
                    <div
                        className={cn(
                            "text-xs flex items-center",
                            highlightMaidCount && maidsCount > 0
                                ? "text-primary font-medium"
                                : "text-muted-foreground"
                        )}
                    >
                        <Users className="h-3.5 w-3.5 mr-1" />
                        {maidsCount} {maidsCount === 1 ? "helper" : "helpers"}
                    </div>
                </div>

                <div className="mt-2 pt-2 border-t flex justify-between items-center">
                    <a href={route("browse.agencies.show", { id })}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-8"
                        >
                            View Details
                        </Button>
                    </a>

                    {website && (
                        <a
                            href={website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                        >
                            <ExternalLink className="h-4 w-4" />
                        </a>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
