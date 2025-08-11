import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import { Link } from "@inertiajs/react";
import {
    UserPlus,
    CreditCard,
    ClipboardList,
    Building,
    ExternalLink,
    LucideIcon,
} from "lucide-react";

// Map icon names to Lucide icons
const iconMap = {
    UserPlus,
    CreditCard,
    ClipboardList,
    Building,
    ExternalLink,
};

// Define the type for valid icon names
type IconName = keyof typeof iconMap;

// Helper function to check if a string is a valid icon name
function isValidIconName(icon: string): icon is IconName {
    return icon in iconMap;
}

// Define the interface for a link item
interface LinkItem {
    title: string;
    description: string;
    url: string;
    icon: string;
}

interface QuickLinksProps {
    links: LinkItem[];
    isLoading: boolean;
}

export default function QuickLinks({ links, isLoading }: QuickLinksProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                    Quick Actions
                </CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : links && links.length > 0 ? (
                    <div className="space-y-3">
                        {links.map((link, i) => {
                            // Get the icon component based on the icon name
                            let IconComponent: LucideIcon = ExternalLink;

                            // Only use the icon from iconMap if it's a valid key
                            if (isValidIconName(link.icon)) {
                                IconComponent = iconMap[link.icon];
                            }

                            return (
                                <Button
                                    key={i}
                                    variant="outline"
                                    className="w-full justify-start h-auto py-3"
                                    asChild
                                >
                                    <Link href={link.url}>
                                        <div className="flex items-start">
                                            <div className="bg-primary/10 p-2 rounded-md mr-3">
                                                <IconComponent className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium">
                                                    {link.title}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {link.description}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                </Button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-sm text-muted-foreground">
                            No quick links available
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
