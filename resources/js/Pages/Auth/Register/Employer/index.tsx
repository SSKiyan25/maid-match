import { Head } from "@inertiajs/react";
import { useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import RegistrationStepper from "./components/RegistrationStepper";
import StepNavigation from "./components/StepNavigation";
import { useEmployerRegistration } from "./hooks/useEmployerRegistration";

// Step Components
import Step1_BasicInfo from "./components/steps/Step1_BasicInfo";
import Step2_HouseholdInfo from "./components/steps/Step2_HouseholdInfo";
import Step3_Requirements from "./components/steps/Step3_Requirements";
import Step4_Children from "./components/steps/Step4_Children";
import Step5_Pets from "./components/steps/Step5_Pets";
import Step6_Review from "./components/steps/Step6_Review";

export default function EmployerRegister() {
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(
        new Set([1])
    );
    const [showValidation, setShowValidation] = useState(false);

    const [stepValidation, setStepValidation] = useState<
        Record<number, boolean>
    >({
        1: false, // Step 1 starts as invalid until user fills required fields
        2: false, // Step 2 starts as invalid
        3: true, // Optional steps are valid by default
        4: true, // Optional steps are valid by default
        5: true, // Optional steps are valid by default
        6: true, // Review step is valid by default
    });

    const {
        formData,
        updateFormData,
        validateStep,
        submitRegistration,
        isSubmitting,
        errors,
        submissionErrors,
    } = useEmployerRegistration();

    const steps = [
        {
            id: 1,
            title: "Basic Information",
            component: Step1_BasicInfo,
            required: true,
            description: "Account details and personal info",
        },
        {
            id: 2,
            title: "Household Details",
            component: Step2_HouseholdInfo,
            required: true,
            description: "Address and household information",
        },
        {
            id: 3,
            title: "Helper Requirements",
            component: Step3_Requirements,
            required: false,
            description: "What kind of help you need",
        },
        {
            id: 4,
            title: "Children",
            component: Step4_Children,
            required: false,
            description: "Information about your children",
        },
        {
            id: 5,
            title: "Pets",
            component: Step5_Pets,
            required: false,
            description: "Information about your pets",
        },
        {
            id: 6,
            title: "Review & Submit",
            component: Step6_Review,
            required: true,
            description: "Review and confirm your information",
        },
    ];

    const currentStepData = steps.find((step) => step.id === currentStep);

    const handleStepValidationChange = (step: number, isValid: boolean) => {
        setStepValidation((prev) => ({
            ...prev,
            [step]: isValid,
        }));
    };

    // Check if all required steps before a given step are completed
    const areRequiredStepsCompleted = async (
        targetStep: number
    ): Promise<boolean> => {
        for (let i = 1; i < targetStep; i++) {
            const step = steps.find((s) => s.id === i);
            if (step?.required) {
                const isClientValid = stepValidation[i];
                if (!isClientValid) {
                    const isServerValid = await validateStep(i, formData);
                    if (!isServerValid) {
                        return false;
                    }
                }
            }
        }
        return true;
    };

    // Check if a step is accessible (clickable)
    const isStepAccessible = (stepId: number): boolean => {
        // Current step is always accessible
        if (stepId === currentStep) return true;

        // Previous steps are always accessible
        if (stepId < currentStep) return true;

        // For future steps, check if they're in completed steps or if it's the immediate next step
        return completedSteps.has(stepId) || stepId === currentStep + 1;
    };

    const handleNext = async () => {
        setShowValidation(true);
        const isClientValid = stepValidation[currentStep];

        if (!isClientValid) {
            // Don't proceed if client validation fails
            console.log(`Step ${currentStep} validation failed on client side`);
            return;
        }

        // Also validate on server side for required steps
        const currentStepInfo = steps.find((s) => s.id === currentStep);
        if (currentStepInfo?.required) {
            const isServerValid = await validateStep(currentStep, formData);
            if (!isServerValid) {
                console.log(
                    `Step ${currentStep} validation failed on server side`
                );
                return;
            }
        }

        // Proceed to next step
        if (currentStep < steps.length) {
            // Mark current step as completed and make next step accessible
            const newCompletedSteps = new Set(completedSteps);
            newCompletedSteps.add(currentStep);
            newCompletedSteps.add(currentStep + 1); // Make next step accessible
            setCompletedSteps(newCompletedSteps);

            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        setShowValidation(false);
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = async () => {
        setShowValidation(false);
        if (!currentStepData?.required && currentStep < steps.length) {
            // Mark current step as completed and make next step accessible
            const newCompletedSteps = new Set(completedSteps);
            newCompletedSteps.add(currentStep);
            newCompletedSteps.add(currentStep + 1); // Make next step accessible
            setCompletedSteps(newCompletedSteps);

            setCurrentStep(currentStep + 1);
        }
    };

    const handleSubmit = async () => {
        // Validate all required steps before submitting
        const allRequiredStepsValid = steps.every((step) => {
            if (step.required) {
                return stepValidation[step.id];
            }
            return true;
        });

        if (!allRequiredStepsValid) {
            console.log("Cannot submit: Some required steps are invalid");
            return;
        }

        await submitRegistration();
    };

    const handleEdit = (step: number) => {
        setShowValidation(false);
        setCurrentStep(step);
    };

    const canProceed = stepValidation[currentStep];

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1_BasicInfo
                        data={formData as any}
                        onChange={updateFormData as any}
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(1, isValid)
                        }
                        showValidation={showValidation}
                    />
                );
            case 2:
                return (
                    <Step2_HouseholdInfo
                        data={formData as any}
                        onChange={updateFormData as any}
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(2, isValid)
                        }
                        showValidation={showValidation}
                    />
                );
            case 3:
                return (
                    <Step3_Requirements
                        data={formData as any}
                        onChange={updateFormData as any}
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(3, isValid)
                        }
                        showValidation={showValidation}
                    />
                );
            case 4:
                return (
                    <Step4_Children
                        data={formData as any}
                        onChange={updateFormData as any}
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(4, isValid)
                        }
                        showValidation={showValidation}
                    />
                );
            case 5:
                return (
                    <Step5_Pets
                        data={formData as any}
                        onChange={updateFormData as any}
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(5, isValid)
                        }
                        showValidation={showValidation}
                    />
                );
            case 6:
                return (
                    <Step6_Review
                        data={formData as any}
                        onEdit={handleEdit}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        errors={errors}
                        submissionErrors={submissionErrors}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <GuestLayout>
            <Head title="Register as Employer" />

            <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-muted/50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Create Your Employer Account
                        </h1>
                        <p className="text-muted-foreground">
                            Find the perfect household help for your family
                        </p>
                    </div>

                    {/* Progress Stepper */}
                    <RegistrationStepper
                        steps={steps}
                        currentStep={currentStep}
                        isStepAccessible={isStepAccessible}
                        completedSteps={completedSteps}
                        stepValidation={stepValidation}
                    />

                    {/* Step Content */}
                    <div className="mt-8 mb-8">{renderCurrentStep()}</div>

                    {/* Navigation */}
                    <StepNavigation
                        currentStep={currentStep}
                        totalSteps={steps.length}
                        canSkip={!currentStepData?.required}
                        isSubmitting={isSubmitting}
                        canProceed={canProceed}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        onSkip={handleSkip}
                        onSubmit={handleSubmit}
                        showValidation={showValidation}
                    />
                </div>
            </div>
        </GuestLayout>
    );
}
