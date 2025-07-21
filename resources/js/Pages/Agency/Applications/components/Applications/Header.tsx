import { Button } from "@/Components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ApplicationsHeaderProps {
    applications: any[];
}

export default function ApplicationsHeader({
    applications,
}: ApplicationsHeaderProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:hidden"
                    asChild
                >
                    <a href={route("agency.dashboard")}>
                        <ArrowLeft className="h-4 w-4" />
                    </a>
                </Button>
                <h1 className="text-2xl font-bold md:text-3xl">
                    Maid Applications
                </h1>
            </div>
            <p className="text-muted-foreground">
                Manage applications submitted by your maids to various job
                postings.
            </p>

            {/* Stats cards will go here in the future */}
        </div>
    );
}
