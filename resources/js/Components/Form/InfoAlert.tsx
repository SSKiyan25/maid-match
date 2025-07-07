import { Alert, AlertDescription } from "@/Components/ui/alert";
import { ReactNode } from "react";

interface InfoAlertProps {
    icon?: ReactNode;
    colorClass?: string;
    title?: ReactNode;
    tips?: string[];
    children?: ReactNode;
    footer?: ReactNode;
}

export function InfoAlert({
    icon,
    colorClass = "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    title,
    tips,
    children,
    footer,
}: InfoAlertProps) {
    return (
        <Alert className={colorClass}>
            {icon}
            <AlertDescription className="text-blue-800 dark:text-blue-200">
                {title && <p className="font-medium mb-2">{title}</p>}
                {children}
                {tips && tips.length > 0 && (
                    <ul className="text-sm space-y-1 list-disc list-inside mt-2">
                        {tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                        ))}
                    </ul>
                )}
                {footer && <div className="mt-2">{footer}</div>}
            </AlertDescription>
        </Alert>
    );
}
