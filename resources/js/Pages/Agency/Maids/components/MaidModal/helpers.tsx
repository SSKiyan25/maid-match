import {
    Facebook,
    Instagram,
    Twitter,
    Linkedin,
    MessageCircle,
    Globe,
} from "lucide-react";

export const getStatusColor = (status: string) => {
    switch (status) {
        case "available":
            return "bg-green-500/15 text-green-600 border-green-200";
        case "employed":
            return "bg-blue-500/15 text-blue-600 border-blue-200";
        case "unavailable":
            return "bg-red-500/15 text-red-600 border-red-200";
        default:
            return "bg-gray-500/15 text-gray-600 border-gray-200";
    }
};

export const accommodationLabels: Record<string, string> = {
    live_in: "Live-in",
    live_out: "Live-out",
    either: "Either live-in or live-out",
};

export const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(parseFloat(amount));
};

export const getSocialMediaIcon = (platform: string): JSX.Element => {
    switch (platform.toLowerCase()) {
        case "facebook":
            return <Facebook className="h-4 w-4 text-blue-600" />;
        case "instagram":
            return <Instagram className="h-4 w-4 text-pink-600" />;
        case "twitter":
            return <Twitter className="h-4 w-4 text-blue-400" />;
        case "linkedin":
            return <Linkedin className="h-4 w-4 text-blue-700" />;
        case "tiktok":
            return <MessageCircle className="h-4 w-4 text-black" />;
        default:
            return <Globe className="h-4 w-4 text-primary/70" />;
    }
};
