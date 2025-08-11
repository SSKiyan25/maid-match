export function formatCurrency(value: string | number): string {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return num.toLocaleString("en-PH", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}
// Get initial for avatar fallback
export const getInitials = (name: string) => {
    return (
        name
            ?.split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase() || "U"
    );
};

export const getStatusVariant = (status: string) => {
    switch (status) {
        case "pending":
            return "secondary";
        case "shortlisted":
            return "default";
        case "hired":
            return "accent";
        case "rejected":
            return "destructive";
        case "withdrawn":
            return "outline";
        default:
            return "secondary";
    }
};

// Get maid status badge variant and label
export const getMaidStatusVariant = (status: string) => {
    switch (status) {
        case "employed":
            return "accent";
        case "available":
            return "default";
        case "unavailable":
            return "secondary";
        case "inactive":
            return "destructive";
        default:
            return "secondary";
    }
};

export const getMaidStatusLabel = (status: string) => {
    switch (status) {
        case "employed":
            return "Employed";
        case "available":
            return "Available";
        case "unavailable":
            return "Unavailable";
        case "inactive":
            return "Inactive";
        default:
            return status
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
    }
};

// Helper to get photo URL
export const getPhotoUrl = (photoUrl: string) => {
    if (!photoUrl) return "";
    if (photoUrl.startsWith("blob:")) return photoUrl;
    return `/storage/${photoUrl}`;
};

export function formatDate(dateString: string): string {
    const date = new Date(dateString);

    // Format: July 18, 2025
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
