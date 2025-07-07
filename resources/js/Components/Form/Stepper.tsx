import {
    Check,
    ChevronDown,
    ChevronUp,
    Lock,
    Info,
    AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/Components/ui/alert";

interface Step {
    id: number;
    title: string;
    required: boolean;
    description: string;
}

interface FormStepperProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (stepId: number) => void;
    isStepAccessible: (stepId: number) => boolean;
    completedSteps: Set<number>;
    stepValidation: Record<number, boolean>;
    isEditMode?: boolean;
    formType?: string; // e.g., "job posting", "registration", "profile update"
    gridCols?: 2 | 3; // Desktop grid layout columns
    showNavigation?: boolean; // Whether this is interactive (clickable) or just display
}

export default function FormStepper({
    steps,
    currentStep,
    onStepClick,
    isStepAccessible,
    completedSteps,
    stepValidation,
    isEditMode = false,
    formType = "form",
    gridCols = 3,
    showNavigation = true,
}: FormStepperProps) {
    const [showDetails, setShowDetails] = useState(false);
    const currentStepData = steps.find((step) => step.id === currentStep);

    const getStepStatus = (step: Step) => {
        const isValid = stepValidation[step.id];

        if (completedSteps.has(step.id) && step.id < currentStep) {
            return isValid ? "completed" : "completed-invalid";
        }
        if (step.id === currentStep) {
            return isValid ? "current" : "current-invalid";
        }
        if (isStepAccessible(step.id)) {
            return "accessible";
        }
        return "locked";
    };

    const isStepClickable = (step: Step): boolean => {
        if (!showNavigation || !onStepClick) return false;

        // Check if ANY step has validation errors
        const hasAnyValidationErrors = Object.values(stepValidation).some(
            (isValid) => !isValid
        );

        // If ANY step is invalid, disable ALL navigation except staying on current step
        if (hasAnyValidationErrors && step.id !== currentStep) {
            return false;
        }

        const accessible = isStepAccessible(step.id);
        return accessible;
    };

    const getStepTooltip = (step: Step): string => {
        const accessible = isStepAccessible(step.id);
        const clickable = isStepClickable(step);
        const isValid = stepValidation[step.id];
        const hasAnyValidationErrors = Object.values(stepValidation).some(
            (isValid) => !isValid
        );

        if (hasAnyValidationErrors && step.id !== currentStep) {
            return "Please fix all validation errors before navigating between steps";
        }

        if (!accessible) {
            return "Complete previous required steps first";
        }

        if (step.id < currentStep && !isValid) {
            return `${step.title} has validation errors - click to fix`;
        }

        return `${step.title} ${step.required ? "(Required)" : "(Optional)"}`;
    };

    const handleStepClick = (step: Step) => {
        if (isStepClickable(step) && onStepClick) {
            onStepClick(step.id);
        }
    };

    const getFormTypeText = () => {
        if (isEditMode) {
            return `Updating ${formType}`;
        }
        return `Creating new ${formType}`;
    };

    return (
        <div className="w-full">
            {/* Help Message */}
            <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                    <p className="text-sm">
                        <span className="font-medium">
                            {getFormTypeText()} - Required steps (marked with *)
                        </span>{" "}
                        must be completed before you can{" "}
                        {isEditMode ? "save changes" : "proceed"}. Optional
                        steps can be skipped.
                    </p>
                </AlertDescription>
            </Alert>

            {Object.values(stepValidation).some((isValid) => !isValid) && (
                <Alert className="mb-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                        <p className="text-sm">
                            <span className="font-medium">
                                Validation Required:
                            </span>{" "}
                            Please fix all validation errors before navigating
                            between steps. Step navigation is currently
                            disabled.
                        </p>
                    </AlertDescription>
                </Alert>
            )}

            {/* Header */}
            <div className="bg-card dark:bg-card rounded-lg border border-border dark:border-border shadow-sm p-4 mb-4">
                {/* Current Step Info */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                                stepValidation[currentStep]
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-amber-500 text-white"
                            }`}
                        >
                            {stepValidation[currentStep] ? (
                                currentStep
                            ) : (
                                <AlertTriangle className="w-4 h-4" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-foreground dark:text-foreground">
                                {currentStepData?.title}
                                {currentStepData?.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                                {!currentStepData?.required && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2 dark:bg-blue-900/30 dark:text-blue-300">
                                        Optional
                                    </span>
                                )}
                                {/* Show validation status */}
                                {!stepValidation[currentStep] &&
                                    currentStepData?.required && (
                                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-2 dark:bg-amber-900/30 dark:text-amber-300">
                                            Needs Attention
                                        </span>
                                    )}
                            </h3>
                            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                                Step {currentStep} of {steps.length}
                                {isEditMode && " • Editing"}
                            </p>
                        </div>
                    </div>

                    {/* Toggle Details Button */}
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="p-2 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-foreground transition-colors lg:hidden"
                    >
                        {showDetails ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                            Progress
                        </span>
                        <span className="text-xs font-medium text-primary dark:text-primary">
                            {Math.round((currentStep / steps.length) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-muted dark:bg-muted rounded-full h-1.5">
                        <div
                            className="bg-primary dark:bg-primary h-1.5 rounded-full transition-all duration-300 ease-out"
                            style={{
                                width: `${(currentStep / steps.length) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {/* Mini Steps Indicator */}
                <div className="flex justify-center gap-1">
                    {steps.map((step) => {
                        const status = getStepStatus(step);
                        const clickable = isStepClickable(step);
                        const isValid = stepValidation[step.id];

                        return (
                            <button
                                key={step.id}
                                disabled={!clickable}
                                onClick={() => handleStepClick(step)}
                                title={getStepTooltip(step)}
                                className={`h-2 rounded-full transition-all duration-200 relative ${
                                    status === "completed"
                                        ? "w-2 bg-emerald-500 dark:bg-emerald-400"
                                        : status === "completed-invalid"
                                        ? "w-2 bg-amber-500 dark:bg-amber-400"
                                        : status === "current"
                                        ? "w-4 bg-primary dark:bg-primary"
                                        : status === "current-invalid"
                                        ? "w-4 bg-amber-500 dark:bg-amber-400"
                                        : status === "accessible"
                                        ? `w-2 ${
                                              clickable
                                                  ? "bg-muted-foreground/50 dark:bg-muted-foreground/50 hover:bg-muted-foreground/70 dark:hover:bg-muted-foreground/70"
                                                  : "bg-muted-foreground/20 dark:bg-muted-foreground/20 cursor-not-allowed"
                                          }`
                                        : "w-2 bg-muted-foreground/20 dark:bg-muted-foreground/20 cursor-not-allowed"
                                } ${!clickable ? "opacity-50" : ""}`}
                            >
                                {/* Required indicator dot */}
                                {step.required && (
                                    <div className="absolute -top-1 -right-0.5 w-1 h-1 bg-red-500 rounded-full dark:bg-red-400" />
                                )}
                                {/* Validation error indicator */}
                                {!isValid && step.id < currentStep && (
                                    <div className="absolute -top-1 -left-0.5 w-1 h-1 bg-amber-500 rounded-full dark:bg-amber-400" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Expandable Details for Mobile */}
            {showDetails && (
                <div className="bg-card dark:bg-card rounded-lg border border-border dark:border-border shadow-sm p-4 mb-4 space-y-3 lg:hidden">
                    {steps.map((step, index) => {
                        const status = getStepStatus(step);
                        const clickable = isStepClickable(step);
                        const isValid = stepValidation[step.id];

                        return (
                            <div
                                key={step.id}
                                onClick={() => handleStepClick(step)}
                                className={`flex items-start gap-3 p-3 rounded-lg transition-all border ${
                                    status === "current"
                                        ? "bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30"
                                        : status === "current-invalid"
                                        ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
                                        : status === "completed"
                                        ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                                        : status === "completed-invalid"
                                        ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20"
                                        : status === "accessible"
                                        ? `${
                                              clickable
                                                  ? "hover:bg-muted/50 dark:hover:bg-muted/50 border-transparent cursor-pointer"
                                                  : "border-transparent opacity-60 cursor-not-allowed"
                                          }`
                                        : "border-transparent opacity-60"
                                } ${
                                    clickable
                                        ? "cursor-pointer"
                                        : "cursor-not-allowed"
                                }`}
                                title={getStepTooltip(step)}
                            >
                                {/* Step Circle */}
                                <div
                                    className={`flex items-center justify-center w-6 h-6 rounded-full border flex-shrink-0 relative ${
                                        status === "completed"
                                            ? "bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-400 dark:border-emerald-400"
                                            : status === "completed-invalid"
                                            ? "bg-amber-500 border-amber-500 text-white dark:bg-amber-400 dark:border-amber-400"
                                            : status === "current"
                                            ? "bg-primary border-primary text-primary-foreground dark:bg-primary dark:border-primary"
                                            : status === "current-invalid"
                                            ? "bg-amber-500 border-amber-500 text-white dark:bg-amber-400 dark:border-amber-400"
                                            : status === "accessible"
                                            ? "bg-background border-border text-muted-foreground dark:bg-background dark:border-border dark:text-muted-foreground"
                                            : "bg-muted/50 border-muted text-muted-foreground/50 dark:bg-muted/50 dark:border-muted dark:text-muted-foreground/50"
                                    }`}
                                >
                                    {status === "completed" ? (
                                        <Check className="w-3 h-3" />
                                    ) : status === "completed-invalid" ||
                                      status === "current-invalid" ? (
                                        <AlertTriangle className="w-3 h-3" />
                                    ) : status === "locked" ? (
                                        <Lock className="w-2.5 h-2.5" />
                                    ) : (
                                        <span className="text-xs font-bold">
                                            {step.id}
                                        </span>
                                    )}

                                    {/* Required indicator */}
                                    {step.required && (
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:bg-red-400 dark:border-gray-800" />
                                    )}
                                </div>

                                {/* Step Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4
                                            className={`text-sm font-medium ${
                                                clickable
                                                    ? "text-foreground dark:text-foreground"
                                                    : "text-muted-foreground/70 dark:text-muted-foreground/70"
                                            }`}
                                        >
                                            {step.title}
                                            {step.required && (
                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>
                                            )}
                                        </h4>
                                        {!step.required && (
                                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                                Optional
                                            </span>
                                        )}
                                        {/* Validation status badge */}
                                        {!isValid && step.id < currentStep && (
                                            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                                Needs Fix
                                            </span>
                                        )}
                                    </div>
                                    <p
                                        className={`text-xs ${
                                            clickable
                                                ? "text-muted-foreground dark:text-muted-foreground"
                                                : "text-muted-foreground/50 dark:text-muted-foreground/50"
                                        }`}
                                    >
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Desktop Grid Layout */}
            <div className="hidden lg:block">
                <div className="bg-card dark:bg-card rounded-lg border border-border dark:border-border shadow-sm p-4">
                    <div className={`grid grid-cols-${gridCols} gap-4`}>
                        {steps.map((step, index) => {
                            const status = getStepStatus(step);
                            const clickable = isStepClickable(step);
                            const isValid = stepValidation[step.id];

                            return (
                                <div
                                    key={step.id}
                                    onClick={() => handleStepClick(step)}
                                    className={`relative p-4 rounded-lg border transition-all duration-200 ${
                                        status === "current"
                                            ? "bg-primary/5 dark:bg-primary/10 border-primary/30 dark:border-primary/40"
                                            : status === "current-invalid"
                                            ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30"
                                            : status === "completed"
                                            ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30"
                                            : status === "completed-invalid"
                                            ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30"
                                            : status === "accessible"
                                            ? `border-border dark:border-border ${
                                                  clickable
                                                      ? "hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-md cursor-pointer"
                                                      : "cursor-not-allowed opacity-60"
                                              }`
                                            : "border-muted/50 dark:border-muted/50 opacity-60"
                                    } ${
                                        clickable
                                            ? "cursor-pointer"
                                            : "cursor-not-allowed"
                                    }`}
                                    title={getStepTooltip(step)}
                                >
                                    {/* Step Header */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className={`flex items-center justify-center w-8 h-8 rounded-full border flex-shrink-0 relative ${
                                                status === "completed"
                                                    ? "bg-emerald-500 border-emerald-500 text-white dark:bg-emerald-400 dark:border-emerald-400"
                                                    : status ===
                                                      "completed-invalid"
                                                    ? "bg-amber-500 border-amber-500 text-white dark:bg-amber-400 dark:border-amber-400"
                                                    : status === "current"
                                                    ? "bg-primary border-primary text-primary-foreground dark:bg-primary dark:border-primary"
                                                    : status ===
                                                      "current-invalid"
                                                    ? "bg-amber-500 border-amber-500 text-white dark:bg-amber-400 dark:border-amber-400"
                                                    : status === "accessible"
                                                    ? "bg-background border-border text-muted-foreground dark:bg-background dark:border-border dark:text-muted-foreground"
                                                    : "bg-muted/50 border-muted text-muted-foreground/50 dark:bg-muted/50 dark:border-muted dark:text-muted-foreground/50"
                                            }`}
                                        >
                                            {status === "completed" ? (
                                                <Check className="w-4 h-4" />
                                            ) : status ===
                                                  "completed-invalid" ||
                                              status === "current-invalid" ? (
                                                <AlertTriangle className="w-4 h-4" />
                                            ) : status === "locked" ? (
                                                <Lock className="w-3 h-3" />
                                            ) : (
                                                <span className="text-xs font-bold">
                                                    {step.id}
                                                </span>
                                            )}

                                            {/* Required indicator */}
                                            {step.required && (
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:bg-red-400 dark:border-gray-800" />
                                            )}
                                        </div>

                                        {!step.required && (
                                            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                                                Optional
                                            </span>
                                        )}

                                        {/* Validation status badge */}
                                        {!isValid && step.id < currentStep && (
                                            <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                                                Fix
                                            </span>
                                        )}
                                    </div>

                                    {/* Step Content */}
                                    <div>
                                        <h4
                                            className={`text-sm font-semibold mb-1 text-foreground dark:text-foreground`}
                                        >
                                            {step.title}
                                            {step.required && (
                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>
                                            )}
                                        </h4>
                                        <p
                                            className={`text-xs leading-relaxed text-muted-foreground dark:text-muted-foreground`}
                                        >
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Connection Arrow (only for grid layouts) */}
                                    {index < steps.length - 1 &&
                                        index % gridCols !== gridCols - 1 && (
                                            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2">
                                                <div
                                                    className={`w-4 h-0.5 ${
                                                        status === "completed"
                                                            ? "bg-emerald-400 dark:bg-emerald-300"
                                                            : status ===
                                                              "completed-invalid"
                                                            ? "bg-amber-400 dark:bg-amber-300"
                                                            : "bg-border dark:bg-border"
                                                    }`}
                                                />
                                            </div>
                                        )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
