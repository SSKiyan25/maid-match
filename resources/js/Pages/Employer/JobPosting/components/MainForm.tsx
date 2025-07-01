import { Head } from "@inertiajs/react";
import { useState, useCallback } from "react";
import FormStepper from "./FormStepper";
import StepNavigation from "./StepNavigation";
import { useJobPostingForm } from "../hooks/useJobPostingForm";
import EmployerLayout from "@/Layouts/EmployerLayout";

// Step Components
import Step1_MainInfo from "./steps/Step1_MainInfo";
import Step2_Location from "./steps/Step2_Location";
import Step3_Bonus from "./steps/Step3_Bonus";
import Step4_Photos from "./steps/Step4_Photos";
import Step5_Review from "./steps/Step5_Review";

interface JobPostingPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    jobPosting?: any; // For edit mode
    isEdit?: boolean;
}

export default function JobPostingPage({
    auth,
    jobPosting,
    isEdit = false,
}: JobPostingPageProps) {
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
        5: true, // Review step is valid by default
    });

    const {
        formData,
        updateFormData,
        validateStep,
        submitJobPosting,
        isSubmitting,
        errors,
        submissionErrors,
    } = useJobPostingForm();

    const steps = [
        {
            id: 1,
            title: "Job Details",
            required: true,
            description: "Basic job information and requirements",
        },
        {
            id: 2,
            title: "Location",
            required: true,
            description: "Where the job will take place",
        },
        {
            id: 3,
            title: "Bonuses",
            required: false,
            description: "Additional incentives and benefits",
        },
        {
            id: 4,
            title: "Photos",
            required: false,
            description: "Visual representation of the job environment",
        },
        {
            id: 5,
            title: "Review & Submit",
            required: true,
            description: "Review and confirm your job posting",
        },
    ];

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

    // Memoized handlers for each step to prevent infinite re-renders
    const handleStep1ValidationChange = useCallback(
        (isValid: boolean) => handleStepValidationChange(1, isValid),
        [handleStepValidationChange]
    );
    const handleStep2ValidationChange = useCallback(
        (isValid: boolean) => handleStepValidationChange(2, isValid),
        [handleStepValidationChange]
    );
    const handleStep3ValidationChange = useCallback(
        (isValid: boolean) => handleStepValidationChange(3, isValid),
        [handleStepValidationChange]
    );
    const handleStep4ValidationChange = useCallback(
        (isValid: boolean) => handleStepValidationChange(4, isValid),
        [handleStepValidationChange]
    );

    // Check if a step is accessible (clickable)
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
            const newCompletedSteps = new Set(completedSteps);
            newCompletedSteps.add(currentStep);
            newCompletedSteps.add(currentStep + 1);
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
            console.log("Cannot submit: Some required steps are invalid");
            return;
        }

        await submitJobPosting();
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
                    <Step1_MainInfo
                        data={formData}
                        onChange={updateFormData}
                        errors={errors}
                        onValidationChange={handleStep1ValidationChange}
                        showValidation={showValidation}
                        isEditMode={isEdit}
                    />
                );
            case 2:
                return (
                    <Step2_Location
                        data={formData.location}
                        onChange={(updates: any) =>
                            updateFormData({ location: updates })
                        }
                        errors={errors}
                        onValidationChange={handleStep2ValidationChange}
                        showValidation={showValidation}
                        isEditMode={isEdit}
                    />
                );
            case 3:
                return (
                    <Step3_Bonus
                        data={formData.bonuses}
                        onChange={(updates: any) =>
                            updateFormData({ bonuses: updates })
                        }
                        errors={errors as any}
                        onValidationChange={handleStep3ValidationChange}
                        showValidation={showValidation}
                        isEditMode={isEdit}
                    />
                );
            case 4:
                return (
                    <Step4_Photos
                        data={formData.photos}
                        onChange={(updates: any) =>
                            updateFormData({ photos: updates })
                        }
                        errors={errors as any}
                        onValidationChange={handleStep4ValidationChange}
                        showValidation={showValidation}
                        isEditMode={isEdit}
                    />
                );
            case 5:
                return (
                    <Step5_Review
                        formData={formData}
                        location={formData.location}
                        bonuses={formData.bonuses}
                        photos={formData.photos}
                        onEdit={handleEdit}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        errors={errors}
                        submissionErrors={submissionErrors}
                        isEditMode={isEdit}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <EmployerLayout sidebarDefaultOpen={false}>
            <Head title={isEdit ? "Edit Job Posting" : "Create Job Posting"} />

            <div className="pb-20 pt-12 px-6">
                <div className="w-full mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {isEdit
                                ? "Edit Your Job Posting"
                                : "Create a New Job Posting"}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEdit
                                ? "Update your job posting details and requirements"
                                : "Find the perfect household helper for your family"}
                        </p>
                    </div>

                    {/* Progress Stepper */}
                    <FormStepper
                        steps={steps}
                        currentStep={currentStep}
                        onStepClick={handleStepClick}
                        isStepAccessible={isStepAccessible}
                        completedSteps={completedSteps}
                        stepValidation={stepValidation}
                        isEditMode={isEdit}
                    />

                    {/* Step Content */}
                    <div className="mt-8 mb-8">{renderCurrentStep()}</div>

                    {/* Navigation */}
                    {currentStep < 5 && (
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
                            isEditMode={isEdit}
                        />
                    )}
                </div>
            </div>
        </EmployerLayout>
    );
}
