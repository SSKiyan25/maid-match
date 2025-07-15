import React, { useRef, useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    ChevronRight,
    ChevronLeft,
    MapPin,
    ThumbsUp,
    LayoutGrid,
    Star,
} from "lucide-react";
import { Button } from "@/Components/ui/button";

import JobPostCard from "./JobPostCard";

interface JobPostsListProps {
    jobs: any[];
    title?: string;
    emptyMessage?: string;
    horizontal?: boolean;
    featured?: boolean;
    category?: string;
    maxItems?: number;
    viewAllRoute?: string;
}

export default function JobPostsList({
    jobs,
    title,
    emptyMessage = "No job posts found",
    horizontal = false,
    featured = false,
    category = "",
    maxItems = 10,
    viewAllRoute,
}: JobPostsListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [thumbWidth, setThumbWidth] = useState(0);
    const [thumbPosition, setThumbPosition] = useState(0);

    // For horizontal view, limit display to maxItems
    const displayJobs = horizontal ? jobs.slice(0, maxItems) : jobs;
    const hasMoreItems = horizontal && jobs.length > maxItems;

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

        // Update arrows
        setShowLeftArrow(scrollLeft > 20);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20);

        // Update scrollbar thumb
        const trackWidth = scrollRef.current.clientWidth;
        const thumbWidth = Math.max(
            (clientWidth / scrollWidth) * trackWidth,
            40
        );
        const thumbPosition = (scrollLeft / scrollWidth) * trackWidth;

        setThumbWidth(thumbWidth);
        setThumbPosition(thumbPosition);
    };

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener("scroll", handleScroll);
            // Check initial state
            handleScroll();
            return () =>
                scrollElement.removeEventListener("scroll", handleScroll);
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current && horizontal) {
            const { scrollWidth, clientWidth } = scrollRef.current;
            const trackWidth = scrollRef.current.clientWidth;
            const thumbWidth = Math.max(
                (clientWidth / scrollWidth) * trackWidth,
                40
            );
            setThumbWidth(thumbWidth);
        }
    }, [jobs, horizontal]);

    // Mouse drag handlers for desktop
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
        const walk = (x - startX) * 2;
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const { clientWidth } = scrollRef.current;
        const scrollAmount =
            direction === "left" ? -clientWidth / 2 : clientWidth / 2;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    };

    if (jobs.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return;
        const track = e.currentTarget;
        const rect = track.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const trackWidth = rect.width;
        const scrollWidth = scrollRef.current.scrollWidth;

        scrollRef.current.scrollTo({
            left: (clickPosition / trackWidth) * scrollWidth,
            behavior: "smooth",
        });
    };

    const getTitleIcon = () => {
        if (!title) return null;

        const lowerTitle = title.toLowerCase();

        if (lowerTitle.includes("near you") || lowerTitle.includes("nearby")) {
            return <MapPin className="h-5 w-5 mr-2 text-primary" />;
        } else if (
            lowerTitle.includes("recommended") ||
            lowerTitle.includes("for you")
        ) {
            return <ThumbsUp className="h-5 w-5 mr-2 text-primary" />;
        } else if (lowerTitle.includes("featured")) {
            return <Star className="h-5 w-5 mr-2 text-primary" />;
        } else {
            return <LayoutGrid className="h-5 w-5 mr-2 text-primary" />;
        }
    };

    return (
        <div className="w-full space-y-4 overflow-hidden">
            <div className="flex justify-between items-center">
                {title && (
                    <div className="flex items-center">
                        {getTitleIcon()}
                        <h2 className="text-xl font-semibold">{title}</h2>
                    </div>
                )}
                {viewAllRoute && jobs.length > 4 && (
                    <Link href={viewAllRoute}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary"
                        >
                            View All <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    </Link>
                )}
            </div>
            {horizontal ? (
                <div className="w-full overflow-hidden">
                    {/* Arrow controls and scrollable cards */}
                    <div className="relative">
                        {showLeftArrow && (
                            <button
                                onClick={() => scroll("left")}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-primary text-primary-foreground rounded-full shadow-md p-2 hover:bg-secondary transition"
                                aria-label="Scroll left"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        )}

                        <div
                            ref={scrollRef}
                            className="flex overflow-x-auto gap-2 sm:gap-4 pb-4 no-scrollbar snap-x snap-mandatory w-full"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleMouseUp}
                        >
                            {displayJobs.map((job) => (
                                <div
                                    key={job.id}
                                    className="flex-none snap-start w-[55vw] sm:w-[320px]"
                                >
                                    <JobPostCard
                                        job={job}
                                        featured={featured}
                                    />
                                </div>
                            ))}
                            {hasMoreItems && viewAllRoute && (
                                <div className="flex-none snap-start w-[55vw] sm:w-[280px]">
                                    <Link
                                        href={viewAllRoute}
                                        className="h-full"
                                    >
                                        <div className="flex flex-col items-center justify-center h-full min-h-[360px] border border-dashed border-primary/50 rounded-xl p-6 text-center bg-card hover:bg-accent transition-colors">
                                            <ChevronRight className="h-10 w-10 text-primary mb-4" />
                                            <p className="font-medium text-primary">
                                                View All
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {jobs.length} {category}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {showRightArrow && (
                            <button
                                onClick={() => scroll("right")}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-primary text-primary-foreground rounded-full shadow-md p-2 hover:bg-secondary transition"
                                aria-label="Scroll right"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Custom scrollbar */}
                    <div
                        className="h-1 bg-muted rounded-full mt-2 cursor-pointer relative"
                        onClick={handleTrackClick}
                    >
                        <div
                            className="absolute h-1 bg-primary rounded-full"
                            style={{
                                width: `${thumbWidth}px`,
                                left: `${thumbPosition}px`,
                                transition: "width 0.2s, left 0.2s",
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayJobs.map((job) => (
                        <JobPostCard
                            key={job.id}
                            job={job}
                            featured={featured}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
