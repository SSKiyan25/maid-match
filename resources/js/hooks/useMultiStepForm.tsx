import { useState, useCallback } from "react";
import { toast } from "sonner";

export interface Step {
    id: number;
    title: string;
    component?: any;
    required: boolean;
    description: string;
}

interface UseMultiStepFormProps {
    steps: Step[];
    initialStepValidation?: Record<number, boolean>;
    onValidateStep?: (step: number, formData: any) => Promise<boolean>;
    onSubmit?: () => Promise<void>;
    allowNavigationWithErrors?: boolean;
}

export function useMultiStepForm({
    steps,
    initialStepValidation = {},
    onValidateStep,
    onSubmit,
    allowNavigationWithErrors = false,
}: UseMultiStepFormProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(
        new Set([1])
    );
    const [showValidation, setShowValidation] = useState(false);

    // Initialize step validation with defaults
    const defaultValidation = steps.reduce((acc, step) => {
        acc[step.id] = step.required ? false : true;
        return acc;
    }, {} as Record<number, boolean>);

    const [stepValidation, setStepValidation] = useState<
        Record<number, boolean>
    >({
        ...defaultValidation,
        ...initialStepValidation,
    });

    const currentStepData = steps.find((step) => step.id === currentStep);

    const handleStepValidationChange = useCallback(
        (step: number, isValid: boolean) => {
            setStepValidation((prev) => ({
                ...prev,
                [step]: isValid,
            }));
        },
        []
    );

    const isStepAccessible = (stepId: number): boolean => {
        if (stepId === currentStep) return true;
        if (stepId < currentStep) return true;
        return completedSteps.has(stepId) || stepId === currentStep + 1;
    };

    const handleStepClick = (stepId: number) => {
        if (isStepAccessible(stepId)) {
            setShowValidation(false);
            setCurrentStep(stepId);
        }
    };

    const hasAnyValidationErrors = Object.values(stepValidation).some(
        (isValid) => !isValid
    );

    const handleNext = async (formData?: any) => {
        setShowValidation(true);
        const isClientValid = stepValidation[currentStep];

        if (!isClientValid) {
            return;
        }

        // Server-side validation for required steps
        // if (currentStepData?.required && onValidateStep) {
        //     console.log("Validating step on server:", currentStep);
        //     console.log("Validation Error:", stepValidation[currentStep]);
        //     const isServerValid = await onValidateStep(currentStep, formData);
        //     if (!isServerValid) {
        //         return;
        //     }
        // }

        if (currentStep < steps.length) {
            const newCompletedSteps = new Set(completedSteps);
            newCompletedSteps.add(currentStep);
            newCompletedSteps.add(currentStep + 1);
            setCompletedSteps(newCompletedSteps);
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (!allowNavigationWithErrors && hasAnyValidationErrors) {
            toast.error(
                "Cannot navigate: There are validation errors in the form"
            );
            return;
        }

        setShowValidation(false);
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = async () => {
        if (!allowNavigationWithErrors && hasAnyValidationErrors) {
            toast.error("Cannot skip: There are validation errors in the form");
            return;
        }

        setShowValidation(false);
        if (!currentStepData?.required && currentStep < steps.length) {
            const newCompletedSteps = new Set(completedSteps);
            newCompletedSteps.add(currentStep);
            newCompletedSteps.add(currentStep + 1);
            setCompletedSteps(newCompletedSteps);
            setCurrentStep(currentStep + 1);
        }
    };

    const handleSubmit = async () => {
        const allRequiredStepsValid = steps.every((step) => {
            if (step.required) {
                return stepValidation[step.id];
            }
            return true;
        });

        if (!allRequiredStepsValid) {
            toast.error("Please complete all required steps before submitting");
            return;
        }

        if (onSubmit) {
            await onSubmit();
        }
    };

    const handleEdit = (step: number) => {
        setShowValidation(false);
        setCurrentStep(step);
    };

    const canProceed = !!stepValidation[currentStep];

    return {
        // State
        currentStep,
        completedSteps,
        showValidation,
        stepValidation,
        currentStepData,
        hasAnyValidationErrors,
        canProceed,

        // Actions
        handleStepClick,
        handleNext,
        handlePrevious,
        handleSkip,
        handleSubmit,
        handleEdit,
        handleStepValidationChange,
        isStepAccessible,
        setCurrentStep,
        setShowValidation,
    };
}
