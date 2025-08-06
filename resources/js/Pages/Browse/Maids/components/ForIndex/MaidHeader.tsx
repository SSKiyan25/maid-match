import { Sparkles, UserSearch } from "lucide-react";

export default function MaidHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between py-4 md:py-8">
            <div className="space-y-2">
                <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                        <UserSearch className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Find Your Perfect Match
                    </h1>
                </div>
                <p className="text-muted-foreground max-w-2xl">
                    Browse through qualified maids that match your requirements.
                    Our matching system helps you find the perfect fit for your
                    home based on skills, location, and preferences.
                </p>
            </div>

            <div className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-primary/5 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <span className="text-sm font-medium">
                    Matches updated daily
                </span>
            </div>
        </div>
    );
}
