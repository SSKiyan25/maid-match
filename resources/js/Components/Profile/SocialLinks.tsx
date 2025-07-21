import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

interface SocialLink {
    name: string;
    url: string;
    icon: React.ElementType;
    color?: string;
}

interface ProfileSocialLinksProps {
    links: SocialLink[];
}

export default function ProfileSocialLinks({ links }: ProfileSocialLinksProps) {
    if (!links || links.length === 0) return null;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Social Links</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {links.map((link) => (
                        <Button
                            key={link.name}
                            variant="outline"
                            size="sm"
                            asChild
                            className="gap-2 h-9"
                        >
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center"
                            >
                                <link.icon
                                    className={`h-4 w-4 ${link.color || ""}`}
                                />
                                {link.name}
                            </a>
                        </Button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
