import React, { useState } from "react";
import { Search, MapPin, Sliders } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="rounded-xl bg-card p-4 shadow-sm space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search job titles, locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-xs sm:text-sm"
                />
            </div>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs justify-start"
                >
                    <MapPin className="mr-2 h-3.5 w-3.5" />
                    Near Me
                </Button>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-xs justify-start"
                        >
                            <Sliders className="mr-2 h-3.5 w-3.5" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Filter Jobs</SheetTitle>
                            <SheetDescription>
                                Narrow down your job search
                            </SheetDescription>
                        </SheetHeader>
                        {/* Filter options will go here */}
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
