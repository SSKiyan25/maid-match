import { Link } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { getInitials } from "@/utils/useGeneralUtils";
import {
    Award,
    Calendar,
    Clock,
    MapPin,
    ArrowUpRight,
    Building2,
} from "lucide-react";
import { format } from "date-fns";

interface HiredApplicantCardProps {
    applicant: any;
    onViewDetails: (applicant: any) => void;
}

export default function HiredApplicantCard({
    applicant,
    onViewDetails,
}: HiredApplicantCardProps) {
    const maid = applicant.application.maid;
    const user = maid.user;
    const hiredDate = new Date(applicant.hired_at);

    return (
        <Card className="border overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <Badge className="mb-2">{applicant.job_title}</Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                        <Clock className="h-3 w-3 mr-1" />
                        Hired {format(hiredDate, "MMM d, yyyy")}
                    </Badge>
                </div>
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage
                            src={
                                user.avatar
                                    ? `/storage/${user.avatar}`
                                    : undefined
                            }
                            alt={maid.full_name}
                        />
                        <AvatarFallback>
                            {getInitials(maid.full_name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-base">
                            {maid.full_name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {maid.nationality || "Nationality not specified"}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="capitalize">
                            {maid.experience_level || "Not specified"}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                            {maid.years_experience > 0
                                ? `${maid.years_experience} ${
                                      maid.years_experience === 1
                                          ? "year"
                                          : "years"
                                  }`
                                : "New"}
                        </span>
                    </div>
                </div>

                {/* Agency Tag if applicable */}
                {maid.agency && (
                    <div className="mt-3 flex items-center p-2 bg-muted rounded-md">
                        <Building2 className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm">{maid.agency_name}</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex gap-2 pt-0">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onViewDetails(applicant)}
                >
                    View Details
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 flex items-center"
                    asChild
                >
                    <Link href={route("browse.maids.show", maid.id)}>
                        Profile
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
