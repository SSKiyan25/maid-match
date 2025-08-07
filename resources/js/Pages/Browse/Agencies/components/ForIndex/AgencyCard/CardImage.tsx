import { cn } from "@/lib/utils";
import { Building2 } from "lucide-react";

interface CardImageProps {
    mainPhoto: string | null;
    name: string;
    isPremium: boolean;
    height?: string;
}

export default function AgencyCardImage({
    mainPhoto,
    name,
    isPremium,
    height = "h-32",
}: CardImageProps) {
    const firstLetter = name.charAt(0).toUpperCase();

    const imageContainerClasses = cn(
        "relative w-full overflow-hidden",
        height,
        isPremium ? "bg-gradient-to-r from-amber-100 to-amber-50" : "bg-muted"
    );

    return (
        <div className={imageContainerClasses}>
            {mainPhoto ? (
                <img
                    src={mainPhoto}
                    alt={`${name} office`}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-slate-50 to-slate-200">
                    <div className="flex flex-col items-center justify-center">
                        <Building2 className="h-10 w-10 text-muted-foreground/50" />
                        <div className="text-2xl font-bold text-muted-foreground/50 mt-1">
                            {firstLetter}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
