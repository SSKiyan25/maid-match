import { Button } from "@/Components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

interface JobPostsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function JobPostsPagination({
    currentPage,
    totalPages,
    onPageChange,
}: JobPostsPaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end of visible range
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust range if at start or end
            if (currentPage <= 2) {
                end = 4;
            } else if (currentPage >= totalPages - 1) {
                start = totalPages - 3;
            }

            // Add ellipsis if needed
            if (start > 2) {
                pages.push("ellipsis1");
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis if needed
            if (end < totalPages - 1) {
                pages.push("ellipsis2");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center items-center gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="hidden sm:flex"
            >
                <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
                {pageNumbers.map((page, index) => {
                    if (page === "ellipsis1" || page === "ellipsis2") {
                        return (
                            <div
                                key={`ellipsis-${index}`}
                                className="flex items-center justify-center w-9"
                            >
                                ...
                            </div>
                        );
                    }

                    return (
                        <Button
                            key={`page-${page}`}
                            variant={
                                currentPage === page ? "default" : "outline"
                            }
                            className="w-9 h-9 p-0"
                            onClick={() => onPageChange(page as number)}
                        >
                            {page}
                        </Button>
                    );
                })}
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden sm:flex"
            >
                <ChevronsRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
