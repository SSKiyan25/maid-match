export const accommodationTypes = [
    { value: "live_in", label: "Live-in" },
    { value: "live_out", label: "Live-out" },
    { value: "flexible", label: "Flexible" },
];

export const dayOffTypes = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "flexible", label: "Flexible" },
    { value: "none", label: "No Fixed Day Off" },
];

export function getAccommodationLabel(value: string) {
    return (
        accommodationTypes.find((type) => type.value === value)?.label || value
    );
}
