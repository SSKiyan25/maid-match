import { Card, CardContent } from "@/Components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/Components/ui/badge";
import { getCreditTypeColor, getCreditTypeLabel } from "../utils/creditHelpers";

interface Transaction {
    id: number;
    amount: number;
    type: string;
    description: string;
    friendly_description?: string;
    links?: {
        maid?: {
            id: number;
            name: string;
            url: string;
        };
        job?: {
            id: number;
            title: string;
            url: string;
        };
    };
    created_at: string;
}

interface RecentTransactionsProps {
    transactions: Transaction[];
}

export default function RecentTransactions({
    transactions,
}: RecentTransactionsProps) {
    if (!transactions.length) {
        return (
            <Card>
                <CardContent className="p-4 text-center text-muted-foreground">
                    No recent transactions found
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="divide-y">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="p-3 flex justify-between items-start"
                        >
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={getCreditTypeColor(
                                            transaction.type
                                        )}
                                    >
                                        {getCreditTypeLabel(transaction.type)}
                                    </Badge>
                                    <span
                                        className={`font-medium ${
                                            transaction.amount > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {transaction.amount > 0 ? "+" : ""}
                                        {transaction.amount}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                    {transaction.friendly_description ||
                                        transaction.description}
                                </p>
                                {transaction.links && (
                                    <div className="flex gap-2 mt-1 text-xs">
                                        {transaction.links.maid && (
                                            <a
                                                href={
                                                    transaction.links.maid.url
                                                }
                                                className="text-primary hover:underline"
                                                target="_blank"
                                            >
                                                View Maid
                                            </a>
                                        )}
                                        {transaction.links.job && (
                                            <a
                                                href={transaction.links.job.url}
                                                className="text-primary hover:underline"
                                                target="_blank"
                                            >
                                                View Job
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {formatDistanceToNow(
                                    new Date(transaction.created_at),
                                    { addSuffix: true }
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
