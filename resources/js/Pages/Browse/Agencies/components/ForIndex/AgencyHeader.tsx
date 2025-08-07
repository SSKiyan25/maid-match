import { Building2 } from "lucide-react";

export default function AgencyHeader() {
    return (
        <div className="space-y-2">
            <div className="flex items-center">
                <Building2 className="h-7 w-7 mr-3 text-primary" />
                <h1 className="text-3xl font-bold">Browse Agencies</h1>
            </div>
            <p className="text-muted-foreground max-w-3xl">
                Find reputable domestic helper agencies to help with your
                recruitment needs. You can browse agencies based on their
                popularity, verification status, and more.
            </p>
        </div>
    );
}
