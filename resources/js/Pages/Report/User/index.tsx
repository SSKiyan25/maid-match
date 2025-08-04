import { useState, useEffect } from "react";
import { Head, useForm, Link, usePage, router } from "@inertiajs/react";
import { ArrowLeft, Flag, Loader2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import UserInfo from "./components/UserInfo";
import ReportForm from "./components/ReportForm";
import ConfirmationDialog from "./components/ConfirmationDialog";

// Import all possible layouts
import EmployerLayout from "@/Layouts/EmployerLayout";
import AgencyLayout from "@/Layouts/AgencyLayout";
import GuestLayout from "@/Layouts/GuestLayout";

interface ReportUserPageProps {
    reportedUser: {
        id: number;
        email: string;
        avatar: string | null;
        role: string;
        status: string;
        created_at: string;
        profile?: {
            first_name?: string;
            last_name?: string;
            phone_number?: string;
        };
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ReportUserPage({
    reportedUser,
    flash,
}: ReportUserPageProps) {
    const { auth } = usePage().props as any;
    const userRole = auth.user?.role;

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get the user's display name
    const userName = reportedUser.profile
        ? `${reportedUser.profile.first_name || ""} ${
              reportedUser.profile.last_name || ""
          }`.trim()
        : reportedUser.email;

    const { processing } = useForm();

    const handleFormSubmit = (data: any) => {
        setFormData(data);
        setConfirmDialogOpen(true);
    };

    const submitReport = () => {
        setIsSubmitting(true);
        setConfirmDialogOpen(false);

        router.post(route("report.user.store"), formData, {
            forceFormData: true,
            onSuccess: () => {
                setIsSubmitting(false);
                toast.success(
                    "Report submitted successfully! Our team will review it shortly."
                );
            },
            onError: () => {
                setIsSubmitting(false);
                toast.error(
                    "There was an error submitting your report. Please try again."
                );
            },
        });
    };

    // Loading overlay component
    const LoadingOverlay = () =>
        isSubmitting ? (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-background p-6 rounded-lg shadow-lg flex flex-col items-center max-w-sm mx-auto">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                        Processing Your Report
                    </h3>
                    <p className="text-sm text-muted-foreground text-center">
                        Please wait while we submit your report...
                    </p>
                </div>
            </div>
        ) : null;

    // Determine which layout to use based on user role
    const PageContent = () => (
        <>
            <Head title={`Report ${userName}`} />
            <LoadingOverlay />

            <div className="container max-w-2xl mx-auto px-4 py-6 mb-16">
                {/* Back button */}
                <Button
                    variant="ghost"
                    className="mb-4 p-0 flex items-center text-muted-foreground hover:text-foreground"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl md:text-2xl flex items-center">
                            <Flag className="h-5 w-5 mr-2 text-destructive" />
                            Report User
                        </CardTitle>
                        <CardDescription>
                            Please provide details about why you are reporting
                            this user
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* User being reported */}
                        <UserInfo
                            userName={userName}
                            avatar={reportedUser.avatar}
                            role={reportedUser.role}
                        />

                        {/* Report Form */}
                        <ReportForm
                            reportedUserId={reportedUser.id}
                            onSubmit={handleFormSubmit}
                            disabled={isSubmitting}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={submitReport}
                userName={userName}
                reportType={formData?.report_type || ""}
                isProcessing={processing || isSubmitting}
            />
        </>
    );

    // Choose layout based on user role
    if (userRole === "employer") {
        return (
            <EmployerLayout sidebarDefaultOpen={false}>
                <PageContent />
            </EmployerLayout>
        );
    } else if (userRole === "agency") {
        return (
            <AgencyLayout sidebarDefaultOpen={false}>
                <PageContent />
            </AgencyLayout>
        );
    } else {
        // Fallback to guest layout or another appropriate layout
        return (
            <GuestLayout>
                <PageContent />
            </GuestLayout>
        );
    }
}
