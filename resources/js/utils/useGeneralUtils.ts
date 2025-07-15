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
