import { Card, CardContent } from "@/Components/ui/card";
import { CreditCard, Users, FileText } from "lucide-react";
import { Skeleton } from "@/Components/ui/skeleton";

interface DashboardSummaryProps {
    credits: string | number;
    maids: number;
    applications: number;
    isLoading: boolean;
}

export default function DashboardSummary({
    credits,
    maids,
    applications,
    isLoading,
}: DashboardSummaryProps) {
    return (
        <div className="grid grid-cols-3 md:flex md:flex-row gap-2 w-full md:w-auto">
            <SummaryItem
                icon={<CreditCard className="h-4 w-4" />}
                label="Credits"
                value={credits}
                isLoading={isLoading}
            />
            <SummaryItem
                icon={<Users className="h-4 w-4" />}
                label="Maids"
                value={maids}
                isLoading={isLoading}
            />
            <SummaryItem
                icon={<FileText className="h-4 w-4" />}
                label="Applications"
                value={applications}
                isLoading={isLoading}
            />
        </div>
    );
}

interface SummaryItemProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    isLoading: boolean;
}

function SummaryItem({ icon, label, value, isLoading }: SummaryItemProps) {
    return (
        <Card className="w-full md:w-24 md:flex-shrink-0 h-16">
            <CardContent className="flex flex-col items-center justify-center p-2 h-full">
                <div className="flex items-center text-muted-foreground mb-1">
                    {icon}
                    <span className="text-xs ml-1">{label}</span>
                </div>
                {isLoading ? (
                    <Skeleton className="h-5 w-12" />
                ) : (
                    <span className="text-lg font-semibold">{value || 0}</span>
                )}
            </CardContent>
        </Card>
    );
}
