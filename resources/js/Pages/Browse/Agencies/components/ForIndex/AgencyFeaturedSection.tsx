import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import AgencyCard from "./AgencyCard/index";
import { cn } from "@/lib/utils";

interface AgencyFeaturedSectionProps {
    agencies: any[];
    highlightPremium?: boolean;
    highlightVerified?: boolean;
    highlightMaidCount?: boolean;
    highlightNew?: boolean;
}

export default function AgencyFeaturedSection({
    agencies,
    highlightPremium = false,
    highlightVerified = false,
    highlightMaidCount = false,
    highlightNew = false,
}: AgencyFeaturedSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth * 0.75;

            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    return (
        <div className="relative group">
            {/* Scroll buttons */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => scroll("left")}
                    className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Button>
            </div>

            <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => scroll("right")}
                    className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
                >
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>

            {/* Scrollable container */}
            <div
                ref={scrollRef}
                className={cn(
                    "flex overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide",
                    "snap-x snap-mandatory scroll-smooth"
                )}
            >
                {agencies.map((agency) => (
                    <div
                        key={agency.id}
                        className="min-w-[280px] max-w-[320px] px-2 snap-start"
                    >
                        <AgencyCard
                            agency={agency}
                            featured={true}
                            compact={false}
                            highlightPremium={highlightPremium}
                            highlightVerified={highlightVerified}
                            highlightMaidCount={highlightMaidCount}
                            highlightNew={highlightNew}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
