import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusInfoProps {
    status: string;
    type?: "application" | "maid";
    size?: "sm" | "default";
}

export default function StatusInfo({
    status,
    type = "application",
    size = "default",
}: StatusInfoProps) {
    const getStatusConfig = () => {
        if (type === "maid") {
            switch (status) {
                case "available":
                    return { label: "Available", variant: "success" };
                case "employed":
                    return { label: "Employed", variant: "info" };
                case "pending":
                    return { label: "Pending", variant: "warning" };
                default:
                    return {
                        label: status.replace(/_/g, " "),
                        variant: "secondary",
                    };
            }
        }

        // Application status
        switch (status) {
            case "pending_review":
                return { label: "Pending Review", variant: "warning" };
            case "shortlisted":
                return { label: "Shortlisted", variant: "success" };
            case "interviewed":
                return { label: "Interviewed", variant: "info" };
            case "rejected":
                return { label: "Rejected", variant: "destructive" };
            case "hired":
                return { label: "Hired", variant: "primary" };
            default:
                return {
                    label: status.replace(/_/g, " "),
                    variant: "secondary",
                };
        }
    };

    const { label, variant } = getStatusConfig();

    return (
        <Badge
            variant={variant as any}
            className={cn(
                "capitalize font-medium",
                size === "sm" ? "text-[10px] px-1.5 py-0" : ""
            )}
        >
            {label}
        </Badge>
    );
}
