import { JobBonus } from "./types";
import { validateFormSecurity, validateAndSanitizeInput } from "@/utils/securityValidation";

export interface Step3ValidationResult {
    isValid: boolean;
    errors: Record<number, Record<string, string>>; // errors per bonus index
    sanitizedData?: JobBonus[];
}

function validateBonusTitle(title: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(title, "text", 100);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue || sanitizedValue.length < 2) return { error: "Bonus title must be at least 2 characters." };
    return { value: sanitizedValue };
}

function validateBonusType(type: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(type, "select", 50);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue) return { error: "Bonus type is required." };
    return { value: sanitizedValue };
}

function validateBonusFrequency(frequency: string) {
    const { isValid, sanitizedValue, securityIssues } = validateAndSanitizeInput(frequency, "select", 50);
    if (!isValid) return { error: securityIssues.join(", ") };
    if (!sanitizedValue) return { error: "Bonus frequency is required." };
    return { value: sanitizedValue };
}

function validateBonusAmount(amount: number | null | undefined) {
    if (amount !== undefined && amount !== null) {
        if (typeof amount !== "number" || isNaN(amount) || amount < 0) {
            return { error: "Bonus amount must be a positive number." };
        }
    }
    return { value: amount };
}

export function validateStep3(data: JobBonus[]): Step3ValidationResult {
    const errors: Record<number, Record<string, string>> = {};
    const sanitizedData: JobBonus[] = [];

    data.forEach((bonus, idx) => {
        const bonusErrors: Record<string, string> = {};
        const sanitizedBonus: Partial<JobBonus> = {};

        // Crucial fields
        const titleResult = validateBonusTitle(bonus.title);
        if (titleResult.error) bonusErrors.title = titleResult.error;
        else sanitizedBonus.title = titleResult.value!;

        const typeResult = validateBonusType(bonus.type);
        if (typeResult.error) bonusErrors.type = typeResult.error;
        else sanitizedBonus.type = typeResult.value!;

        const freqResult = validateBonusFrequency(bonus.frequency);
        if (freqResult.error) bonusErrors.frequency = freqResult.error;
        else sanitizedBonus.frequency = freqResult.value!;

        const amountResult = validateBonusAmount(bonus.amount);
        if (amountResult.error) bonusErrors.amount = amountResult.error;
        else sanitizedBonus.amount = amountResult.value;

        // Generic validation for other fields
        const fieldTypes = {
            status: "select",
            description: "textarea",
            conditions: "textarea",
        } as const;
        const securityCheck = validateFormSecurity(bonus, fieldTypes);

        if (!securityCheck.isSecure) {
            securityCheck.suspiciousFields.forEach((field) => {
                if (!bonusErrors[field as string]) {
                    bonusErrors[field as string] = "Suspicious or invalid input detected.";
                }
            });
        }

        Object.assign(sanitizedBonus, securityCheck.sanitizedData);

        if (Object.keys(bonusErrors).length > 0) {
            errors[idx] = bonusErrors;
        }
        sanitizedData.push(sanitizedBonus as JobBonus);
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData,
    };
}