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
import { Skeleton } from "@/Components/ui/skeleton";
import { Link } from "@inertiajs/react";
import { Users, CheckCircle, Award, BookOpen, Plus } from "lucide-react";

interface MaidOverviewProps {
    maidStats: any;
    recentMaids: any[];
    isLoading: boolean;
}

export default function MaidOverview({
    maidStats,
    recentMaids,
    isLoading,
}: MaidOverviewProps) {
    return (
        <div className="space-y-6">
            {/* Maid Statistics */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard
                    title="Total Maids"
                    value={maidStats?.totalMaids || 0}
                    icon={<Users className="h-4 w-4" />}
                    isLoading={isLoading}
                />
                <StatCard
                    title="Active"
                    value={maidStats?.activeMaids || 0}
                    icon={<CheckCircle className="h-4 w-4" />}
                    isLoading={isLoading}
                />
                <StatCard
                    title="Premium"
                    value={maidStats?.premiumMaids || 0}
                    icon={<Award className="h-4 w-4" />}
                    isLoading={isLoading}
                />
                <StatCard
                    title="Trained"
                    value={maidStats?.trainedMaids || 0}
                    icon={<BookOpen className="h-4 w-4" />}
                    isLoading={isLoading}
                />
            </div>

            {/* Recent Maids */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-semibold">
                                Recent Maids
                            </CardTitle>
                            <CardDescription>
                                Latest maids added to your agency
                            </CardDescription>
                        </div>
                        <Button size="sm" asChild>
                            <Link href="/agency/maids/create">
                                <Plus className="h-4 w-4 mr-1" />
                                Add Maid
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-36" />
                                        <div className="flex gap-1">
                                            <Skeleton className="h-3 w-12" />
                                            <Skeleton className="h-3 w-12" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentMaids && recentMaids.length > 0 ? (
                        <div className="space-y-4">
                            {recentMaids.map((maid) => (
                                <MaidListItem key={maid.id} maid={maid} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm font-medium">
                                No maids added yet
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Add your first maid to get started
                            </p>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/agency/maids">View All Maids</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

// Helper Components
function StatCard({ title, value, icon, isLoading }: any) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                        {title}
                    </span>
                    <span className="text-muted-foreground">{icon}</span>
                </div>
                {isLoading ? (
                    <Skeleton className="h-7 w-14" />
                ) : (
                    <div className="text-2xl font-bold">{value}</div>
                )}
            </CardContent>
        </Card>
    );
}

function MaidListItem({ maid }: any) {
    const fullName =
        maid.maid?.full_name ||
        maid.maid?.user?.profile?.full_name ||
        "Unnamed";
    const skills = maid.maid?.skills || [];

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Fix for the avatar URL - ensure it has /storage/ prefix
    let avatarPath =
        maid.maid?.user?.avatar ||
        maid.maid?.user?.profile?.avatar ||
        maid.maid?.primary_photo ||
        null;
    const avatarUrl = avatarPath ? `/storage/${avatarPath}` : undefined;

    return (
        <div className="flex items-start gap-3">
            <Avatar>
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{fullName}</p>
                    <Badge
                        variant={
                            maid.status === "active" ? "default" : "outline"
                        }
                    >
                        {maid.status_label || maid.status}
                    </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                    {maid.maid?.nationality}, {maid.maid?.years_experience || 0}{" "}
                    years exp.
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                    {skills.slice(0, 3).map((skill: string, i: number) => (
                        <Badge
                            key={i}
                            variant="outline"
                            className="text-xs px-1"
                        >
                            {skill}
                        </Badge>
                    ))}
                    {skills.length > 3 && (
                        <Badge variant="outline" className="text-xs px-1">
                            +{skills.length - 3}
                        </Badge>
                    )}
                </div>
            </div>
        </div>
    );
}
