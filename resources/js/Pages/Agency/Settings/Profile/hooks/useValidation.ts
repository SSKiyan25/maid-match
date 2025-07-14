import { useState, useEffect, useRef } from "react";

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
    const [clientErrors, setClientErrors] = useState<Record<string, string>>(
        {}
    );
    const [sanitizedData, setSanitizedData] = useState<T | undefined>(
        undefined
    );
    const [isValid, setIsValid] = useState(false);

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        const validation = validator(data);

        setClientErrors((prev) =>
            JSON.stringify(prev) !== JSON.stringify(validation.errors)
                ? validation.errors
                : prev
        );
        setSanitizedData((prev) =>
            JSON.stringify(prev) !== JSON.stringify(validation.sanitizedData)
                ? validation.sanitizedData
                : prev
        );
        setIsValid((prev) =>
            prev !== validation.isValid ? validation.isValid : prev
        );

        if (onValidationChange && prevIsValid.current !== validation.isValid) {
            onValidationChange(validation.isValid);
            prevIsValid.current = validation.isValid;
        }
    }, [data, validator, onValidationChange]);

    return {
        clientErrors,
        sanitizedData,
        isValid,
    };
}
