import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";

export default function StatusInfo() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </span>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                    <div className="space-y-2 p-1">
                        <p className="font-semibold">Status Information</p>
                        <p>
                            <strong>Application Status:</strong> Shows the
                            status of this specific job application.
                        </p>
                        <p>
                            <strong>Maid Status:</strong> Shows the overall
                            employment status of the maid in the system.
                        </p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
