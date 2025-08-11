import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Coins } from "lucide-react";

interface CreditStatsProps {
    totalCredits: number;
}

export default function CreditStats({ totalCredits }: CreditStatsProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center">
                    <Coins className="h-5 w-5 mr-2 text-amber-500" />
                    Available Credits
                </CardTitle>
                <CardDescription>Your current credit balance</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
                <div className="text-3xl font-bold">{totalCredits}</div>
                <p className="text-sm text-muted-foreground mt-1">
                    Use credits to apply for job postings and other premium
                    features
                </p>
            </CardContent>
        </Card>
    );
}
