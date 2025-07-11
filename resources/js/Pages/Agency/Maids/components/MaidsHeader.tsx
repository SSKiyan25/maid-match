import { Button } from "@/Components/ui/button";
import {
    PlusCircle,
    UserCheck,
    Archive,
    Users,
    Award,
    Clock,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";

interface MaidsHeaderProps {
    stats: {
        total: number;
        available: number;
        employed: number;
        verified: number;
        premium: number;
        archived: number;
    };
}

const statConfig = [
    {
        key: "total",
        label: "Total Maids",
        icon: Users,
        color: "var(--stat-total-bg, var(--primary-bg, #f1f5f9))",
        iconColor: "var(--stat-total-icon, var(--primary, #2563eb))",
    },
    {
        key: "available",
        label: "Available",
        icon: UserCheck,
        color: "var(--stat-available-bg, #dcfce7)",
        iconColor: "var(--stat-available-icon, #16a34a)",
    },
    {
        key: "employed",
        label: "Employed",
        icon: Clock,
        color: "var(--stat-employed-bg, #dbeafe)",
        iconColor: "var(--stat-employed-icon, #2563eb)",
    },
    {
        key: "verified",
        label: "Verified",
        icon: UserCheck,
        color: "var(--stat-verified-bg, #e0e7ff)",
        iconColor: "var(--stat-verified-icon, #6366f1)",
    },
    {
        key: "premium",
        label: "Premium",
        icon: Award,
        color: "var(--stat-premium-bg, #fef3c7)",
        iconColor: "var(--stat-premium-icon, #f59e42)",
    },
    {
        key: "archived",
        label: "Archived",
        icon: Archive,
        color: "var(--stat-archived-bg, #f3f4f6)",
        iconColor: "var(--stat-archived-icon, #6b7280)",
    },
];

export default function MaidsHeader({ stats }: MaidsHeaderProps) {
    return (
        <div className="space-y-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Maid Management
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md">
                        View, manage, and track all your agency’s maids in one
                        place.
                    </p>
                </div>
                <Link href={route("agency.maids.create")}>
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        <span>Add New Maid</span>
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {statConfig.map(
                    ({ key, label, icon: Icon, color, iconColor }) => (
                        <Card key={key} className="bg-muted">
                            <CardContent className="p-4 flex flex-col items-center sm:items-start">
                                <div
                                    className="flex items-center justify-center w-8 h-8 rounded-lg mb-2"
                                    style={{
                                        background: color,
                                        color: iconColor,
                                    }}
                                >
                                    <Icon
                                        size={18}
                                        className={
                                            key === "total"
                                                ? "dark:text-muted-foreground"
                                                : ""
                                        }
                                    />
                                </div>
                                <div className="text-2xl font-bold">
                                    {stats[key as keyof typeof stats]}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {label}
                                </p>
                            </CardContent>
                        </Card>
                    )
                )}
            </div>
        </div>
    );
}
