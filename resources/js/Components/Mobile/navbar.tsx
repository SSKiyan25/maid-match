import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "@inertiajs/react";

export interface MobileNavLink {
    label: string;
    icon: React.ElementType;
    href: string;
}

interface MobileNavBarProps {
    links: MobileNavLink[];
}

export default function MobileNavBar({ links }: MobileNavBarProps) {
    const isMobile = useIsMobile();

    if (!isMobile) return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-secondary border-t flex justify-around py-2 shadow-lg">
            {links.map(({ label, icon: Icon, href }) => (
                <Link
                    key={label}
                    href={href}
                    className="flex flex-col items-center text-xs text-primary-foreground  hover:text-primary transition"
                >
                    <Icon className="w-6 h-6 mb-1" />
                    {label}
                </Link>
            ))}
        </nav>
    );
}
