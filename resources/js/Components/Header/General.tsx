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
import { Home, MessageCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface GeneralHeaderProps {
    user: {
        name: string;
        email: string;
        avatar: string;
    };
}

export default function GeneralHeader({ user }: GeneralHeaderProps) {
    const isMobile = useIsMobile();

    return (
        <header className="flex h-16 shrink-0 items-center bg-secondary border-b justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
                            <Link href={route("employer.profile.index")}>
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
