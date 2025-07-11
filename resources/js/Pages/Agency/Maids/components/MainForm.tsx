import AgencyLayout from "@/Layouts/AgencyLayout";
import MultiStepForm from "@/Components/Form/MultiStepForm";
import { useMaidForm } from "../hooks/useMaidForm";

// Step Components
import Step1_Account from "./steps/Step1_Account";
import Step2_MaidInfo from "./steps/Step2_MaidInfo";
import Step3_Documents from "./steps/Step3_Documents";
import Step4_Review from "./steps/Step4_Review";

interface MaidFormPageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
    maid?: any;
    isEdit?: boolean;
    agencyMaid?: any;
}

export default function MaidFormPage({
    auth,
    maid,
    agencyMaid,
    isEdit = false,
}: MaidFormPageProps) {
    const initialData = isEdit
        ? {
              user: maid?.user,
              profile: maid?.user?.profile,
              maid: maid,
              agency_maid: {
                  status: agencyMaid?.status ?? "active",
                  is_premium: agencyMaid?.is_premium ?? false,
                  is_trained: agencyMaid?.is_trained ?? false,
                  agency_notes: agencyMaid?.agency_notes ?? "",
                  agency_fee: agencyMaid?.agency_fee ?? null,
                  assigned_at: agencyMaid?.assigned_at ?? undefined,
                  status_changed_at: agencyMaid?.status_changed_at ?? undefined,
                  is_archived: agencyMaid?.is_archived ?? false,
              },
              documents: maid?.documents ?? [],
              id: maid?.id,
          }
        : undefined;

    const {
        formData,
        updateFormData,
        validateStep,
        submitMaid,
        isSubmitting,
        errors,
        submissionErrors,
    } = useMaidForm(initialData);

    const steps = [
        {
            id: 1,
            title: "Account",
            required: true,
            description: "Personal and account information",
        },
        {
            id: 2,
            title: "Maid Info",
            required: true,
            description: "Professional details and agency settings",
        },
        {
            id: 3,
            title: "Documents",
            required: false,
            description: "Optional verification documents",
        },
        {
            id: 4,
            title: "Review & Submit",
            required: true,
            description: "Review and confirm maid profile",
        },
    ];

    const initialStepValidation = {
        1: false, // Step 1 starts as invalid until user fills required fields
        2: false, // Step 2 starts as invalid until user fills required fields
        3: true, // Documents step is optional
        4: true, // Review step is valid by default
    };

    const renderStep = (
        step: number,
        showValidation: boolean,
        handleStepValidationChange: (step: number, isValid: boolean) => void
    ) => {
        switch (step) {
            case 1:
                return (
                    <Step1_Account
                        data={formData}
                        onChange={updateFormData}
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(1, isValid)
                        }
                        showValidation={showValidation}
                        isEdit={isEdit}
                    />
                );
            case 2:
                return (
                    <Step2_MaidInfo
                        data={formData}
                        onChange={updateFormData}
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(2, isValid)
                        }
                        showValidation={showValidation}
                    />
                );
            case 3:
                return (
                    <Step3_Documents
                        data={formData}
                        onChange={updateFormData}
                        errors={errors}
                        onValidationChange={(isValid: boolean) =>
                            handleStepValidationChange(3, isValid)
                        }
                        showValidation={showValidation}
                    />
                );
            case 4:
                return (
                    <Step4_Review
                        formData={formData}
                        onEdit={(step: number) => {
                            // This will be handled by MultiStepForm's handleEdit
                        }}
                        onSubmit={submitMaid}
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
            title={isEdit ? "Edit Maid Profile" : "Register New Maid"}
            subtitle={
                isEdit
                    ? "Update your maid's information and documents"
                    : "Register a new maid to your agency's roster"
            }
            steps={steps}
            layout={AgencyLayout}
            sidebarDefaultOpen={false}
            gridCols={2}
            isEditMode={isEdit}
            formType="maid profile"
            isSubmitting={isSubmitting}
            onValidateStep={validateStep}
            onSubmit={submitMaid}
            renderStep={renderStep}
            formData={formData}
            initialStepValidation={initialStepValidation}
            allowNavigationWithErrors={false}
        />
    );
}
