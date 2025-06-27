import { useState, useEffect } from "react";
import { validateStep3, createMaidPreferences, getCompletionPercentage } from "../utils/step3Validation";
import type { Step3Data } from "../utils/types";

export const useStep3Validation = (
    data: Step3Data,
    onValidationChange?: (isValid: boolean) => void
) => {
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [warnings, setWarnings] = useState<Record<string, string>>({});
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [isValid, setIsValid] = useState(false);

    // Validate whenever data changes
    useEffect(() => {
        const validation = validateStep3(data);
        setClientErrors(validation.errors);
        setWarnings(validation.warnings);
        setCompletionPercentage(getCompletionPercentage(data));
        setIsValid(validation.isValid);

        if (onValidationChange) {
            // Step 3 is optional, so it's always "valid" but we track if it has useful data
            onValidationChange(validation.isValid);
        }
    }, [data, onValidationChange]);

    const handleInputChange = (field: keyof Step3Data, value: string | number, onChange: (updates: Partial<Step3Data>) => void) => {
        const updatedData = { ...data, [field]: value };
        
        // Create the maid preferences JSON
        const maidPreferences = createMaidPreferences(updatedData);

        // Send the individual field update AND the combined JSON
        onChange({
            [field]: value,
            maid_preferences: maidPreferences,
        });
    };

    return {
        clientErrors,
        warnings,
        completionPercentage,
        handleInputChange,
        isValid,
    };
};