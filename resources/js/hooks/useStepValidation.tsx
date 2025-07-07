import { useState, useEffect, useRef } from "react";

type ValidationResult<T> = {
    isValid: boolean;
    errors: Record<string, any>;
    childErrors?: Record<string, Record<string, string>>;
    petErrors?: Record<string, Record<string, string>>;
    sanitizedData?: T;
};

type Validator<T> = (data: T) => ValidationResult<T>;

export function useStepValidation<T>(
    data: T,
    validator: Validator<T>,
    onValidationChange?: (isValid: boolean) => void
) {
    const [clientErrors, setClientErrors] = useState<Record<string, any>>({});
    const [sanitizedData, setSanitizedData] = useState<T | undefined>(
        undefined
    );
    const [isValid, setIsValid] = useState(false);

    const prevIsValid = useRef<boolean | null>(null);

    useEffect(() => {
        const validation = validator(data);

        // Include all *Errors fields (childErrors, petErrors, etc.)
        const fullErrors = {
            ...validation.errors,
            ...(validation.childErrors && {
                childErrors: validation.childErrors,
            }),
            ...(validation.petErrors && { petErrors: validation.petErrors }),
        };

        setClientErrors((prev) =>
            JSON.stringify(prev) !== JSON.stringify(fullErrors)
                ? fullErrors
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
