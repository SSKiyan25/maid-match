import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Progress } from "@/Components/ui/progress";
import { LineChart } from "@/Components/ui/chart";
import { Skeleton } from "@/Components/ui/skeleton";

interface CreditSectionProps {
    creditStats: any;
    creditHistory: any[];
    isLoading: boolean;
}

export default function CreditSection({
    creditStats,
    creditHistory,
    isLoading,
}: CreditSectionProps) {
    // Transform credit history data for chart
    const chartData =
        !isLoading && creditHistory
            ? creditHistory.map((item) => ({
                  name: item.month,
                  purchased: item.purchased,
                  used: item.used,
              }))
            : [];

    const expiringCredits = creditStats?.expiringCredits || 0;
    const hasExpiringCredits = expiringCredits > 0;

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Credits</CardTitle>
                <CardDescription>
                    Your credit balance and usage history
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Credit Overview */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                            Available Credits
                        </span>
                        {isLoading ? (
                            <Skeleton className="h-7 w-20" />
                        ) : (
                            <div className="text-2xl font-bold">
                                {creditStats?.totalCredits || 0}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs text-muted-foreground">
                            Used This Month
                        </span>
                        {isLoading ? (
                            <Skeleton className="h-7 w-20" />
                        ) : (
                            <div className="flex items-center">
                                <span className="text-2xl font-bold mr-1">
                                    {creditStats?.creditsUsedLastMonth || 0}
                                </span>
                                <TrendingDown className="h-4 w-4 text-destructive" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Expiring Credits Alert */}
                {hasExpiringCredits && !isLoading && (
                    <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Credits Expiring Soon</AlertTitle>
                        <AlertDescription>
                            {expiringCredits} credits will expire in the next 30
                            days
                        </AlertDescription>
                    </Alert>
                )}

                {/* Credit Usage Chart */}
                <div className="pt-2">
                    <div className="text-sm font-medium mb-2">
                        Credit Activity (Last 6 Months)
                    </div>
                    {isLoading ? (
                        <Skeleton className="h-32 w-full" />
                    ) : (
                        <LineChart
                            data={chartData}
                            categories={["purchased", "used"]}
                            index="name"
                            colors={["emerald", "rose"]}
                            valueFormatter={(value: number) =>
                                `${value} credits`
                            }
                            className="h-42 sm:h-54"
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
