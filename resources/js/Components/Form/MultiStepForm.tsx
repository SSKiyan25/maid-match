import { Head } from "@inertiajs/react";
import { ReactNode } from "react";
import FormStepper from "@/Components/Form/Stepper";
import StepNavigation from "@/Components/Form/StepNavigation";
import { useMultiStepForm, Step } from "@/hooks/useMultiStepForm";

interface MultiStepFormProps {
    title: string;
    subtitle: string;
    steps: Step[];
    layout: React.ComponentType<{
        children: ReactNode;
        sidebarDefaultOpen?: boolean;
    }>;
    sidebarDefaultOpen?: boolean;
    gridCols?: 2 | 3;
    isEditMode?: boolean;
    formType: string;
    isSubmitting?: boolean;
    onValidateStep?: (step: number, formData: any) => Promise<boolean>;
    onSubmit?: () => Promise<void>;
    renderStep: (
        step: number,
        showValidation: boolean,
        handleStepValidationChange: (step: number, isValid: boolean) => void
    ) => ReactNode;
    formData?: any;
    allowNavigationWithErrors?: boolean;
    initialStepValidation?: Record<number, boolean>;
}

export default function MultiStepForm({
    title,
    subtitle,
    steps,
    layout: Layout,
    sidebarDefaultOpen = false,
    gridCols = 3,
    isEditMode = false,
    formType,
    isSubmitting = false,
    onValidateStep,
    onSubmit,
    renderStep,
    formData,
    allowNavigationWithErrors = false,
    initialStepValidation,
}: MultiStepFormProps) {
    const {
        currentStep,
        completedSteps,
        showValidation,
        stepValidation,
        currentStepData,
        hasAnyValidationErrors,
        canProceed,
        handleStepClick,
        handleNext,
        handlePrevious,
        handleSkip,
        handleSubmit,
        handleStepValidationChange,
        isStepAccessible,
    } = useMultiStepForm({
        steps,
        initialStepValidation,
        onValidateStep,
        onSubmit,
        allowNavigationWithErrors,
    });

    const handleNextWithData = () => handleNext(formData);

    return (
        <Layout sidebarDefaultOpen={sidebarDefaultOpen}>
            <Head title={title} />

            <div
                className={
                    isEditMode
                        ? "pb-36 pt-12 px-6"
                        : "min-h-screen bg-gradient-to-br from-background via-muted/30 to-muted/50 py-8"
                }
            >
                <div
                    className={
                        isEditMode
                            ? "w-full mx-auto sm:px-6 lg:px-8"
                            : "max-w-4xl mx-auto px-4"
                    }
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {title}
                        </h1>
                        <p className="text-muted-foreground">{subtitle}</p>
                    </div>

                    {/* Progress Stepper */}
                    <FormStepper
                        steps={steps}
                        currentStep={currentStep}
                        onStepClick={handleStepClick}
                        isStepAccessible={isStepAccessible}
                        completedSteps={completedSteps}
                        stepValidation={stepValidation}
                        isEditMode={isEditMode}
                        formType={formType}
                        gridCols={gridCols}
                        showNavigation={true}
                    />

                    {/* Step Content */}
                    <div className="mt-8 mb-8">
                        {renderStep(
                            currentStep,
                            showValidation,
                            handleStepValidationChange
                        )}
                    </div>

                    {/* Navigation - Show for all steps except the last one, or show for all steps in edit mode */}
                    {(currentStep < steps.length || isEditMode) && (
                        <StepNavigation
                            currentStep={currentStep}
                            totalSteps={steps.length}
                            canSkip={
                                !currentStepData?.required &&
                                (allowNavigationWithErrors ||
                                    !hasAnyValidationErrors)
                            }
                            isSubmitting={isSubmitting}
                            canProceed={canProceed}
                            onPrevious={handlePrevious}
                            onNext={handleNextWithData}
                            onSkip={handleSkip}
                            onSubmit={handleSubmit}
                            showValidation={showValidation}
                            isEditMode={isEditMode}
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
}
