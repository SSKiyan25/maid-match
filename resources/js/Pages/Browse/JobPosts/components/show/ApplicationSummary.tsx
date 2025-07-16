import { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { AlertCircle, X, SendIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { getInitials } from "@/utils/useGeneralUtils";
import { calculateMaidJobMatch } from "../../utils/matchingUtils";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

export default function ApplicationSummary({
    selectedMaids,
    availableCredits,
    job,
    onRemoveMaid,
}: {
    selectedMaids: any[];
    availableCredits: number;
    job: any;
    onRemoveMaid: (maidId: any) => void;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        console.log("Submitting application for maids:", selectedMaids);
        setIsSubmitting(true);
        router.post(
            route("browse.job-applications.apply", { jobPost: job.id }),
            {
                maid_ids: selectedMaids.map((m) => m.id),
                description: "",
                job_posting_id: job.id,
            },
            {
                onSuccess: (page) => {
                    setIsSubmitting(false);
                    toast.success("Application submitted successfully!");
                    if (typeof page.props.redirect === "string") {
                        router.visit(page.props.redirect);
                    }
                },
                onError: (errors) => {
                    setIsSubmitting(false);
                    console.log("Error submitting application:", errors);
                    toast.error(
                        errors.message || "Failed to submit application"
                    );
                },
            }
        );
    };

    return (
        <>
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                        Application Summary
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {selectedMaids.length === 0 ? (
                        <Alert className="bg-muted">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Please select at least one maid to apply for
                                this job
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <p className="text-sm text-muted-foreground mb-3">
                                You've selected {selectedMaids.length}{" "}
                                {selectedMaids.length === 1 ? "maid" : "maids"}{" "}
                                to apply for this job. This will use{" "}
                                {selectedMaids.length} of your{" "}
                                {availableCredits} available credits.
                            </p>

                            <div className="space-y-2">
                                {selectedMaids.map((maid) => {
                                    const profile = maid.user.profile;
                                    const avatar = maid.user.avatar;
                                    const matchResult = calculateMaidJobMatch(
                                        maid,
                                        job
                                    );

                                    return (
                                        <div
                                            key={maid.id}
                                            className="flex items-center justify-between p-2 rounded-md bg-muted"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            avatar
                                                                ? `/storage/${avatar}`
                                                                : undefined
                                                        }
                                                        alt={`${profile.first_name} ${profile.last_name}`}
                                                    />
                                                    <AvatarFallback>
                                                        {getInitials(
                                                            `${profile.first_name} ${profile.last_name}`
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">
                                                    {profile.first_name}{" "}
                                                    {profile.last_name}
                                                </span>
                                                {/* Display match percentage */}
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    {matchResult.percentage}%
                                                    match
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                                onClick={() =>
                                                    onRemoveMaid(maid.id)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full"
                        disabled={selectedMaids.length === 0 || isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? (
                            "Submitting..."
                        ) : (
                            <>
                                <SendIcon className="mr-2 h-4 w-4" />
                                Submit Application
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {/* Submitting Modal */}
            <Dialog open={isSubmitting}>
                <DialogContent className="flex flex-col items-center gap-4 py-10">
                    <VisuallyHidden>
                        <DialogTitle>Submitting Application</DialogTitle>
                        <DialogDescription>
                            Please wait while we process your request.
                        </DialogDescription>
                    </VisuallyHidden>
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                    <div className="text-lg font-medium text-center">
                        Submitting your application...
                    </div>
                    <div className="text-sm text-muted-foreground text-center">
                        Please wait while we process your request.
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
