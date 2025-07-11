import { Button } from "@/Components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function MaidsHeader() {
    return (
        <div className="space-y-3 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    Maid Management
                </h1>
                <Link href={route("agency.maids.create")}>
                    <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        <span>Add New Maid</span>
                    </Button>
                </Link>
            </div>
            <p className="text-muted-foreground max-w-3xl">
                Manage all your registered maids in one place. View their
                profiles, update their information, and manage their
                availability status. Add new maids to your agency or archive
                those who are no longer active.
            </p>
        </div>
    );
}
