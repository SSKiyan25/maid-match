import { useState, useCallback, useRef, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import { toast } from "sonner";

interface Child {
    id: string;
    name: string;
    birth_date: string;
    photo?: File;
    [key: string]: string | number | File | undefined;
}

interface Pet {
    id: string;
    type: string;
    name: string;
    photo?: File;
    [key: string]: string | File | undefined;
}

interface InertiaFormData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number: string;
    birth_date: string;
    address: string;
    family_size: number;
    household_description: string;
    work_type: string;
    accommodation: string;
    budget_min: number;
    budget_max: number;
    schedule: string;
    experience_needed: string;
    special_requirements: string;
    maid_preferences: string;
    has_children: boolean;
    children_data: string;
    has_pets: boolean;
    pets_data: string;
    [key: string]: any;
}

interface EmployerFormData extends InertiaFormData {
    children: Child[];
    pets: Pet[];
    children_photos: File[];
    pets_photos: File[];
}

export function useEmployerRegistration() {
    const [children, setChildren] = useState<Child[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [childrenPhotos, setChildrenPhotos] = useState<File[]>([]);
    const [petsPhotos, setPetsPhotos] = useState<File[]>([]);
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionErrors, setSubmissionErrors] = useState<
        Record<string, string>
    >({});
    const isUpdatingRef = useRef(false);

    const { data, setData, processing, errors, post } =
        useForm<InertiaFormData>({
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            password_confirmation: "",
            phone_number: "",
            birth_date: "",
            address: "",
            family_size: 1,
            household_description: "",
            work_type: "",
            accommodation: "",
            budget_min: 0,
            budget_max: 0,
            schedule: "",
            experience_needed: "",
            special_requirements: "",
            maid_preferences: "",
            has_children: false,
            children_data: "",
            has_pets: false,
            pets_data: "",
        });

    const formData: EmployerFormData = useMemo(
        () => ({
            ...data,
            children,
            pets,
            children_photos: childrenPhotos,
            pets_photos: petsPhotos,
        }),
        [data, children, pets, childrenPhotos, petsPhotos]
    );

    const updateFormData = useCallback(
        (updates: Partial<EmployerFormData>) => {
            if (isUpdatingRef.current) return;
            isUpdatingRef.current = true;

            try {
                const inertiaUpdates: Partial<InertiaFormData> = {};

                if (updates.children !== undefined) {
                    setChildren(updates.children);
                    inertiaUpdates.children_data = JSON.stringify(
                        updates.children
                    );
                }

                if (updates.pets !== undefined) {
                    setPets(updates.pets);
                    inertiaUpdates.pets_data = JSON.stringify(updates.pets);
                }

                if (updates.children_photos !== undefined) {
                    setChildrenPhotos(updates.children_photos);
                }

                if (updates.pets_photos !== undefined) {
                    setPetsPhotos(updates.pets_photos);
                }

                Object.entries(updates).forEach(([key, value]) => {
                    if (
                        value !== undefined &&
                        ![
                            "children",
                            "pets",
                            "children_photos",
                            "pets_photos",
                        ].includes(key)
                    ) {
                        inertiaUpdates[key as keyof InertiaFormData] =
                            value as any;
                        setTouchedFields((prev) => new Set([...prev, key]));
                    }
                });

                if (Object.keys(inertiaUpdates).length > 0) {
                    setData((prev) => ({
                        ...prev,
                        ...inertiaUpdates,
                    }));
                }
            } finally {
                isUpdatingRef.current = false;
            }
        },
        [setData]
    );

    const validateStep = useCallback(
        async (
            step: number,
            currentFormData: EmployerFormData
        ): Promise<boolean> => {
            switch (step) {
                case 1:
                    return !!(
                        currentFormData.first_name &&
                        currentFormData.last_name &&
                        currentFormData.email &&
                        currentFormData.password &&
                        currentFormData.password_confirmation &&
                        currentFormData.password ===
                            currentFormData.password_confirmation
                    );
                case 2:
                    try {
                        const addr = JSON.parse(currentFormData.address);
                        return !!(
                            addr.street &&
                            addr.barangay &&
                            addr.city &&
                            addr.province &&
                            currentFormData.family_size > 0
                        );
                    } catch {
                        return !!(
                            currentFormData.address &&
                            currentFormData.family_size > 0
                        );
                    }
                case 3:
                    return true;
                case 4:
                    if (currentFormData.has_children) {
                        return currentFormData.children.length > 0;
                    }
                    return true;
                case 5:
                    if (currentFormData.has_pets) {
                        return currentFormData.pets.length > 0;
                    }
                    return true;
                case 6:
                    return (
                        (await validateStep(1, currentFormData)) &&
                        (await validateStep(2, currentFormData))
                    );
                default:
                    return true;
            }
        },
        []
    );

    const submitRegistration = useCallback(async () => {
        setIsSubmitting(true);
        setSubmissionErrors({});
        const formDataObj = new FormData();

        // Append base form data
        Object.entries(data).forEach(([key, value]) => {
            if (
                value !== undefined &&
                !["children_photos", "pets_photos"].includes(key)
            ) {
                // Convert booleans to "1"/"0" for has_children and has_pets
                if (key === "has_children" || key === "has_pets") {
                    formDataObj.append(key, value ? "1" : "0");
                } else {
                    formDataObj.append(key, String(value));
                }
            }
        });

        // Append children/pets data
        formDataObj.append("children_data", JSON.stringify(children));
        formDataObj.append("pets_data", JSON.stringify(pets));

        // Append children photos
        childrenPhotos.forEach((file, index) => {
            if (file) {
                formDataObj.append(`children_photos[${index}]`, file);
            }
        });

        // Append pets photos
        petsPhotos.forEach((file, index) => {
            if (file) {
                formDataObj.append(`pets_photos[${index}]`, file);
            }
        });

        router.post(route("employer.register.store"), formDataObj, {
            forceFormData: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setSubmissionErrors({});
                console.log("Registration successful!");
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setSubmissionErrors(errors);
                console.error("Registration failed:", errors);
                console.log("Submission errors:", submissionErrors);
                Object.values(errors).forEach((err) => {
                    toast.error(err as string);
                });
            },
        });
    }, [data, children, pets, childrenPhotos, petsPhotos]);

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
        submitRegistration,
        isSubmitting,
        errors,
        touchedFields,
        shouldShowValidationError,
        markFieldTouched,
        submissionErrors,
    };
}
