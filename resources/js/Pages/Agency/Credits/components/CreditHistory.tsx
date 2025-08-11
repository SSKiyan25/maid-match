import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { getCreditTypeColor, getCreditTypeLabel } from "../utils/creditHelpers";
import { formatDate } from "@/utils/useGeneralUtils";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";
import { router } from "@inertiajs/react";

interface Credit {
    id: number;
    agency_id: number;
    amount: number;
    type: string;
    description: string;
    friendly_description?: string;
    links?: {
        maid?: {
            id: number;
            name: string;
            url: string;
        };
        job?: {
            id: number;
            title: string;
            url: string;
        };
    };
    expires_at: string | null;
    created_at: string;
    updated_at: string;
}

interface CreditHistoryProps {
    credits: Credit[];
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function CreditHistory({
    credits,
    pagination,
}: CreditHistoryProps) {
    const handlePageChange = (page: number) => {
        router.get(route("agency.credits.index", { page }));
    };

    // Mobile card view of credits
    const mobileView = (
        <div className="space-y-3 sm:hidden">
            {credits.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground">
                    No credit history found
                </div>
            ) : (
                credits.map((credit) => (
                    <Card key={credit.id}>
                        <CardContent className="p-3 space-y-2">
                            <div className="flex justify-between items-start">
                                <Badge
                                    variant="outline"
                                    className={getCreditTypeColor(credit.type)}
                                >
                                    {getCreditTypeLabel(credit.type)}
                                </Badge>
                                <span
                                    className={`font-medium ${
                                        credit.amount > 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {credit.amount > 0 ? "+" : ""}
                                    {credit.amount}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {credit.friendly_description ||
                                    credit.description}
                            </p>
                            {credit.links && (
                                <div className="flex gap-2 text-xs">
                                    {credit.links.maid && (
                                        <a
                                            href={credit.links.maid.url}
                                            className="text-primary hover:underline"
                                            target="_blank"
                                        >
                                            View Maid
                                        </a>
                                    )}
                                    {credit.links.job && (
                                        <a
                                            href={credit.links.job.url}
                                            className="text-primary hover:underline"
                                            target="_blank"
                                        >
                                            View Job
                                        </a>
                                    )}
                                </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                                {formatDate(credit.created_at)}
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );

    // Desktop table view of credits
    const desktopView = (
        <div className="hidden sm:block">
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">
                                    Amount
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {credits.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center h-24 text-muted-foreground"
                                    >
                                        No credit history found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                credits.map((credit) => (
                                    <TableRow key={credit.id}>
                                        <TableCell>
                                            {formatDate(credit.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={getCreditTypeColor(
                                                    credit.type
                                                )}
                                            >
                                                {getCreditTypeLabel(
                                                    credit.type
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {credit.links ? (
                                                <div>
                                                    <span>
                                                        {
                                                            credit.friendly_description
                                                        }
                                                    </span>
                                                    <div className="flex gap-2 mt-1 text-xs">
                                                        {credit.links.maid && (
                                                            <a
                                                                href={
                                                                    credit.links
                                                                        .maid
                                                                        .url
                                                                }
                                                                className="text-primary hover:underline"
                                                                target="_blank"
                                                            >
                                                                View Maid
                                                            </a>
                                                        )}
                                                        {credit.links.job && (
                                                            <a
                                                                href={
                                                                    credit.links
                                                                        .job.url
                                                                }
                                                                className="text-primary hover:underline"
                                                                target="_blank"
                                                            >
                                                                View Job
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                credit.friendly_description ||
                                                credit.description
                                            )}
                                        </TableCell>
                                        <TableCell
                                            className={`text-right font-medium ${
                                                credit.amount > 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {credit.amount > 0 ? "+" : ""}
                                            {credit.amount}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

    // Show pagination if there are multiple pages
    const paginationControls = pagination.last_page > 1 && (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (pagination.current_page > 1) {
                                handlePageChange(pagination.current_page - 1);
                            }
                        }}
                        className={
                            pagination.current_page === 1
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                    />
                </PaginationItem>

                {/* Generate page numbers */}
                {Array.from({ length: pagination.last_page }).map((_, i) => (
                    <PaginationItem key={i} className="hidden sm:inline-block">
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(i + 1);
                            }}
                            isActive={pagination.current_page === i + 1}
                        >
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (
                                pagination.current_page < pagination.last_page
                            ) {
                                handlePageChange(pagination.current_page + 1);
                            }
                        }}
                        className={
                            pagination.current_page === pagination.last_page
                                ? "pointer-events-none opacity-50"
                                : ""
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );

    return (
        <div className="space-y-4">
            {mobileView}
            {desktopView}
            {paginationControls}
        </div>
    );
}
