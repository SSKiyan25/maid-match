import React from "react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardFooter } from "@/Components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Link } from "@inertiajs/react";
import {
    Calendar,
    Clock,
    File,
    MapPin,
    Star,
    Users,
    Wallet,
    Cake,
} from "lucide-react";
import { calculateAge } from "@/utils/useGeneralUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";

import MaidAvatarDialog from "./MaidAvatarDialog";
import MaidViewModal from "./MaidModal";
import MaidMoreActions from "./MaidMoreActions";

interface MaidCardProps {
    maid: any;
    onArchive: (id: number) => void;
}

export const ForwardedLink = React.forwardRef<
    HTMLAnchorElement,
    React.ComponentProps<typeof Link>
>((props, ref) => <Link ref={ref} {...props} />);
ForwardedLink.displayName = "ForwardedLink";

export default function MaidCard({ maid, onArchive }: MaidCardProps) {
    const fullName = `${maid.maid.user.profile.first_name} ${maid.maid.user.profile.last_name}`;
    const address = maid.maid.user.profile.address;
    const addressText = address
        ? `${address.city}, ${address.province}`
        : "No address";

    const age = calculateAge(maid.maid.user.profile.birth_date);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "bg-green-500/15 text-green-600 border-green-200";
            case "employed":
                return "bg-blue-500/15 text-blue-600 border-blue-200";
            case "unavailable":
                return "bg-red-500/15 text-red-600 border-red-200";
            default:
                return "bg-gray-500/15 text-gray-600 border-gray-200";
        }
    };

    // Format currency
    const formatCurrency = (amount: string) => {
        return new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP",
        }).format(parseFloat(amount));
    };

    return (
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-5 pt-5 flex-1">
                <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1 min-w-0">
                        {/* Avatar using ShadCN Avatar component */}
                        <Avatar className="w-12 h-12 flex-shrink-0">
                            <AvatarImage
                                src={
                                    maid.maid.user.avatar
                                        ? `/storage/${maid.maid.user.avatar}`
                                        : undefined
                                }
                                alt={fullName}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                                {fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:items-baseline sm:gap-2">
                                <h3 className="font-semibold text-lg truncate">
                                    {fullName}
                                </h3>
                                {age && (
                                    <div className="text-sm font-normal text-muted-foreground flex items-center">
                                        <Cake className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                        {age} years old
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{addressText}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 ml-2 flex-shrink-0">
                        <Badge
                            className={`${getStatusColor(
                                maid.maid.status
                            )} capitalize font-medium`}
                        >
                            {maid.maid.status}
                        </Badge>
                        {maid.is_premium && (
                            <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-600 border-amber-200"
                            >
                                <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                                Premium
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-4">
                    <div className="flex items-center text-sm">
                        <Wallet className="h-3.5 w-3.5 mr-2 text-primary/70 flex-shrink-0" />
                        <span className="truncate">
                            {formatCurrency(maid.maid.expected_salary)}/mo
                        </span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Clock className="h-3.5 w-3.5 mr-2 text-primary/70 flex-shrink-0" />
                        <span className="truncate">
                            {maid.maid.years_experience} years exp.
                        </span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Users className="h-3.5 w-3.5 mr-2 text-primary/70 flex-shrink-0" />
                        <span className="truncate">
                            {maid.maid.marital_status.charAt(0).toUpperCase() +
                                maid.maid.marital_status.slice(1)}
                            {maid.maid.has_children && ", has children"}
                        </span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Calendar className="h-3.5 w-3.5 mr-2 text-primary/70 flex-shrink-0" />
                        <span className="truncate">
                            Available:{" "}
                            {new Date(
                                maid.maid.earliest_start_date
                            ).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="mt-4">
                    <h4 className="text-sm font-medium mb-1.5">Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {maid.maid.skills
                            .slice(0, 5)
                            .map((skill: any, index: any) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs font-normal"
                                >
                                    {skill}
                                </Badge>
                            ))}
                        {maid.maid.skills.length > 5 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge
                                            variant="secondary"
                                            className="text-xs font-normal cursor-help"
                                        >
                                            +{maid.maid.skills.length - 5} more
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-xs">
                                            {maid.maid.skills
                                                .slice(5)
                                                .join(", ")}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>

                <div className="mt-3">
                    <h4 className="text-sm font-medium mb-1.5">Languages</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {maid.maid.languages
                            .slice(0, 3)
                            .map((language: any, index: any) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs font-normal capitalize"
                                >
                                    {language}
                                </Badge>
                            ))}
                        {maid.maid.languages.length > 3 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge
                                            variant="outline"
                                            className="text-xs font-normal cursor-help"
                                        >
                                            +{maid.maid.languages.length - 3}{" "}
                                            more
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-xs capitalize">
                                            {maid.maid.languages
                                                .slice(3)
                                                .join(", ")}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            </CardContent>

            <CardFooter className="flex justify-between items-center p-4 pt-2 border-t bg-muted/20">
                <div className="flex items-center gap-2">
                    {/*Change Avatar Dialog*/}
                    <MaidAvatarDialog maid={maid} />
                </div>

                <div className="flex items-center gap-2">
                    <MaidViewModal maid={maid} />

                    {/* Archive modal with dropdown menu */}
                    <MaidMoreActions
                        maidId={maid.id}
                        userId={maid.maid.user.id}
                        maidName={`${maid.maid.user.profile.first_name} ${maid.maid.user.profile.last_name}`}
                    />
                </div>
            </CardFooter>
        </Card>
    );
}
