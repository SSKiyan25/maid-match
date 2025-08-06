import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/Components/ui/pagination";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface PaginationComponentProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export default function PaginationComponent({
    currentPage,
    totalPages,
    onPageChange,
    disabled = false,
}: PaginationComponentProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];

        // Always show first page
        pages.push(1);

        // Calculate start and end of the middle section
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis if needed before middle section
        if (startPage > 2) {
            pages.push("ellipsis");
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis if needed after middle section
        if (endPage < totalPages - 1) {
            pages.push("ellipsis");
        }

        // Always show last page if it's not the first page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous button */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (!disabled && currentPage > 1) {
                                onPageChange(currentPage - 1);
                            }
                        }}
                        className={cn(
                            (disabled || currentPage <= 1) &&
                                "pointer-events-none opacity-50"
                        )}
                    />
                </PaginationItem>

                {/* Page numbers */}
                {pages.map((page, i) => (
                    <PaginationItem key={i}>
                        {page === "ellipsis" ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!disabled && page !== currentPage) {
                                        onPageChange(page);
                                    }
                                }}
                                className={cn(
                                    disabled && "pointer-events-none",
                                    page === currentPage &&
                                        disabled &&
                                        "opacity-70"
                                )}
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Next button */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (!disabled && currentPage < totalPages) {
                                onPageChange(currentPage + 1);
                            }
                        }}
                        className={cn(
                            (disabled || currentPage >= totalPages) &&
                                "pointer-events-none opacity-50"
                        )}
                    />
                </PaginationItem>

                {/* Loading indicator */}
                {disabled && (
                    <PaginationItem>
                        <div className="flex items-center ml-2 text-sm text-muted-foreground">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Loading
                        </div>
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
