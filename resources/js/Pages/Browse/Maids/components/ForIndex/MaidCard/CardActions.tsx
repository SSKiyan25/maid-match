import { Button } from "@/Components/ui/button";
import { Link } from "@inertiajs/react";
import {
    ChevronRight,
    MoreHorizontal,
    Heart,
    MessageCircle,
    Share,
    ClockIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

interface CardActionsProps {
    maidId: string | number;
    jobId?: string | number;
    matchPercentage?: number;
    compact?: boolean;
}

export function CardActions({
    maidId,
    jobId,
    matchPercentage,
    compact = false,
}: CardActionsProps) {
    if (compact) {
        return (
            <Link
                href={route("browse.maids.show", maidId)}
                className="mt-auto pt-1"
            >
                <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-7 text-xs"
                >
                    View <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
            </Link>
        );
    }

    return (
        <div className="flex justify-between items-center w-full">
            <Link href={route("browse.maids.show", maidId)} className="flex-1">
                <Button size="sm" className="w-full">
                    View Profile
                </Button>
            </Link>

            {matchPercentage && jobId && (
                <Link
                    href={route("browse.maids.match-details", {
                        maidId: maidId,
                        jobId: jobId,
                    })}
                >
                    <Button size="sm" variant="outline" className="ml-2">
                        Match Details
                    </Button>
                </Link>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Heart className="mr-2 h-4 w-4" /> Add to Favorites
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <MessageCircle className="mr-2 h-4 w-4" /> Contact
                        Agency
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Share className="mr-2 h-4 w-4" /> Share Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <ClockIcon className="mr-2 h-4 w-4" /> View History
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
