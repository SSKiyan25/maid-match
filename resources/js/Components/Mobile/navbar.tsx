import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@inertiajs/react";
import { Badge } from "@/Components/ui/badge";

export interface MobileNavLink {
    label: string;
    icon: React.ElementType;
    href: string;
    badge?: number; // Make badge optional
}

interface MobileNavBarProps {
    links: MobileNavLink[];
}

export default function MobileNavBar({ links }: MobileNavBarProps) {
    const isMobile = useIsMobile();

    if (!isMobile) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t flex justify-around py-2 shadow-lg">
            {links.map(({ label, icon: Icon, href, badge }) => (
                <Link
                    key={label}
                    href={href}
                    className="flex flex-col items-center text-xs text-secondary-foreground hover:text-primary transition relative"
                >
                    <div className="relative">
                        <Icon className="w-6 h-6 mb-1" />
                        {typeof badge === "number" && badge > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -top-2 -right-2 px-1 min-w-[1.2rem] h-4 text-[10px] flex items-center justify-center"
                            >
                                {badge > 99 ? "99+" : badge}
                            </Badge>
                        )}
                    </div>
                    {label}
                </Link>
            ))}
        </nav>
    );
}
