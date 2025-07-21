import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { StarIcon, Flag } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import { format } from "date-fns";

interface Review {
    id: string;
    authorName: string;
    authorAvatar?: string;
    authorRole?: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ProfileReviewsProps {
    reviews?: Review[];
    showAddReview?: boolean;
    canReport?: boolean;
    title?: string;
}

export default function ProfileReviews({
    reviews = [],
    showAddReview = true,
    canReport = true,
    title = "Reviews & Feedback",
}: ProfileReviewsProps) {
    const [isWritingReview, setIsWritingReview] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        // This would connect to an API in a real implementation
        alert(`Review submitted: ${selectedRating} stars, "${reviewText}"`);
        setReviewText("");
        setSelectedRating(0);
        setIsWritingReview(false);
    };

    const handleReport = (reviewId: string) => {
        // This would connect to an API in a real implementation
        alert(`Reported review ${reviewId}`);
    };

    // Show demo reviews if none are provided
    const displayReviews =
        reviews.length > 0
            ? reviews
            : [
                  {
                      id: "1",
                      authorName: "Sarah Johnson",
                      authorAvatar: "",
                      authorRole: "Maid",
                      rating: 5,
                      comment:
                          "Amazing employer! Very respectful, clear with instructions, and always paid on time. The family is wonderful and I enjoyed working with them.",
                      createdAt: "2025-06-10T08:30:00Z",
                  },
                  {
                      id: "2",
                      authorName: "Michael Chen",
                      authorAvatar: "",
                      authorRole: "Agency Manager",
                      rating: 4,
                      comment:
                          "Good communication and reliable. Had a positive experience working with this client for multiple placements.",
                      createdAt: "2025-05-23T14:45:00Z",
                  },
              ];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{title}</CardTitle>
                {showAddReview && !isWritingReview && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsWritingReview(true)}
                    >
                        Write a Review
                    </Button>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Add Review Form */}
                {isWritingReview && (
                    <div className="mb-6 p-4 bg-muted/40 rounded-lg">
                        <h3 className="font-medium mb-2">
                            Share Your Experience
                        </h3>
                        <form
                            onSubmit={handleSubmitReview}
                            className="space-y-4"
                        >
                            <div>
                                <div className="mb-2 text-sm text-muted-foreground">
                                    Rating
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            type="button"
                                            onClick={() =>
                                                setSelectedRating(rating)
                                            }
                                            className="focus:outline-none"
                                        >
                                            <StarIcon
                                                className={`h-6 w-6 ${
                                                    rating <= selectedRating
                                                        ? "text-yellow-500 fill-yellow-500"
                                                        : "text-muted-foreground"
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 text-sm text-muted-foreground">
                                    Your Review
                                </div>
                                <Textarea
                                    placeholder="Share details about your experience..."
                                    value={reviewText}
                                    onChange={(e) =>
                                        setReviewText(e.target.value)
                                    }
                                    rows={4}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsWritingReview(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={
                                        selectedRating === 0 ||
                                        !reviewText.trim()
                                    }
                                >
                                    Submit Review
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Reviews List */}
                {displayReviews.length > 0 ? (
                    <div className="space-y-4">
                        {displayReviews.map((review, index) => (
                            <div key={review.id} className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={review.authorAvatar}
                                            alt={review.authorName}
                                        />
                                        <AvatarFallback>
                                            {review.authorName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium">
                                                    {review.authorName}
                                                </h4>
                                                {review.authorRole && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs mt-0.5"
                                                    >
                                                        {review.authorRole}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">
                                                    {format(
                                                        new Date(
                                                            review.createdAt
                                                        ),
                                                        "MMM d, yyyy"
                                                    )}
                                                </span>

                                                {canReport && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() =>
                                                            handleReport(
                                                                review.id
                                                            )
                                                        }
                                                        title="Report this review"
                                                    >
                                                        <Flag className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center my-1">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < review.rating
                                                            ? "text-yellow-500 fill-yellow-500"
                                                            : "text-muted-foreground"
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        <p className="text-sm mt-2">
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>

                                {index < displayReviews.length - 1 && (
                                    <Separator className="my-4" />
                                )}
                            </div>
                        ))}

                        {displayReviews.length > 2 && (
                            <Button
                                variant="outline"
                                className="w-full"
                                size="sm"
                            >
                                View All Reviews
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <StarIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <h3 className="text-lg font-medium">No Reviews Yet</h3>
                        <p className="text-sm text-muted-foreground max-w-md mt-1 mx-auto">
                            Be the first to share your experience working with
                            this profile.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
