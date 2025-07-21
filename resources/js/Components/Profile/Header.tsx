import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Card } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { getInitials } from "@/utils/useGeneralUtils";

interface ProfileHeaderProps {
    name: string;
    avatar?: string;
    createdAt: string;
    isVerified?: boolean;
    status?: string;
    statusLabel?: string;
    bio?: string;
    badges?: React.ReactNode;
    additionalContent?: React.ReactNode;
}

export default function ProfileHeader({
    name,
    avatar,
    createdAt,
    isVerified,
    status,
    statusLabel,
    bio,
    badges,
    additionalContent,
}: ProfileHeaderProps) {
    return (
        <div className="relative">
            {/* Cover Photo - Placeholder gradient */}
            <div className="h-32 sm:h-48 lg:h-64 bg-gradient-to-r from-indigo-500/80 via-purple-500/80 to-pink-500/80 rounded-lg" />

            <div className="px-4 -mt-12 sm:-mt-16 lg:-mt-20 relative z-10 max-w-5xl mx-auto">
                <Card className="p-4 sm:p-6 shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        {/* Avatar */}
                        <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background">
                            <AvatarImage
                                src={avatar ? `/storage/${avatar}` : undefined}
                                alt={name}
                            />
                            <AvatarFallback className="text-xl sm:text-2xl">
                                {getInitials(name)}
                            </AvatarFallback>
                        </Avatar>

                        <div className="space-y-2 flex-1">
                            {/* Name and Verification */}
                            <div className="flex items-center flex-wrap gap-2">
                                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                                    {name}
                                </h1>
                                {isVerified && (
                                    <Badge
                                        variant="accent"
                                        className="ml-2 h-5 px-1.5"
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                        Verified
                                    </Badge>
                                )}
                            </div>

                            {/* Status & Badges */}
                            <div className="flex items-center flex-wrap gap-2">
                                {status && (
                                    <Badge
                                        variant={
                                            status === "active" ||
                                            status === "looking"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {statusLabel || status}
                                    </Badge>
                                )}

                                {/* Custom badges */}
                                {badges}

                                <span className="text-sm text-muted-foreground">
                                    Member since{" "}
                                    {new Date(createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Bio */}
                            {bio && (
                                <p className="text-sm lg:text-base text-muted-foreground mt-2">
                                    {bio}
                                </p>
                            )}

                            {/* Additional Content */}
                            {additionalContent}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
