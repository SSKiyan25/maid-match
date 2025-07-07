import GuestLayout from "@/Layouts/GuestLayout";
import MultiStepForm from "@/Components/Form/MultiStepForm";
import { useAgencyForm } from "./hooks/useAgencyForm";

// Step Components
import Step1_MainInfo from "./components/steps/Step1_MainInfo";
import Step2_ContactPerson from "./components/steps/Step2_ContactPerson";
import Step3_Address from "./components/steps/Step3_Address";
import Step4_OtherInfo from "./components/steps/Step4_Other";
import Step5_Review from "./components/steps/Step5_Review";

export default function AgencyRegister() {
    const {
        formData,
        updateFormData,
        validateStep,
        submitRegistration,
        isSubmitting,
        errors,
        submissionErrors,
        getStep1Data,
        getStep2Data,
        getStep3Data,
        getStep4Data,
    } = useAgencyForm();

    const steps = [
        {
            id: 1,
            title: "Agency Info",
            required: true,
            description: "Account credentials and agency details",
        },
        {
            id: 2,
            title: "Contact Person",
            required: true,
            description: "Primary contact information",
        },
        {
            id: 3,
            title: "Address",
            required: true,
            description: "Physical address location",
        },
        {
            id: 4,
            title: "Additional Info",
            required: false,
            description: "Website, social media, and pricing",
        },
        {
            id: 5,
            title: "Review & Submit",
            required: true,
            description: "Review and confirm your information",
        },
    ];

    const initialStepValidation = {
        1: false, // Step 1 starts as invalid until user fills required fields
        2: false, // Step 2 starts as invalid
        3: false, // Step 3 starts as invalid
        4: true, // Optional step is valid by default
        5: true, // Review step is valid by default
    };

    const renderStep = (
        step: number,
        showValidation: boolean,
        handleStepValidationChange: (step: number, isValid: boolean) => void
    ) => {
        switch (step) {
            case 1:
                return (
                    <Step1_MainInfo
                        data={getStep1Data()}
                        onChange={updateFormData}
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(1, isValid)
                        }
                        showValidation={showValidation}
                    />
                );
            case 2:
                return (
                    <Step2_ContactPerson
                        data={getStep2Data()}
                        onChange={(updates) =>
                            updateFormData({ contact_person: updates })
                        }
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(2, isValid)
                        }
                        showValidation={showValidation}
                    />
                );
            case 3:
                return (
                    <Step3_Address
                        data={getStep3Data()}
                        onChange={(updates) =>
                            updateFormData({ address: updates })
                        }
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(3, isValid)
                        }
                        showValidation={showValidation}
                    />
                );
            case 4:
                return (
                    <Step4_OtherInfo
                        data={getStep4Data()}
                        onChange={(updates) =>
                            updateFormData({ other_info: updates })
                        }
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(4, isValid)
                        }
                        showValidation={showValidation}
                    />
                );
            case 5:
                return (
                    <Step5_Review
                        step1Data={getStep1Data()}
                        step2Data={getStep2Data()}
                        step3Data={getStep3Data()}
                        step4Data={getStep4Data()}
                        onEditStep={(step: number) => {
                            // This will be handled by MultiStepForm's handleEdit
                        }}
                        onSubmit={submitRegistration}
                        isSubmitting={isSubmitting}
                        errors={{ ...errors, ...submissionErrors }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <MultiStepForm
            title="Create Your Agency Account"
            subtitle="Connect families with reliable domestic helpers"
            steps={steps}
            layout={GuestLayout}
            gridCols={3}
            formType="agency registration"
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
