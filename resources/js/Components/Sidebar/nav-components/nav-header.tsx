import { Home } from "lucide-react";

export function NavHeader() {
    return (
        <div
            className="flex flex-col items-center gap-2 py-6 bg-primary/80 rounded-b-xl transition-colors
            group-data-[collapsible=icon]:bg-transparent"
        >
            <div className="flex items-center gap-2">
                <span className="bg-primary/80 p-2 rounded-lg flex items-center justify-center">
                    <Home className="w-7 h-7 text-primary-foreground" />
                </span>
                {/* Hide the text when sidebar is collapsed */}
                <span
                    className="text-xl font-bold tracking-tight text-primary-foreground transition-all duration-200
                    group-data-[collapsible=icon]:hidden"
                >
                    Maid Match
                </span>
            </div>
        </div>
    );
}
