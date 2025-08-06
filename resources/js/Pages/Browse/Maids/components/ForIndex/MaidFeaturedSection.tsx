import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import MaidCard from "./MaidCard";
import { cn } from "@/lib/utils";

interface MaidFeaturedSectionProps {
    maids: any[];
    highlightMatch?: boolean;
    highlightLocation?: boolean;
    highlightNew?: boolean;
    useComputedMatch?: boolean;
    selectedJobId?: string | null;
}

export default function MaidFeaturedSection({
    maids,
    highlightMatch = false,
    highlightLocation = false,
    highlightNew = false,
    useComputedMatch = false,
    selectedJobId = null,
}: MaidFeaturedSectionProps) {
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
                {maids.map((maid) => (
                    <div
                        key={maid.id}
                        className="min-w-[280px] max-w-[320px] px-2 snap-start"
                    >
                        <MaidCard
                            maid={maid}
                            showMatchBadge={highlightMatch}
                            showLocationBadge={highlightLocation}
                            showNewBadge={highlightNew}
                            featured={true}
                            compact={false}
                            useComputedMatch={useComputedMatch}
                            selectedJobId={selectedJobId}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
