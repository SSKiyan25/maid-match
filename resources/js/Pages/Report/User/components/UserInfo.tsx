import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { getInitials } from "@/utils/useGeneralUtils";

interface UserInfoProps {
    userName: string;
    avatar: string | null;
    role: string;
}

export default function UserInfo({ userName, avatar, role }: UserInfoProps) {
    return (
        <div className="flex items-center p-4 bg-muted rounded-lg mb-6">
            <Avatar className="h-12 w-12 mr-4">
                <AvatarImage
                    src={avatar ? `/storage/${avatar}` : undefined}
                    alt={userName}
                />
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
            <div>
                <div className="font-medium">{userName}</div>
                <div className="text-sm text-muted-foreground capitalize">
                    {role}
                </div>
            </div>
        </div>
    );
}
