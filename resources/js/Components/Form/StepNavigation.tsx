import { Button } from "@/Components/ui/button";
import {
    ArrowLeft,
    ArrowRight,
    SkipForward,
    Check,
    Save,
    AlertCircle,
} from "lucide-react";

interface StepNavigationProps {
    currentStep: number;
    totalSteps: number;
    canSkip?: boolean;
    isSubmitting: boolean;
    canProceed?: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onSkip?: () => void;
    onSubmit: () => void;
    showValidation?: boolean;
    isEditMode?: boolean;
    submitText?: string;
    nextText?: string;
    previousText?: string;
    skipText?: string;
    submittingText?: string;
    editSubmittingText?: string;
}

export default function StepNavigation({
    currentStep,
    totalSteps,
    canSkip = false,
    isSubmitting,
    canProceed = true,
    onPrevious,
    onNext,
    onSkip,
    onSubmit,
    showValidation = false,
    isEditMode = false,
    submitText = "Complete Registration",
    nextText = "Next",
    previousText = "Previous",
    skipText = "Skip this step",
    submittingText = "Submitting...",
    editSubmittingText = "Saving Changes...",
}: StepNavigationProps) {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    return (
        <div className="flex items-center justify-between pt-6 pb-32 border-t border-border">
            {/* Previous Button */}
            <Button
                variant="outline"
                onClick={onPrevious}
                disabled={isFirstStep || isSubmitting}
                className="flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                {previousText}
            </Button>

            {/* Skip Button or Validation Warning */}
            {showValidation && !canProceed ? (
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-amber-600 dark:text-amber-400 text-xs sm:text-sm text-center sm:text-left">
                    <AlertCircle className="w-4 h-4 mb-1 sm:mb-0" />
                    <span>
                        <span className="block sm:inline">Please Fix</span>
                        <span className="block sm:inline">
                            Validation Errors
                        </span>
                    </span>
                </div>
            ) : canSkip && !isLastStep && onSkip ? (
                <Button
                    variant="ghost"
                    onClick={onSkip}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 text-muted-foreground"
                >
                    <SkipForward className="w-4 h-4" />
                    {skipText}
                </Button>
            ) : null}

            {/* Next/Submit Button */}
            {isLastStep ? (
                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting || (!canProceed && !isEditMode)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            {isEditMode ? editSubmittingText : submittingText}
                        </>
                    ) : (
                        <>
                            {isEditMode ? (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    {submitText}
                                </>
                            )}
                        </>
                    )}
                </Button>
            ) : (
                <div className="flex items-center gap-3">
                    <Button
                        onClick={onNext}
                        disabled={isSubmitting || !canProceed}
                        className="flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {nextText}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
