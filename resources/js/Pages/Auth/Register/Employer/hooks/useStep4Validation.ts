import { useState, useEffect } from "react";
import { validateStep4, generateChildId, getChildCompletionPercentage } from "../utils/step4Validation";
import type { Step4Data, Child } from "../utils/types";

export const useStep4Validation = (
    data: Step4Data,
    onValidationChange?: (isValid: boolean) => void
) => {
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [childErrors, setChildErrors] = useState<Record<string, Record<string, string>>>({});
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [isValid, setIsValid] = useState(false);

    // Validate whenever data changes
    useEffect(() => {
        const validation = validateStep4(data);
        setClientErrors(validation.errors);
        setChildErrors(validation.childErrors);
        setCompletionPercentage(getChildCompletionPercentage(data.children || []));
        setIsValid(validation.isValid);

        if (onValidationChange) {
            onValidationChange(validation.isValid);
        }
    }, [data, onValidationChange]);

    const handleInputChange = (field: keyof Step4Data, value: any, onChange: (updates: Partial<Step4Data>) => void) => {
        // Update children_data JSON when children array changes
        if (field === "children") {
            const childrenData = value.map((child: Child) => ({
                name: child.name,
                birth_date: child.birth_date,
                photo_url: null, // Will be set by backend after upload
            }));

            // Collect all photo files for upload
            const photoFiles = value
                .map((child: Child) => child.photo)
                .filter((photo: File | undefined) => photo !== undefined);

            onChange({
                [field]: value,
                children_data: JSON.stringify(childrenData),
                children_photos: photoFiles,
            });
        } else {
            onChange({ [field]: value });
        }
    };

    const handleChildChange = (
        childId: string,
        field: keyof Child,
        value: string | File,
        onChange: (updates: Partial<Step4Data>) => void
    ) => {
        const updatedChildren = data.children.map((child) =>
            child.id === childId ? { ...child, [field]: value } : child
        );
        handleInputChange("children", updatedChildren, onChange);
    };

    const handlePhotoUpload = (
        childId: string, 
        file: File | null,
        onChange: (updates: Partial<Step4Data>) => void
    ) => {
        const updatedChildren = data.children.map((child) =>
            child.id === childId
                ? { ...child, photo: file || undefined }
                : child
        );
        handleInputChange("children", updatedChildren, onChange);
    };

    const addChild = (onChange: (updates: Partial<Step4Data>) => void) => {
        const newChild: Child = {
            id: generateChildId(),
            name: "",
            birth_date: "",
        };
        handleInputChange("children", [...(data.children || []), newChild], onChange);
        handleInputChange("has_children", true, onChange);
    };

    const removeChild = (childId: string, onChange: (updates: Partial<Step4Data>) => void) => {
        const updatedChildren = data.children.filter(
            (child) => child.id !== childId
        );
        handleInputChange("children", updatedChildren, onChange);
        if (updatedChildren.length === 0) {
            handleInputChange("has_children", false, onChange);
        }
    };

    return {
        clientErrors,
        childErrors,
        completionPercentage,
        handleInputChange,
        handleChildChange,
        handlePhotoUpload,
        addChild,
        removeChild,
        isValid,
    };
};