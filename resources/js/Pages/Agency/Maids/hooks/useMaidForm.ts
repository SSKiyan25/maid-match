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

    const safeInitialData = useMemo(() => {
        if (!initialData) return undefined;

        let safeSocialMediaLinks: Record<string, string> = {};

        if (
            initialData.maid?.social_media_links &&
            typeof initialData.maid.social_media_links === "object" &&
            !Array.isArray(initialData.maid.social_media_links)
        ) {
            safeSocialMediaLinks = initialData.maid
                .social_media_links as Record<string, string>;
        }

        return {
            ...initialData,
            maid: {
                ...initialData.maid,
                skills: Array.isArray(initialData.maid?.skills)
                    ? initialData.maid?.skills
                    : [],
                languages: Array.isArray(initialData.maid?.languages)
                    ? initialData.maid?.languages
                    : [],
                // Use the safely processed social_media_links
                social_media_links: safeSocialMediaLinks,
                availability_schedule: Array.isArray(
                    initialData.maid?.availability_schedule
                )
                    ? initialData.maid?.availability_schedule
                    : [],
                verification_badges: Array.isArray(
                    initialData.maid?.verification_badges
                )
                    ? initialData.maid?.verification_badges
                    : [],
            },
            profile: {
                ...initialData.profile,
                preferred_contact_methods: Array.isArray(
                    initialData.profile?.preferred_contact_methods
                )
                    ? initialData.profile?.preferred_contact_methods
                    : ["email"],
            },
        };
    }, [initialData]);

    // Main form state
    const { data, setData, errors } = useForm<CreateMaidFormData>({
        user: {
            email: safeInitialData?.user?.email || "",
            password: "",
            password_confirmation: "",
        },
        profile: {
            first_name: safeInitialData?.profile?.first_name || "",
            last_name: safeInitialData?.profile?.last_name || "",
            phone_number: safeInitialData?.profile?.phone_number ?? "",
            birth_date: safeInitialData?.profile?.birth_date ?? "",
            address: safeInitialData?.profile?.address ?? {
                street: "",
                barangay: "",
                city: "",
                province: "",
            },
            is_phone_private:
                safeInitialData?.profile?.is_phone_private ?? false,
            is_address_private:
                safeInitialData?.profile?.is_address_private ?? false,
            is_archived: safeInitialData?.profile?.is_archived ?? false,
            preferred_contact_methods: safeInitialData?.profile
                ?.preferred_contact_methods ?? ["email"],
            preferred_language:
                safeInitialData?.profile?.preferred_language ?? "en",
        },
        maid: {
            bio: safeInitialData?.maid?.bio ?? "",
            skills: safeInitialData?.maid?.skills ?? [],
            nationality: safeInitialData?.maid?.nationality ?? "",
            languages: safeInitialData?.maid?.languages ?? [],
            // Use an empty object as default, not an array
            social_media_links: safeInitialData?.maid?.social_media_links ?? {},
            marital_status: safeInitialData?.maid?.marital_status ?? null,
            has_children: safeInitialData?.maid?.has_children ?? false,
            expected_salary: safeInitialData?.maid?.expected_salary ?? null,
            is_willing_to_relocate:
                safeInitialData?.maid?.is_willing_to_relocate ?? false,
            preferred_accommodation:
                safeInitialData?.maid?.preferred_accommodation ?? null,
            earliest_start_date:
                safeInitialData?.maid?.earliest_start_date ?? "",
            years_experience:
                safeInitialData?.maid?.years_experience ?? undefined,
            status: safeInitialData?.maid?.status ?? "available",
            availability_schedule:
                safeInitialData?.maid?.availability_schedule ?? [],
            emergency_contact_name:
                safeInitialData?.maid?.emergency_contact_name ?? "",
            emergency_contact_phone:
                safeInitialData?.maid?.emergency_contact_phone ?? "",
            verification_badges:
                safeInitialData?.maid?.verification_badges ?? [],
            is_verified: safeInitialData?.maid?.is_verified ?? false,
            is_archived: safeInitialData?.maid?.is_archived ?? false,
        },
        agency_maid: {
            status: safeInitialData?.agency_maid?.status ?? "active",
            is_premium: safeInitialData?.agency_maid?.is_premium ?? false,
            is_trained: safeInitialData?.agency_maid?.is_trained ?? false,
            agency_notes: safeInitialData?.agency_maid?.agency_notes ?? "",
            agency_fee: safeInitialData?.agency_maid?.agency_fee ?? null,
            assigned_at: safeInitialData?.agency_maid?.assigned_at ?? undefined,
            status_changed_at:
                safeInitialData?.agency_maid?.status_changed_at ?? undefined,
            is_archived: safeInitialData?.agency_maid?.is_archived ?? false,
        },
        documents: safeInitialData?.documents || [],
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

                // Special handling for maid.social_media_links to ensure it's always an object
                if (updates.maid?.social_media_links) {
                    const socialLinks = updates.maid.social_media_links;

                    // If it's coming in as an array, convert to empty object
                    if (Array.isArray(socialLinks)) {
                        updates = {
                            ...updates,
                            maid: {
                                ...updates.maid,
                                social_media_links: {},
                            },
                        };
                    }
                }

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
            if (
                key === "social_media_links" &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {
                // Handle social_media_links as a JSON object
                Object.entries(value as Record<string, string>).forEach(
                    ([platform, url]) => {
                        formDataObj.append(
                            `maid[social_media_links][${platform}]`,
                            url
                        );
                    }
                );
            } else if (Array.isArray(value)) {
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
