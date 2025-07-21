import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

interface ProfileSectionProps {
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

export default function ProfileSection({
    title,
    icon,
    children,
    className = "",
}: ProfileSectionProps) {
    return (
        <Card className={className}>
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                    {icon && (
                        <span className="text-muted-foreground">{icon}</span>
                    )}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}
