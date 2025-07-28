import { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    AlertCircle,
    Facebook,
    Instagram,
    Link as LinkIcon,
    Plus,
    Twitter,
    X,
} from "lucide-react";
import { CreateMaidFormData } from "../../../utils/types";

interface SocialMediaLinksProps {
    links: Record<string, string> | null | undefined;
    onChange: (links: Record<string, string>) => void;
    error?: string;
}

const SOCIAL_PLATFORMS = [
    {
        id: "facebook",
        label: "Facebook",
        icon: <Facebook className="h-4 w-4" />,
    },
    {
        id: "instagram",
        label: "Instagram",
        icon: <Instagram className="h-4 w-4" />,
    },
    { id: "twitter", label: "Twitter", icon: <Twitter className="h-4 w-4" /> },
    {
        id: "linkedin",
        label: "LinkedIn",
        icon: <LinkIcon className="h-4 w-4" />,
    },
];

export default function SocialMediaLinks({
    links = {},
    onChange,
    error,
}: SocialMediaLinksProps) {
    const [platform, setPlatform] = useState("");
    const [url, setUrl] = useState("");

    const currentLinks = links || {};

    const addLink = () => {
        if (platform && url) {
            const updatedLinks = { ...currentLinks, [platform]: url };
            onChange(updatedLinks);
            setPlatform("");
            setUrl("");
        }
    };

    const removeLink = (platformToRemove: string) => {
        const updatedLinks = { ...currentLinks };
        delete updatedLinks[platformToRemove];
        onChange(updatedLinks);
    };

    return (
        <div className="space-y-4">
            <Label className="text-sm font-medium">Social Media Links</Label>

            {/* Display existing links */}
            {Object.keys(currentLinks).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(currentLinks).map(([platform, url]) => (
                        <Badge
                            key={platform}
                            variant="secondary"
                            className="flex items-center gap-1 px-3 py-1"
                        >
                            {SOCIAL_PLATFORMS.find((p) => p.id === platform)
                                ?.icon || <LinkIcon className="h-3 w-3" />}
                            <span className="capitalize">{platform}</span>
                            <X
                                className="w-3 h-3 cursor-pointer hover:text-red-500 ml-1"
                                onClick={() => removeLink(platform)}
                            />
                        </Badge>
                    ))}
                </div>
            )}

            {/* Quick add buttons for common platforms */}
            <div className="flex flex-wrap gap-2 mb-3">
                {SOCIAL_PLATFORMS.filter((p) => !currentLinks[p.id]).map(
                    (platform) => (
                        <Button
                            key={platform.id}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setPlatform(platform.id);
                                setUrl("");
                            }}
                            className="h-7 text-xs"
                        >
                            {platform.icon}
                            <span className="ml-1">{platform.label}</span>
                        </Button>
                    )
                )}
            </div>

            {/* Add new link form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                    <Input
                        placeholder="Platform (e.g., Facebook)"
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="sm:col-span-2 flex gap-2">
                    <Input
                        placeholder="URL (https://...)"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="flex-1"
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addLink();
                            }
                        }}
                    />
                    <Button
                        type="button"
                        onClick={addLink}
                        disabled={!platform.trim() || !url.trim()}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </p>
            )}

            <p className="text-xs text-muted-foreground">
                Add social media profiles to help employers learn more about the
                maid
            </p>
        </div>
    );
}
