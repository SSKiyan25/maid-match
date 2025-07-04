import { useState, useEffect } from "react";

type ValidationResult<T> = {
    isValid: boolean;
    errors: Record<string, string>;
    sanitizedData?: T;
};

type Validator<T> = (data: T) => ValidationResult<T>;

export function useValidation<T>(
    data: T,
    validator: Validator<T>,
    onValidationChange?: (isValid: boolean) => void
) {
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [sanitizedData, setSanitizedData] = useState<T | undefined>(undefined);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const validation = validator(data);
        setClientErrors(validation.errors);
        setSanitizedData(validation.sanitizedData);
        setIsValid(validation.isValid);

        if (onValidationChange) {
            onValidationChange(validation.isValid);
        }
    }, [data, validator, onValidationChange]);

    return {
        clientErrors,
        sanitizedData,
        isValid,
        clearErrors: () => setClientErrors({}),
    };
}