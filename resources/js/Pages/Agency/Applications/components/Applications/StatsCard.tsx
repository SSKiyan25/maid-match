import { Card, CardContent } from "@/Components/ui/card";
import {
    Briefcase,
    CheckCircle,
    Clock,
    FileCheck,
    Users,
    XCircle,
} from "lucide-react";

interface StatsCardProps {
    title: string;
    value: number;
    description?: string;
    icon?: React.ReactNode;
    className?: string;
    type?: "total" | "pending" | "shortlisted" | "rejected" | "hired";
}

export default function StatsCard({
    title,
    value,
    description,
    icon,
    className,
    type,
}: StatsCardProps) {
    // Generate default icon based on type if none provided
    const getDefaultIcon = () => {
        switch (type) {
            case "total":
                return <Briefcase className="h-5 w-5 text-primary" />;
            case "pending":
                return <Clock className="h-5 w-5 text-amber-500" />;
            case "shortlisted":
                return <FileCheck className="h-5 w-5 text-emerald-500" />;
            case "rejected":
                return <XCircle className="h-5 w-5 text-rose-500" />;
            case "hired":
                return <CheckCircle className="h-5 w-5 text-blue-500" />;
            default:
                return <Users className="h-5 w-5 text-primary" />;
        }
    };

    // Get default class based on type
    const getDefaultClass = () => {
        switch (type) {
            case "pending":
                return "border-amber-200 bg-amber-50/50 dark:bg-transparent";
            case "shortlisted":
                return "border-emerald-200 bg-emerald-50/50 dark:bg-transparent";
            case "rejected":
                return "border-rose-200 bg-rose-50/50 dark:bg-transparent";
            case "hired":
                return "border-blue-200 bg-blue-50/50 dark:bg-transparent";
            default:
                return "";
        }
    };

    const displayIcon = icon || getDefaultIcon();
    const cardClass = className || getDefaultClass();

    return (
        <Card className={cardClass}>
            <CardContent className="flex items-center p-4">
                <div className="mr-3 rounded-full bg-primary/10 p-2">
                    {displayIcon}
                </div>
                <div>
                    <p className="text-xs font-medium text-muted-foreground">
                        {title}
                    </p>
                    <h4 className="text-xl font-bold">{value}</h4>
                    {description && (
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
