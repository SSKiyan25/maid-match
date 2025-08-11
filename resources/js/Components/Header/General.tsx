import { SidebarTrigger } from "@/Components/ui/sidebar";
import { ModeToggle } from "@/Components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { router, Link } from "@inertiajs/react";
import { NotificationsButton } from "./partials/notifications";
import { Home, MessageCircle, Coins } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/Components/ui/button";

interface GeneralHeaderProps {
    user: {
        name: string;
        email: string;
        avatar: string;
        role: string;
        credits?: {
            available: number;
            recent_transactions: any[];
        };
        isAgency?: boolean;
    };
}

export default function GeneralHeader({ user }: GeneralHeaderProps) {
    const isMobile = useIsMobile();
    const isAgency = user.isAgency === true;
    const credits = user.credits?.available ?? 0;

    return (
        <header className="flex sticky top-0 z-50 h-16 shrink-0 items-center bg-secondary border-b justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            {/* Left: Sidebar Trigger and Logo/App Name on Mobile */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="text-secondary-foreground bg-primary/20 h-10 w-10" />
                {isMobile && (
                    <span className="flex text-secondary-foreground items-center gap-1 ml-2 font-semibold text-lg">
                        <Home className="w-6 h-6" />
                        Maid Match
                    </span>
                )}
            </div>
            {/* Right: Chat, Notifications, Avatar Dropdown */}
            <div className="flex items-center gap-2">
                {/* Show credits for agencies */}
                {isAgency && !isMobile && (
                    <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="mr-2"
                    >
                        <Link href="/agency/credits">
                            <Coins className="w-4 h-4 mr-1" />
                            {credits} Credits
                        </Link>
                    </Button>
                )}
                {/* Only show ModeToggle inline on desktop */}
                {!isMobile && <ModeToggle />}
                <NotificationsButton />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <span className="cursor-pointer hover:bg-primary/40 rounded-full p-1 transition">
                            <Avatar className="border-2 border-muted shadow-md">
                                <AvatarImage
                                    src={
                                        user.avatar
                                            ? `/storage/${user.avatar}`
                                            : ""
                                    }
                                    alt={user.name ?? "User"}
                                />
                                <AvatarFallback>
                                    {(user.name ?? "User")
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                        </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-40">
                        <DropdownMenuLabel>Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* Show credits in dropdown */}
                        {isAgency && (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/agency/credits"
                                        className="flex items-center gap-2"
                                    >
                                        <Coins className="w-4 h-4" />
                                        <span>{credits} Credits</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        {/* Show ModeToggle in dropdown on mobile */}
                        {isMobile && (
                            <>
                                <DropdownMenuItem asChild>
                                    <div className="flex items-center gap-2">
                                        <ModeToggle />
                                        <span>Theme</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        <DropdownMenuItem asChild>
                            <Link
                                href={
                                    user.role === "agency"
                                        ? route("agency.settings.profile.index")
                                        : route("employer.profile.index")
                                }
                            >
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => router.post(route("logout"))}
                            className="cursor-pointer"
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
