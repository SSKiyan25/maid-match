import EmployerLayout from "@/Layouts/EmployerLayout";
import MultiStepForm from "@/Components/Form/MultiStepForm";
import { useJobPostingForm } from "../hooks/useJobPostingForm";

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
    jobPosting?: any;
    isEdit?: boolean;
}

export default function JobPostingPage({
    auth,
    jobPosting,
    isEdit = false,
}: JobPostingPageProps) {
    const {
        formData,
        updateFormData,
        validateStep,
        submitJobPosting,
        isSubmitting,
        errors,
        submissionErrors,
    } = useJobPostingForm(isEdit ? jobPosting : undefined);

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

    const initialStepValidation = {
        1: false, // Step 1 starts as invalid until user fills required fields
        2: false, // Step 2 starts as invalid
        3: true, // Optional steps are valid by default
        4: true, // Optional steps are valid by default
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
                        data={formData}
                        onChange={updateFormData}
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(1, isValid)
                        }
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
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(2, isValid)
                        }
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
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(3, isValid)
                        }
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
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(4, isValid)
                        }
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
                        onEdit={(step: number) => {
                            // This will be handled by MultiStepForm's handleEdit
                        }}
                        onSubmit={submitJobPosting}
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
        <MultiStepForm
            title={
                isEdit ? "Edit Your Job Posting" : "Create a New Job Posting"
            }
            subtitle={
                isEdit
                    ? "Update your job posting details and requirements"
                    : "Find the perfect household helper for your family"
            }
            steps={steps}
            layout={EmployerLayout}
            sidebarDefaultOpen={false}
            gridCols={2} // Job posting uses 2 columns
            isEditMode={isEdit}
            formType="job posting"
            isSubmitting={isSubmitting}
            onValidateStep={validateStep}
            onSubmit={submitJobPosting}
            renderStep={renderStep}
            formData={formData}
            initialStepValidation={initialStepValidation}
            allowNavigationWithErrors={false}
        />
    );
}
