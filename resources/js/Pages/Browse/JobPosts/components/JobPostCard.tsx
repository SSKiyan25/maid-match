import { MapPin, Calendar, Home, Check, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { formatCurrency, getInitials } from "@/utils/useGeneralUtils";
import JobDetailsModal from "./JobDetailsModal";
import { useState } from "react";
import { getDayOffLabel, getAccommodationLabel } from "../utils/jobUtils";

interface JobPostCardProps {
    job: any;
    featured?: boolean;
}

export default function JobPostCard({
    job,
    featured = false,
}: JobPostCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userName = job.employer?.user?.profile
        ? `${job.employer.user.profile.first_name} ${job.employer.user.profile.last_name}`.trim()
        : job.employer?.user?.name || "Unknown";

    return (
        <div
            className={`rounded-xl overflow-hidden bg-card border shadow-sm h-full flex flex-col ${
                featured
                    ? "border-primary/50 shadow-primary/10"
                    : "border-border"
            }`}
        >
            {/* Card Header with image */}
            <div className="relative h-28 sm:h-36 flex-shrink-0">
                {job.photos && job.photos.length > 0 ? (
                    <img
                        src={`/storage/${job.photos[0].url}`}
                        alt={job.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            No image
                        </p>
                    </div>
                )}

                {featured && (
                    <Badge className="absolute top-2 left-2 bg-primary text-xs sm:text-sm">
                        Featured
                    </Badge>
                )}

                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-7 w-7 sm:h-8 sm:w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                >
                    <Heart className="h-4 w-4" />
                </Button>
            </div>

            {/* Card Content */}
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-3 flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
                        {job.title}
                    </h3>
                    <Badge
                        variant={
                            job.status === "active" ? "default" : "secondary"
                        }
                        className="text-xs capitalize sm:text-sm"
                    >
                        {job.status}
                    </Badge>
                </div>

                <div className="flex gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground items-center">
                    <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                    <span className="line-clamp-1">
                        {job.location?.city}, {job.location?.brgy}
                    </span>
                </div>

                <div className="flex flex-wrap gap-y-0.5 gap-x-2 sm:gap-y-1 sm:gap-x-3 text-xs">
                    <div className="flex items-center">
                        <Home className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 text-muted-foreground" />
                        <span>
                            {getAccommodationLabel(job.accommodation_type)}
                        </span>
                    </div>
                </div>

                <div className="pt-0.5 sm:pt-1">
                    <p className="text-xs sm:text-sm font-medium">
                        ₱{formatCurrency(job.min_salary)} - ₱
                        {formatCurrency(job.max_salary)}
                    </p>
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                    <p className="text-xs text-muted-foreground">Work Types:</p>
                    <div className="flex flex-wrap gap-0.5 sm:gap-1">
                        {job.work_types?.map((type: string, index: number) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="text-xs capitalize"
                            >
                                {type}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="pt-1 sm:pt-2 flex items-center gap-1 sm:gap-2">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                        <AvatarImage
                            src={
                                job.employer?.user?.avatar
                                    ? `/storage/${job.employer.user.avatar}`
                                    : undefined
                            }
                        />
                        <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-xs font-medium line-clamp-1">
                            {userName}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                            <span>Verified</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Footer */}
            <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 mt-auto">
                <Button
                    className="w-full text-xs sm:text-sm py-2 sm:py-2.5"
                    variant="default"
                    onClick={() => setIsModalOpen(true)}
                >
                    View Details
                </Button>
            </div>
            <JobDetailsModal
                job={job}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
