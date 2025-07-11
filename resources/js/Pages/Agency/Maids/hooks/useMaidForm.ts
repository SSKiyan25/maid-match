import { useState, useCallback, useRef, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import { toast } from "sonner";
import { CreateMaidFormData, MaidDocumentInput } from "../utils/types";
import { validateStep1 } from "../utils/step1Validation";
import { validateStep2 } from "../utils/step2Validation";
import { validateStep3 } from "../utils/step3Validation";

interface MaidFormData extends CreateMaidFormData {
    id?: number;
}

export function useMaidForm(initialData?: Partial<MaidFormData>) {
    // Step-specific state
    const [documents, setDocuments] = useState<MaidDocumentInput[]>(
        initialData?.documents || []
    );
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionErrors, setSubmissionErrors] = useState<
        Record<string, string>
    >({});
    const isUpdatingRef = useRef(false);

    // Main form state
    const { data, setData, errors } = useForm<CreateMaidFormData>({
        user: {
            email: initialData?.user?.email || "",
            password: "",
            password_confirmation: "",
        },
        profile: {
            first_name: initialData?.profile?.first_name || "",
            last_name: initialData?.profile?.last_name || "",
            phone_number: initialData?.profile?.phone_number ?? "",
            birth_date: initialData?.profile?.birth_date ?? "",
            address: initialData?.profile?.address ?? {
                street: "",
                barangay: "",
                city: "",
                province: "",
            },
            is_phone_private: initialData?.profile?.is_phone_private ?? false,
            is_address_private:
                initialData?.profile?.is_address_private ?? false,
            is_archived: initialData?.profile?.is_archived ?? false,
            preferred_contact_methods: initialData?.profile
                ?.preferred_contact_methods ?? ["email"],
            preferred_language:
                initialData?.profile?.preferred_language ?? "en",
        },
        maid: {
            bio: initialData?.maid?.bio ?? "",
            skills: initialData?.maid?.skills ?? [],
            nationality: initialData?.maid?.nationality ?? "",
            languages: initialData?.maid?.languages ?? [],
            social_media_links: initialData?.maid?.social_media_links ?? [],
            marital_status: initialData?.maid?.marital_status ?? null,
            has_children: initialData?.maid?.has_children ?? false,
            expected_salary: initialData?.maid?.expected_salary ?? null,
            is_willing_to_relocate:
                initialData?.maid?.is_willing_to_relocate ?? false,
            preferred_accommodation:
                initialData?.maid?.preferred_accommodation ?? null,
            earliest_start_date: initialData?.maid?.earliest_start_date ?? "",
            years_experience: initialData?.maid?.years_experience ?? undefined,
            status: initialData?.maid?.status ?? "available",
            availability_schedule:
                initialData?.maid?.availability_schedule ?? [],
            emergency_contact_name:
                initialData?.maid?.emergency_contact_name ?? "",
            emergency_contact_phone:
                initialData?.maid?.emergency_contact_phone ?? "",
            verification_badges: initialData?.maid?.verification_badges ?? [],
            is_verified: initialData?.maid?.is_verified ?? false,
            is_archived: initialData?.maid?.is_archived ?? false,
        },
        agency_maid: {
            status: initialData?.agency_maid?.status ?? "active",
            is_premium: initialData?.agency_maid?.is_premium ?? false,
            is_trained: initialData?.agency_maid?.is_trained ?? false,
            agency_notes: initialData?.agency_maid?.agency_notes ?? "",
            agency_fee: initialData?.agency_maid?.agency_fee ?? null,
            assigned_at: initialData?.agency_maid?.assigned_at ?? undefined,
            status_changed_at:
                initialData?.agency_maid?.status_changed_at ?? undefined,
            is_archived: initialData?.agency_maid?.is_archived ?? false,
        },
        documents: initialData?.documents || [],
    });

    // Compose all form data
    const formData: MaidFormData = useMemo(
        () => ({
            ...data,
            ...(initialData?.id ? { id: initialData.id } : {}),
            documents,
        }),
        [data, documents, initialData?.id]
    );

    // Update form data
    const updateFormData = useCallback(
        (updates: Partial<MaidFormData>) => {
            if (isUpdatingRef.current) return;
            isUpdatingRef.current = true;

            try {
                if (updates.documents !== undefined)
                    setDocuments(updates.documents);

                // For nested objects, merge deeply if needed
                setData((prev) => ({
                    ...prev,
                    ...Object.fromEntries(
                        Object.entries(updates).map(([key, value]) => [
                            key,
                            value,
                        ])
                    ),
                }));

                Object.keys(updates).forEach((key) => {
                    setTouchedFields((prev) => new Set([...prev, key]));
                });
            } finally {
                isUpdatingRef.current = false;
            }
        },
        [setData]
    );

    const validateStep = useCallback(
        async (
            step: number,
            currentFormData: MaidFormData
        ): Promise<boolean> => {
            switch (step) {
                case 1: {
                    const result = validateStep1(currentFormData);
                    return result.isValid;
                }
                case 2: {
                    const result = validateStep2(currentFormData);
                    return result.isValid;
                }
                case 3: {
                    const result = validateStep3(currentFormData);
                    return result.isValid;
                }
                default:
                    return true;
            }
        },
        []
    );

    console.log("Is Editing:", !!(initialData && initialData.id));
    const submitMaid = useCallback(async () => {
        setIsSubmitting(true);
        setSubmissionErrors({});

        const formDataObj = new FormData();

        // User fields
        Object.entries(data.user).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formDataObj.append(`user[${key}]`, String(value));
            }
        });

        // Profile fields
        Object.entries(data.profile).forEach(([key, value]) => {
            if (key === "address" && value) {
                // Handle address as a JSON object
                formDataObj.append(`profile[address]`, JSON.stringify(value));
            } else if (Array.isArray(value)) {
                value.forEach((v) => {
                    formDataObj.append(`profile[${key}][]`, String(v));
                });
            } else if (value !== undefined && value !== null) {
                formDataObj.append(`profile[${key}]`, String(value));
            }
        });

        // Maid fields
        Object.entries(data.maid).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    formDataObj.append(`maid[${key}][]`, String(v));
                });
            } else if (value !== undefined && value !== null) {
                formDataObj.append(`maid[${key}]`, String(value));
            }
        });

        // Agency maid fields
        Object.entries(data.agency_maid).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    formDataObj.append(`agency_maid[${key}][]`, String(v));
                });
            } else if (value !== undefined && value !== null) {
                formDataObj.append(`agency_maid[${key}]`, String(value));
            }
        });

        // Documents (files)
        documents.forEach((doc, idx) => {
            Object.entries(doc).forEach(([key, value]) => {
                if (key === "file" && value instanceof File) {
                    formDataObj.append(`documents[${idx}][file]`, value);
                } else if (
                    value !== undefined &&
                    value !== null &&
                    key !== "file"
                ) {
                    formDataObj.append(
                        `documents[${idx}][${key}]`,
                        String(value)
                    );
                }
            });
        });

        const isEdit = !!(initialData && initialData.id);
        const routeName = isEdit
            ? route("agency.maids.update", initialData!.id)
            : route("agency.maids.store");

        if (isEdit) {
            formDataObj.append("_method", "PUT");
        }

        router.post(routeName, formDataObj, {
            forceFormData: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setSubmissionErrors({});
                toast.success(
                    isEdit
                        ? "Maid profile updated successfully!"
                        : "Maid profile submitted successfully!"
                );
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setSubmissionErrors(errors);
                console.error("Server validation errors:", errors);
                Object.values(errors).forEach((err) => {
                    toast.error(err as string);
                });
            },
        });
    }, [data, documents, initialData]);

    const shouldShowValidationError = useCallback(
        (fieldName: string): boolean => {
            return touchedFields.has(fieldName);
        },
        [touchedFields]
    );

    const markFieldTouched = useCallback((fieldName: string) => {
        setTouchedFields((prev) => new Set([...prev, fieldName]));
    }, []);

    return {
        formData,
        updateFormData,
        validateStep,
        submitMaid,
        isSubmitting,
        errors,
        touchedFields,
        shouldShowValidationError,
        markFieldTouched,
        submissionErrors,
        setDocuments,
        documents,
    };
}
