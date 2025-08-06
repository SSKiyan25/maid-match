import { getMatchColorClass } from "@/utils/matchingUtils";

interface MatchCircleProps {
    percentage: number;
    compact?: boolean;
}

export function MatchCircle({ percentage, compact = false }: MatchCircleProps) {
    const matchColorClass = getMatchColorClass(percentage);
    const size = compact ? "w-12 h-12" : "w-16 h-16";
    const textSize = compact ? "text-lg" : "text-xl";

    return (
        <div
            className={`${size} rounded-full flex items-center justify-center bg-white border-2 ${matchColorClass.replace(
                "text-",
                "border-"
            )}`}
        >
            <div className="text-center">
                <div className={`${textSize} font-bold ${matchColorClass}`}>
                    {percentage}%
                </div>
            </div>
        </div>
    );
}
