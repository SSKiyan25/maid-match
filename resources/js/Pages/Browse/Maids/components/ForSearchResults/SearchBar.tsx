import { Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { useState } from "react";

interface SearchBarProps {
    initialValue: string;
    onSearch: (term: string) => void;
    isLoading?: boolean;
}

export default function SearchBar({
    initialValue,
    onSearch,
    isLoading = false,
}: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="relative flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Refine your search..."
                    className="pl-9 pr-24 h-11"
                    value={searchTerm || ""}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={isLoading}
                />
                <Button
                    type="submit"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                    disabled={isLoading || !searchTerm.trim()}
                >
                    Search
                </Button>
            </div>
        </form>
    );
}
