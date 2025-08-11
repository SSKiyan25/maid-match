export function getCreditTypeLabel(type: string): string {
    switch (type) {
        case "purchase":
            return "Purchase";
        case "used":
            return "Used";
        case "refund":
            return "Refund";
        case "admin_grant":
            return "Admin Grant";
        case "initial_grant":
            return "Initial Grant";
        default:
            return type.charAt(0).toUpperCase() + type.slice(1);
    }
}

export function getCreditTypeColor(type: string): string {
    switch (type) {
        case "purchase":
            return "bg-blue-50 text-blue-700 hover:bg-blue-100";
        case "used":
            return "bg-red-50 text-red-700 hover:bg-red-100";
        case "refund":
            return "bg-green-50 text-green-700 hover:bg-green-100";
        case "admin_grant":
            return "bg-purple-50 text-purple-700 hover:bg-purple-100";
        case "initial_grant":
            return "bg-amber-50 text-amber-700 hover:bg-amber-100";
        default:
            return "bg-gray-50 text-gray-700 hover:bg-gray-100";
    }
}
