import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

const dummyNotifications = [
    { id: 1, message: "Welcome to Maid Match!", read: false },
    { id: 2, message: "Your profile was updated.", read: true },
];

export function NotificationsButton() {
    const unreadCount = dummyNotifications.filter((n) => !n.read).length;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="relative p-2.5 rounded-full bg-muted hover:shadow-lg">
                    <Bell className="w-5 h-5 text-primary " />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dummyNotifications.length === 0 ? (
                    <DropdownMenuItem disabled>
                        No notifications
                    </DropdownMenuItem>
                ) : (
                    dummyNotifications.map((n) => (
                        <DropdownMenuItem
                            key={n.id}
                            className={!n.read ? "font-bold" : ""}
                        >
                            {n.message}
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
