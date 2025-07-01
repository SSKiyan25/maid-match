import { useState, useEffect } from "react";
import { validateStep2, parseAddress, stringifyAddress } from "../utils/step2Validation";
import type { Step2Data, AddressData } from "../utils/types";

export const useStep2Validation = (
    data: Step2Data,
    onValidationChange?: (isValid: boolean) => void
) => {
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [addressData, setAddressData] = useState<AddressData>(() =>
        parseAddress(data.address)
    );
    const [isValid, setIsValid] = useState(false);

    // Validate whenever data changes
    useEffect(() => {
        const validation = validateStep2(data, addressData);
        setClientErrors(validation.errors);
        setIsValid(validation.isValid);

        if (onValidationChange) {
            onValidationChange(validation.isValid);
        }
    }, [data, addressData, onValidationChange]);

    const updateAddressData = (field: keyof AddressData, value: string) => {
        const updatedAddress = {
            ...addressData,
            [field]: value,
        };
        setAddressData(updatedAddress);
        return stringifyAddress(updatedAddress);
    };

    return {
        clientErrors,
        addressData,
        updateAddressData,
        isValid,
    };
};