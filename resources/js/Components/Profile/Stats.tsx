import { Card } from "@/Components/ui/card";

interface StatItem {
    icon: React.ReactNode;
    label: string;
    value: number | string;
}

interface ProfileStatsProps {
    stats: StatItem[];
    layout?: "horizontal" | "vertical";
}

export default function ProfileStats({
    stats,
    layout = "horizontal",
}: ProfileStatsProps) {
    const isHorizontal = layout === "horizontal";

    return (
        <div
            className={
                isHorizontal
                    ? "grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-4"
                    : "flex flex-col gap-4"
            }
        >
            {stats.map((stat, index) => (
                <StatCard
                    key={`stat-${index}`}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                />
            ))}
        </div>
    );
}

function StatCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: number | string;
}) {
    return (
        <Card className="p-3 lg:p-4 flex flex-col lg:flex-row items-center lg:items-start justify-center lg:justify-start text-center lg:text-left">
            <div className="text-muted-foreground mb-1 lg:mb-0 lg:mr-3">
                {icon}
            </div>
            <div>
                <p className="font-bold text-lg">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </Card>
    );
}
