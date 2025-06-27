import { Step1Data, ValidationResult } from './types';
import { validateAndSanitizeInput, validateFormSecurity } from './securityValidation';

// Email validation with security
export const validateEmail = (email: string): { isValid: boolean; error?: string; sanitizedValue?: string } => {
    const security = validateAndSanitizeInput(email, 'email', 254);
    
    if (!security.isValid) {
        return { isValid: false, error: security.securityIssues.join(', ') };
    }

    const sanitizedEmail = security.sanitizedValue;
    
    if (!sanitizedEmail.trim()) {
        return { isValid: false, error: "Email is required" };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
        return { isValid: false, error: "Please enter a valid email address" };
    }
    
    return { isValid: true, sanitizedValue: sanitizedEmail };
};

// Password validation with security
export const validatePassword = (password: string): { isValid: boolean; error?: string; sanitizedValue?: string } => {
    // Don't sanitize passwords, but check for security issues
    const security = validateAndSanitizeInput(password, 'text', 128);
    
    if (security.isSuspicious) {
        return { isValid: false, error: "Password contains suspicious characters" };
    }

    if (!password) {
        return { isValid: false, error: "Password is required" };
    }
    
    if (password.length < 8) {
        return { isValid: false, error: "Password must be at least 8 characters long" };
    }
    
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, error: "Password must contain at least one uppercase letter" };
    }
    
    if (!/[a-z]/.test(password)) {
        return { isValid: false, error: "Password must contain at least one lowercase letter" };
    }
    
    if (!/[0-9]/.test(password)) {
        return { isValid: false, error: "Password must contain at least one number" };
    }
    
    return { isValid: true, sanitizedValue: password };
};

// Name validation with security
export const validateName = (name: string, fieldName: string): { isValid: boolean; error?: string; sanitizedValue?: string } => {
    const security = validateAndSanitizeInput(name, 'text', 50);
    
    if (!security.isValid) {
        return { isValid: false, error: security.securityIssues.join(', ') };
    }

    const sanitizedName = security.sanitizedValue;
    
    if (!sanitizedName || sanitizedName.trim().length === 0) {
        return { isValid: false, error: `${fieldName} is required` };
    }
    
    if (sanitizedName.trim().length < 2) {
        return { isValid: false, error: `${fieldName} must be at least 2 characters long` };
    }
    
    return { isValid: true, sanitizedValue: sanitizedName };
};

// Philippine phone validation with security
export const validatePhoneNumber = (phone: string): { isValid: boolean; error?: string; sanitizedValue?: string } => {
    if (!phone) {
        return { isValid: true, sanitizedValue: '' }; // Phone is optional
    }

    const security = validateAndSanitizeInput(phone, 'phone', 20);
    
    if (!security.isValid) {
        return { isValid: false, error: security.securityIssues.join(', ') };
    }

    const sanitizedPhone = security.sanitizedValue;
    const cleaned = sanitizedPhone.replace(/\D/g, '');
    
    const patterns = [
        /^63[89]\d{9}$/,     // +63 mobile
        /^639\d{9}$/,        // +639 mobile
        /^0[89]\d{9}$/,      // 0 mobile
        /^09\d{9}$/,         // 09 mobile
        /^[89]\d{9}$/,       // mobile without 0
        /^9\d{9}$/,          // 9 mobile
    ];

    const isValid = patterns.some(pattern => pattern.test(cleaned));
    
    if (!isValid) {
        return { isValid: false, error: "Please enter a valid Philippine phone number" };
    }
    
    return { isValid: true, sanitizedValue: sanitizedPhone };
};

// Complete Step 1 validation with security
export const validateStep1 = (data: Step1Data): ValidationResult & { sanitizedData?: Step1Data } => {
    const errors: Record<string, string> = {};
    const sanitizedData: Partial<Step1Data> = {};
    
    // Security check for the entire form
    const securityCheck = validateFormSecurity(data, {
        first_name: 'text',
        last_name: 'text',
        email: 'email',
        password: 'text',
        password_confirmation: 'text',
        phone_number: 'phone',
    });

    if (!securityCheck.isSecure) {
        Object.assign(errors, securityCheck.securityReport);
    }
    
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
        errors.email = emailValidation.error!;
    } else {
        sanitizedData.email = emailValidation.sanitizedValue;
    }
    
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.error!;
    } else {
        sanitizedData.password = passwordValidation.sanitizedValue;
    }
    
    if (data.password !== data.password_confirmation) {
        errors.password_confirmation = "Passwords do not match";
    } else {
        sanitizedData.password_confirmation = data.password_confirmation;
    }
    
    const firstNameValidation = validateName(data.first_name, "First name");
    if (!firstNameValidation.isValid) {
        errors.first_name = firstNameValidation.error!;
    } else {
        sanitizedData.first_name = firstNameValidation.sanitizedValue;
    }
    
    const lastNameValidation = validateName(data.last_name, "Last name");
    if (!lastNameValidation.isValid) {
        errors.last_name = lastNameValidation.error!;
    } else {
        sanitizedData.last_name = lastNameValidation.sanitizedValue;
    }
    
    const phoneValidation = validatePhoneNumber(data.phone_number);
    if (!phoneValidation.isValid) {
        errors.phone_number = phoneValidation.error!;
    } else {
        sanitizedData.phone_number = phoneValidation.sanitizedValue;
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
        sanitizedData: sanitizedData as Step1Data
    };
};