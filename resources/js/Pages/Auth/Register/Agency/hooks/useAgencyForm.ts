import { useState, useCallback, useRef, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import { toast } from "sonner";
import {
    AgencyUserStep,
    AgencyInfoStep,
    AgencyContactPerson,
    AgencyAddressStep,
    AgencyOtherInfoStep,
} from "../utils/types";

interface InertiaFormData {
    // User credentials
    email: string;
    password: string;
    password_confirmation: string;

    // Agency info
    name: string;
    license_number: string;
    description: string;
    established_at: string;
    business_email: string;
    business_phone: string;

    // Contact person (JSON string)
    contact_person_data: string;

    // Address (JSON string)
    address_data: string;

    // Other info (JSON string)
    other_info_data: string;

    [key: string]: any;
}

interface AgencyFormData extends InertiaFormData {
    contact_person: AgencyContactPerson;
    address: AgencyAddressStep;
    other_info: AgencyOtherInfoStep;
    license_photo_front?: File | null;
    license_photo_back?: File | null;
}

export function useAgencyForm() {
    const [contactPerson, setContactPerson] = useState<AgencyContactPerson>({});
    const [address, setAddress] = useState<AgencyAddressStep>({});
    const [otherInfo, setOtherInfo] = useState<AgencyOtherInfoStep>({});
    const [licensePhotoFront, setLicensePhotoFront] = useState<File | null>(
        null
    );
    const [licensePhotoBack, setLicensePhotoBack] = useState<File | null>(null);
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionErrors, setSubmissionErrors] = useState<
        Record<string, string>
    >({});
    const isUpdatingRef = useRef(false);

    const { data, setData, processing, errors } = useForm<InertiaFormData>({
        // User credentials
        email: "",
        password: "",
        password_confirmation: "",

        // Agency info
        name: "",
        license_number: "",
        description: "",
        established_at: "",
        business_email: "",
        business_phone: "",

        // JSON data
        contact_person_data: "",
        address_data: "",
        other_info_data: "",
    });

    const formData: AgencyFormData = useMemo(
        () => ({
            ...data,
            contact_person: contactPerson,
            address: address,
            other_info: otherInfo,
            license_photo_front: licensePhotoFront,
            license_photo_back: licensePhotoBack,
        }),
        [
            data,
            contactPerson,
            address,
            otherInfo,
            licensePhotoFront,
            licensePhotoBack,
        ]
    );

    const updateFormData = useCallback(
        (updates: Partial<AgencyFormData>) => {
            if (isUpdatingRef.current) return;
            isUpdatingRef.current = true;

            try {
                const inertiaUpdates: Partial<InertiaFormData> = {};

                // Handle contact person updates
                if (updates.contact_person !== undefined) {
                    setContactPerson(updates.contact_person);
                    inertiaUpdates.contact_person_data = JSON.stringify(
                        updates.contact_person
                    );
                }

                // Handle address updates
                if (updates.address !== undefined) {
                    setAddress(updates.address);
                    inertiaUpdates.address_data = JSON.stringify(
                        updates.address
                    );
                }

                // Handle other info updates
                if (updates.other_info !== undefined) {
                    setOtherInfo(updates.other_info);
                    inertiaUpdates.other_info_data = JSON.stringify(
                        updates.other_info
                    );
                }

                // Handle file uploads
                if (updates.license_photo_front !== undefined) {
                    setLicensePhotoFront(updates.license_photo_front);
                }

                if (updates.license_photo_back !== undefined) {
                    setLicensePhotoBack(updates.license_photo_back);
                }

                // Handle other form fields
                Object.entries(updates).forEach(([key, value]) => {
                    if (
                        value !== undefined &&
                        ![
                            "contact_person",
                            "address",
                            "other_info",
                            "license_photo_front",
                            "license_photo_back",
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
            currentFormData: AgencyFormData
        ): Promise<boolean> => {
            switch (step) {
                case 1: // Main Info + Credentials
                    return !!(
                        currentFormData.email &&
                        currentFormData.password &&
                        currentFormData.password_confirmation &&
                        currentFormData.password ===
                            currentFormData.password_confirmation &&
                        currentFormData.name &&
                        currentFormData.name.length >= 3
                    );
                case 2: // Contact Person
                    return !!(
                        currentFormData.contact_person?.name &&
                        currentFormData.contact_person?.phone &&
                        currentFormData.contact_person.name.length >= 2
                    );
                case 3: // Address
                    return !!(
                        currentFormData.address?.street &&
                        currentFormData.address?.barangay &&
                        currentFormData.address?.city &&
                        currentFormData.address?.province
                    );
                case 4: // Other Info (Optional)
                    return true; // Always valid since it's optional
                case 5: // Review (validate all previous steps)
                    return (
                        (await validateStep(1, currentFormData)) &&
                        (await validateStep(2, currentFormData)) &&
                        (await validateStep(3, currentFormData))
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
        // console.log("Submitting agency registration...");
        // console.log("Form data:", formData);
        const formDataObj = new FormData();

        // Append base form data
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                formDataObj.append(key, String(value));
            }
        });

        // Append structured data
        formDataObj.append(
            "contact_person_data",
            JSON.stringify(contactPerson)
        );
        formDataObj.append("address", JSON.stringify(address));
        formDataObj.append("other_info_data", JSON.stringify(otherInfo));

        // Append license photos
        if (licensePhotoFront) {
            formDataObj.append("license_photo_front", licensePhotoFront);
        }

        if (licensePhotoBack) {
            formDataObj.append("license_photo_back", licensePhotoBack);
        }

        router.post(route("agency.register.store"), formDataObj, {
            forceFormData: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setSubmissionErrors({});
                toast.success("Agency registration successful!");
                console.log("Registration successful!");
            },
            onError: (errors) => {
                setIsSubmitting(false);
                setSubmissionErrors(errors);
                console.error("Registration failed:", errors);
                Object.values(errors).forEach((err) => {
                    toast.error(err as string);
                });
            },
        });
    }, [
        data,
        contactPerson,
        address,
        otherInfo,
        licensePhotoFront,
        licensePhotoBack,
    ]);

    const shouldShowValidationError = useCallback(
        (fieldName: string): boolean => {
            return touchedFields.has(fieldName);
        },
        [touchedFields]
    );

    const markFieldTouched = useCallback((fieldName: string) => {
        setTouchedFields((prev) => new Set([...prev, fieldName]));
    }, []);

    // Get step data helper functions
    const getStep1Data = useCallback(
        (): AgencyInfoStep & AgencyUserStep => ({
            // User credentials
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.password_confirmation,

            // Agency info
            name: formData.name,
            license_number: formData.license_number,
            description: formData.description,
            established_at: formData.established_at,
            business_email: formData.business_email,
            business_phone: formData.business_phone,
            license_photo_front: formData.license_photo_front,
            license_photo_back: formData.license_photo_back,
            contact_person: formData.contact_person,
        }),
        [formData]
    );

    const getStep2Data = useCallback(
        (): AgencyContactPerson => formData.contact_person,
        [formData]
    );
    const getStep3Data = useCallback(
        (): AgencyAddressStep => formData.address,
        [formData]
    );
    const getStep4Data = useCallback(
        (): AgencyOtherInfoStep => formData.other_info,
        [formData]
    );

    return {
        formData,
        updateFormData,
        validateStep,
        submitRegistration,
        isSubmitting,
        processing,
        errors,
        touchedFields,
        shouldShowValidationError,
        markFieldTouched,
        submissionErrors,

        // Step data getters
        getStep1Data,
        getStep2Data,
        getStep3Data,
        getStep4Data,
    };
}
