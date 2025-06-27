import { Button } from "@/Components/ui/button";
import {
    ArrowLeft,
    ArrowRight,
    SkipForward,
    Check,
    AlertCircle,
} from "lucide-react";

interface StepNavigationProps {
    currentStep: number;
    totalSteps: number;
    canSkip: boolean;
    isSubmitting: boolean;
    canProceed: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onSkip: () => void;
    onSubmit: () => void;
    showValidation?: boolean;
}

export default function StepNavigation({
    currentStep,
    totalSteps,
    canSkip,
    isSubmitting,
    canProceed,
    onPrevious,
    onNext,
    onSkip,
    onSubmit,
    showValidation,
}: StepNavigationProps) {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    return (
        <div className="flex items-center justify-between pt-6 border-t border-border">
            {/* Previous Button */}
            <Button
                variant="outline"
                onClick={onPrevious}
                disabled={isFirstStep || isSubmitting}
                className="flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Previous
            </Button>

            {/* Skip Button (for optional steps) */}
            {canSkip && !isLastStep && (
                <Button
                    variant="ghost"
                    onClick={onSkip}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 text-muted-foreground"
                >
                    <SkipForward className="w-4 h-4" />
                    Skip this step
                </Button>
            )}

            {/* Next/Submit Button */}
            {isLastStep ? (
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating Account...
                        </>
                    ) : (
                        <>
                            <Check className="w-4 h-4" />
                            Complete Registration
                        </>
                    )}
                </Button>
            ) : (
                <div className="flex items-center gap-3">
                    <Button
                        onClick={onNext}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
