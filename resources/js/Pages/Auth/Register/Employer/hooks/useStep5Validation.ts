import { useState, useEffect } from "react";
import { validateStep5, generatePetId, getPetCompletionPercentage, getPetMatchingTips } from "../utils/step5Validation";
import type { Step5Data, Pet } from "../utils/types";

export const useStep5Validation = (
    data: Step5Data,
    onValidationChange?: (isValid: boolean) => void
) => {
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [petErrors, setPetErrors] = useState<Record<string, Record<string, string>>>({});
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [matchingTips, setMatchingTips] = useState<string[]>([]);
    const [isValid, setIsValid] = useState(false);

    // Validate whenever data changes
    useEffect(() => {
        const validation = validateStep5(data);
        setClientErrors(validation.errors);
        setPetErrors(validation.petErrors);
        setCompletionPercentage(getPetCompletionPercentage(data.pets || []));
        setMatchingTips(getPetMatchingTips(data.pets || []));
        setIsValid(validation.isValid);

        if (onValidationChange) {
            onValidationChange(validation.isValid);
        }
    }, [data, onValidationChange]);

    const handleInputChange = (field: keyof Step5Data, value: any, onChange: (updates: Partial<Step5Data>) => void) => {
        // Update pets_data JSON when pets array changes
        if (field === "pets") {
            const petsData = value.map((pet: Pet) => ({
                type: pet.type,
                name: pet.name,
                photo_url: null, // Will be set by backend after upload
            }));

            // Collect all photo files for upload
            const photoFiles = value
                .map((pet: Pet) => pet.photo)
                .filter((photo: File | undefined) => photo !== undefined);

            onChange({
                [field]: value,
                pets_data: JSON.stringify(petsData),
                pets_photos: photoFiles,
            });
        } else {
            onChange({ [field]: value });
        }
    };

    const handlePetChange = (
        petId: string,
        field: keyof Pet,
        value: string | File,
        onChange: (updates: Partial<Step5Data>) => void
    ) => {
        const updatedPets = data.pets.map((pet) =>
            pet.id === petId ? { ...pet, [field]: value } : pet
        );
        handleInputChange("pets", updatedPets, onChange);
    };

    const handlePhotoUpload = (
        petId: string, 
        file: File | null,
        onChange: (updates: Partial<Step5Data>) => void
    ) => {
        const updatedPets = data.pets.map((pet) =>
            pet.id === petId
                ? { ...pet, photo: file || undefined }
                : pet
        );
        handleInputChange("pets", updatedPets, onChange);
    };

    const addPet = (onChange: (updates: Partial<Step5Data>) => void) => {
        const newPet: Pet = {
            id: generatePetId(),
            type: "",
            name: "",
        };
        handleInputChange("pets", [...(data.pets || []), newPet], onChange);
        handleInputChange("has_pets", true, onChange);
    };

    const removePet = (petId: string, onChange: (updates: Partial<Step5Data>) => void) => {
        const updatedPets = data.pets.filter((pet) => pet.id !== petId);
        handleInputChange("pets", updatedPets, onChange);
        if (updatedPets.length === 0) {
            handleInputChange("has_pets", false, onChange);
        }
    };

    return {
        clientErrors,
        petErrors,
        completionPercentage,
        matchingTips,
        handleInputChange,
        handlePetChange,
        handlePhotoUpload,
        addPet,
        removePet,
        isValid,
    };
};