import { Button } from "@/Components/ui/button";
import { FileX } from "lucide-react";

interface EmptyStateProps {
    onReset: () => void;
}

export default function EmptyState({ onReset }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-muted rounded-full p-3 mb-4">
                <FileX className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No applications found</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
                No applications match your current filters. Try adjusting your
                search or filter criteria.
            </p>
            <Button onClick={onReset}>Reset Filters</Button>
        </div>
    );
}
