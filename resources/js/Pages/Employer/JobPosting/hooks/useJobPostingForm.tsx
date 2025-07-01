import { useState, useCallback, useRef, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import { toast } from "sonner";
import { JobPostingForm, JobLocation, JobBonus } from "../utils/types";
import { validateStep1 } from "../utils/step1Validation";
import { validateStep2 } from "../utils/step2Validation";
import { validateStep3 } from "../utils/step3Validation";
import { validateStep4 } from "../utils/step4Validation";

interface JobPostingFormData extends JobPostingForm {
    location: JobLocation;
    bonuses: JobBonus[];
    photos: {
        file: File;
        caption?: string;
        type: string;
        sort_order?: number;
        is_primary?: boolean;
    }[];
}

export function useJobPostingForm() {
    // Step-specific state
    const [location, setLocation] = useState<JobLocation>({
        brgy: "",
        city: "",
        province: "",
        postal_code: "",
        landmark: "",
        directions: "",
        latitude: null,
        longitude: null,
        is_hidden: false,
    });
    const [bonuses, setBonuses] = useState<JobBonus[]>([]);
    const [photos, setPhotos] = useState<
        {
            file: File;
            caption?: string;
            type: string;
            sort_order?: number;
            is_primary?: boolean;
        }[]
    >([]);
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionErrors, setSubmissionErrors] = useState<
        Record<string, string>
    >({});
    const isUpdatingRef = useRef(false);

    // Main form state
    const { data, setData, errors } = useForm<JobPostingForm>({
        title: "",
        work_types: [],
        provides_toiletries: false,
        provides_food: false,
        accommodation_type: "",
        min_salary: null,
        max_salary: null,
        day_off_preference: "",
        day_off_type: "",
        language_preferences: [],
        description: "",
    });

    // Compose all form data
    const formData: JobPostingFormData = useMemo(
        () => ({
            ...data,
            location,
            bonuses,
            photos,
        }),
        [data, location, bonuses, photos]
    );

    // Update form data
    const updateFormData = useCallback(
        (updates: Partial<JobPostingFormData>) => {
            if (isUpdatingRef.current) return;
            isUpdatingRef.current = true;

            try {
                if (updates.location !== undefined)
                    setLocation((prev) => ({ ...prev, ...updates.location }));
                if (updates.bonuses !== undefined) setBonuses(updates.bonuses);
                if (updates.photos !== undefined) setPhotos(updates.photos);

                Object.entries(updates).forEach(([key, value]) => {
                    if (
                        value !== undefined &&
                        !["location", "bonuses", "photos"].includes(key)
                    ) {
                        setData((prev) => ({
                            ...prev,
                            [key]: value,
                        }));
                        setTouchedFields((prev) => new Set([...prev, key]));
                    }
                });
            } finally {
                isUpdatingRef.current = false;
            }
        },
        [setData]
    );

    // Step validation
    const validateStep = useCallback(
        async (
            step: number,
            currentFormData: JobPostingFormData
        ): Promise<boolean> => {
            switch (step) {
                case 1: {
                    const result = validateStep1(currentFormData);
                    return result.isValid;
                }
                case 2: {
                    const result = validateStep2(currentFormData.location);
                    return result.isValid;
                }
                case 3: {
                    const result = validateStep3(currentFormData.bonuses);
                    return result.isValid;
                }
                case 4: {
                    const result = validateStep4(currentFormData.photos);
                    return result.isValid;
                }
                default:
                    return true;
            }
        },
        []
    );

    const submitJobPosting = useCallback(async () => {
        setIsSubmitting(true);
        setSubmissionErrors({});
        const formDataObj = new FormData();

        // Append main form data
        Object.entries(data).forEach(([key, value]) => {
            // Arrays (work_types, language_preferences)
            if (Array.isArray(value)) {
                value.forEach((v) => formDataObj.append(`${key}[]`, String(v)));
            }
            // Booleans (provides_toiletries, provides_food)
            else if (typeof value === "boolean") {
                formDataObj.append(key, value ? "true" : "false");
            }
            // Numbers (min_salary, max_salary)
            else if (key === "min_salary" || key === "max_salary") {
                if (value === null || value === undefined || value === "") {
                    formDataObj.append(key, "");
                } else {
                    formDataObj.append(key, String(value));
                }
            }
            // Everything else
            else if (value !== undefined && value !== null) {
                formDataObj.append(key, String(value));
            }
        });

        // Append location
        Object.entries(location).forEach(([key, value]) => {
            formDataObj.append(
                `location[${key}]`,
                value == null ? "" : String(value)
            );
        });

        // Append bonuses
        bonuses.forEach((bonus, idx) => {
            Object.entries(bonus).forEach(([key, value]) => {
                // Arrays in bonus (if any)
                if (Array.isArray(value)) {
                    value.forEach((v) =>
                        formDataObj.append(`bonuses[${idx}][${key}][]`, v)
                    );
                } else if (typeof value === "boolean") {
                    formDataObj.append(
                        `bonuses[${idx}][${key}]`,
                        value ? "true" : "false"
                    );
                } else if (value === null || value === undefined) {
                    formDataObj.append(`bonuses[${idx}][${key}]`, "");
                } else {
                    formDataObj.append(
                        `bonuses[${idx}][${key}]`,
                        String(value)
                    );
                }
            });
        });

        // Append photos (files)
        photos.forEach((photo, index) => {
            if (photo.file instanceof File) {
                formDataObj.append(`photos[${index}][file]`, photo.file);
            }
            if (photo.caption) {
                formDataObj.append(`photos[${index}][caption]`, photo.caption);
            }
            if (photo.type) {
                formDataObj.append(`photos[${index}][type]`, photo.type);
            }
            if (photo.sort_order !== undefined) {
                formDataObj.append(
                    `photos[${index}][sort_order]`,
                    String(photo.sort_order)
                );
            }
            if (photo.is_primary !== undefined) {
                formDataObj.append(
                    `photos[${index}][is_primary]`,
                    photo.is_primary ? "1" : "0"
                );
            }
        });

        router.post(route("employer.job-postings.store"), formDataObj, {
            forceFormData: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setSubmissionErrors({});
                toast.success("Job posting submitted successfully!");
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setSubmissionErrors(errors);
                Object.values(errors).forEach((err) => {
                    toast.error(err as string);
                });
            },
        });
    }, [data, location, bonuses, photos]);

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
        submitJobPosting,
        isSubmitting,
        errors,
        touchedFields,
        shouldShowValidationError,
        markFieldTouched,
        submissionErrors,
    };
}
