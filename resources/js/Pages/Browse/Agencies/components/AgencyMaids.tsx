import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Briefcase, Globe, MapPin, Star, Calendar } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import { getInitials } from "@/utils/useGeneralUtils";

export default function AgencyMaids({ maids }: any) {
    if (!maids || maids.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Available Maids</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                        No maids currently available from this agency.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">Available Maids</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {maids.map((agencyMaid: any) => {
                        const maid = agencyMaid.maid;
                        if (!maid) return null;

                        return (
                            <Card
                                key={agencyMaid.id}
                                className="overflow-hidden"
                            >
                                <div className="p-4 flex gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage
                                            src={
                                                maid.user?.avatar
                                                    ? `/storage/${maid.user.avatar}`
                                                    : undefined
                                            }
                                            alt={
                                                maid.user?.profile?.full_name ||
                                                maid.full_name
                                            }
                                        />
                                        <AvatarFallback>
                                            {getInitials(
                                                maid.user?.profile?.full_name ||
                                                    maid.full_name
                                            )}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-base truncate">
                                            {maid.user?.profile?.full_name ||
                                                maid.full_name}
                                        </h3>

                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {maid.nationality && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {maid.nationality}
                                                </Badge>
                                            )}

                                            {maid.years_experience > 0 && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {maid.years_experience}{" "}
                                                    {maid.years_experience === 1
                                                        ? "Year"
                                                        : "Years"}{" "}
                                                    Exp
                                                </Badge>
                                            )}

                                            {agencyMaid.is_premium && (
                                                <Badge className="text-xs bg-amber-500">
                                                    Premium
                                                </Badge>
                                            )}

                                            {agencyMaid.is_trained && (
                                                <Badge className="text-xs bg-green-600">
                                                    Trained
                                                </Badge>
                                            )}
                                        </div>

                                        {agencyMaid.formatted_agency_fee && (
                                            <p className="text-xs mt-1">
                                                Fee:{" "}
                                                {
                                                    agencyMaid.formatted_agency_fee
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="px-4 pb-4">
                                    {maid.skills && maid.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {maid.skills
                                                .slice(0, 3)
                                                .map(
                                                    (
                                                        skill: any,
                                                        index: number
                                                    ) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    )
                                                )}
                                            {maid.skills.length > 3 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    +{maid.skills.length - 3}{" "}
                                                    more
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        asChild
                                    >
                                        View Profile
                                    </Button>
                                    {/* Click to View Notice */}
                                    <div className="mt-3 text-xs text-primary font-medium flex items-center gap-1 justify-center">
                                        <span>
                                            Click to view the profile for this
                                            maid
                                        </span>
                                        <span aria-hidden>→</span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
