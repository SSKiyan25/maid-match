import { useState, useEffect } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";

export function useBookmark(maidId: string | number) {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check initial bookmark status when component mounts
    useEffect(() => {
        const checkBookmarkStatus = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `/browse/bookmarks/${maidId}/check`
                );

                if (response.data.success) {
                    setIsBookmarked(response.data.bookmarked);
                } else {
                    console.warn(
                        "Bookmark check returned failure but still setting state:",
                        response.data
                    );
                    setIsBookmarked(response.data.bookmarked || false);
                }
            } catch (err) {
                console.error("Error checking bookmark status:", err);
                setIsBookmarked(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkBookmarkStatus();
    }, [maidId]);

    // Toggle bookmark status
    const toggleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            setIsLoading(true);
            setError(null);

            const response = await axios.post(
                `/browse/bookmarks/${maidId}/toggle`
            );

            if (response.data.success) {
                setIsBookmarked(response.data.bookmarked);
            } else {
                // Handle auth redirect if user isn't logged in
                if (response.status === 401 || response.status === 419) {
                    router.visit("/login");
                    return;
                }

                setError(response.data.message || "Failed to update bookmark");
            }
        } catch (err: any) {
            // Handle auth redirect if user isn't logged in
            if (err.response?.status === 401 || err.response?.status === 419) {
                router.visit("/login");
                return;
            }

            console.error("Bookmark toggle error:", err);
            setError(
                err.response?.data?.message || "Failed to update bookmark"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isBookmarked,
        isLoading,
        error,
        toggleBookmark,
    };
}
