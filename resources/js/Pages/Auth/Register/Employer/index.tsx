import GuestLayout from "@/Layouts/GuestLayout";
import MultiStepForm from "@/Components/Form/MultiStepForm";
import { useEmployerRegistration } from "./hooks/useEmployerRegistration";

// Step Components
import Step1_BasicInfo from "./components/steps/Step1_BasicInfo";
import Step2_HouseholdInfo from "./components/steps/Step2_HouseholdInfo";
import Step3_Requirements from "./components/steps/Step3_Requirements";
import Step4_Children from "./components/steps/Step4_Children";
import Step5_Pets from "./components/steps/Step5_Pets";
import Step6_Review from "./components/steps/Step6_Review";

export default function EmployerRegister() {
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
            required: true,
            description: "Account details and personal info",
        },
        {
            id: 2,
            title: "Household Details",
            required: true,
            description: "Address and household information",
        },
        {
            id: 3,
            title: "Helper Requirements",
            required: false,
            description: "What kind of help you need",
        },
        {
            id: 4,
            title: "Children",
            required: false,
            description: "Information about your children",
        },
        {
            id: 5,
            title: "Pets",
            required: false,
            description: "Information about your pets",
        },
        {
            id: 6,
            title: "Review & Submit",
            required: true,
            description: "Review and confirm your information",
        },
    ];

    const initialStepValidation = {
        1: false, // Step 1 starts as invalid until user fills required fields
        2: false, // Step 2 starts as invalid
        3: true, // Optional steps are valid by default
        4: true, // Optional steps are valid by default
        5: true, // Optional steps are valid by default
        6: true, // Review step is valid by default
    };

    const renderStep = (
        step: number,
        showValidation: boolean,
        handleStepValidationChange: (step: number, isValid: boolean) => void
    ) => {
        switch (step) {
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
                        onEdit={(step: number) => {
                            /* This will be handled by MultiStepForm */
                        }}
                        onSubmit={submitRegistration}
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
        <MultiStepForm
            title="Create Your Employer Account"
            subtitle="Find the perfect household help for your family"
            steps={steps}
            layout={GuestLayout}
            gridCols={3}
            formType="employer registration"
            isSubmitting={isSubmitting}
            onValidateStep={validateStep}
            onSubmit={submitRegistration}
            renderStep={renderStep}
            formData={formData}
            initialStepValidation={initialStepValidation}
            allowNavigationWithErrors={false}
        />
    );
}
