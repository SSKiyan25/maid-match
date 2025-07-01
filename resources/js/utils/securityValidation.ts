export interface SecurityValidationResult {
    isValid: boolean;
    sanitizedValue: string;
    securityIssues: string[];
    isSuspicious: boolean;
}

const SQL_INJECTION_PATTERNS = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\s)/gi,
    /(;[\s]*(\-\-|\/\*|\*\/|DROP|DELETE|INSERT|UPDATE))/gi,
    /(\-\-[\s]*[^\r\n]*)/g,
    /(\bOR\s+[\w\s]*\s*=\s*[\w\s]*|1\s*=\s*1|'[^']*'\s*=\s*'[^']*')/gi,
    /(\bAND\s+[\w\s]*\s*=\s*[\w\s]*)/gi,
    /(\bUNION\s+SELECT\b)/gi,
    /(\bINSERT\s+INTO\b)/gi,
    /(xp_cmdshell|sp_executesql|exec\s*\()/gi,
];

const XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
    /javascript\s*:/gi,
    /vbscript\s*:/gi,
    /data\s*:\s*text\/html/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi, // onclick="...", onload='...', etc.
    /<img[^>]+src\s*=\s*["']?javascript:/gi,
    /<link[^>]+href\s*=\s*["']?javascript:/gi,
];

const COMMAND_INJECTION_PATTERNS = [
    /(\|\||&&)/g, // Logical operators
    /(;[\s]*[a-zA-Z])/g, // Semicolon followed by commands
    /(\|[\s]*[a-zA-Z])/g, // Pipe followed by commands
    /([\s]cmd[\s]|[\s]powershell[\s]|[\s]bash[\s]|[\s]sh[\s])/gi,
    /(curl\s+|wget\s+)/gi,
    /(\$\([^)]*\)|`[^`]*`)/g, // Command substitution
    /(\.\.\/.*\/|\.\.\\.*\\)/g, // Path traversal in commands
    /(\beval\s*\(|\bexec\s*\()/gi,
];

const PATH_TRAVERSAL_PATTERNS = [
    /(\.\.\/){2,}/g, // Multiple directory traversals
    /(\.\.\\){2,}/g,
    /(%2e%2e%2f){2,}/gi,
    /(%2e%2e%5c){2,}/gi,
    /(\/etc\/passwd|\/windows\/system32|\.\.\/etc\/|\.\.\\windows\\)/gi,
];

const LDAP_INJECTION_PATTERNS = [
    /(\*\)|[)(][\s]*\*|[)(][\s]*[)(])/g,
    /(\\[\s]*[*|()|\\&])/g,
    /(null[\s]*[=|!]|NULL[\s]*[=|!]|\x00)/gi,
];

const EMAIL_INJECTION_PATTERNS = [
    /(%0A|%0D|\r\n|\n\r)/gi,
    /(^|\n|\r)(bcc|cc|to|from|subject)[\s]*:/gi,
    /(^|\n|\r)(content-type|mime-version)[\s]*:/gi,
    /\n[\s]*(bcc|cc|to|from)[\s]*:/gi,
];

const getSuspiciousPatterns = (fieldType: string) => {
    const basePatterns = [
        /(%[0-9a-f]{2}){4,}/gi, // Long URL encoding chains
        /(https?:\/\/[^\s]+)/gi, // URLs (suspicious in name fields)
        /(@import[\s]+|@charset[\s]+)/gi, // CSS injection
    ];

    // Add field-specific patterns
    switch (fieldType) {
        case 'text': // Names, etc.
            return [
                ...basePatterns,
                /[<>{}[\]\\]/g, // Brackets and slashes in names
                /(javascript|vbscript|data:)/gi, // Scripts in text
            ];
        case 'email':
            return [
                ...basePatterns.filter(p => !/(https?:\/\/)/.test(p.source)), // Allow URLs in email context
                /[<>{}[\]\\]/g,
            ];
        case 'phone':
            return [
                ...basePatterns,
                /[<>{}[\]\\a-zA-Z]/g, // Letters and special chars in phone
            ];
        case 'textarea':
            return [
                /(%[0-9a-f]{2}){6,}/gi, // Very long encoding chains
                /(javascript|vbscript)[\s]*:/gi, // Script protocols
            ];
        default:
            return basePatterns;
    }
};

export const validateAndSanitizeInput = (
    input: string,
    fieldType: 'text' | 'email' | 'phone' | 'textarea' | 'number' | 'select' = 'text',
    maxLength: number = 1000
): SecurityValidationResult => {
    if (!input || typeof input !== 'string') {
        return {
            isValid: true,
            sanitizedValue: '',
            securityIssues: [],
            isSuspicious: false,
        };
    }

    const securityIssues: string[] = [];
    let isSuspicious = false;
    let sanitizedValue = input;

    // Length validation
    if (input.length > maxLength) {
        securityIssues.push(`Input exceeds maximum length of ${maxLength} characters`);
        sanitizedValue = input.substring(0, maxLength);
    }
    
    // Check for SQL injection (skip for phone numbers)
    if (fieldType !== 'phone' && fieldType !== 'number') {
        const sqlMatches = SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
        if (sqlMatches) {
            securityIssues.push('Potential SQL injection detected');
            isSuspicious = true;
        }
    }

    // Check for XSS (skip for phone and number)
    if (fieldType !== 'phone' && fieldType !== 'number') {
        const xssMatches = XSS_PATTERNS.some(pattern => pattern.test(input));
        if (xssMatches) {
            securityIssues.push('Potential XSS attack detected');
            isSuspicious = true;
            // Remove dangerous HTML/JS
            sanitizedValue = sanitizedValue.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            sanitizedValue = sanitizedValue.replace(/javascript\s*:/gi, '');
            sanitizedValue = sanitizedValue.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
        }
    }

    if (fieldType === 'textarea') { // Only check in textarea where commands might be hidden
        const cmdMatches = COMMAND_INJECTION_PATTERNS.some(pattern => pattern.test(input));
        if (cmdMatches) {
            securityIssues.push('Potential command injection detected');
            isSuspicious = true;
        }
    }

    // Check for path traversal (only in textarea and text that might contain paths)
    if (fieldType === 'textarea') {
        const pathMatches = PATH_TRAVERSAL_PATTERNS.some(pattern => pattern.test(input));
        if (pathMatches) {
            securityIssues.push('Potential path traversal detected');
            isSuspicious = true;
        }
    }

    // Check for LDAP injection (only in search-like fields)
    if (fieldType === 'textarea') {
        const ldapMatches = LDAP_INJECTION_PATTERNS.some(pattern => pattern.test(input));
        if (ldapMatches) {
            securityIssues.push('Potential LDAP injection detected');
            isSuspicious = true;
        }
    }

    // Check for email header injection (only in email and textarea)
    if (fieldType === 'email' || fieldType === 'textarea') {
        const emailMatches = EMAIL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
        if (emailMatches) {
            securityIssues.push('Potential email header injection detected');
            isSuspicious = true;
        }
    }

    const suspiciousPatterns = getSuspiciousPatterns(fieldType);
    const suspiciousMatches = suspiciousPatterns.some(pattern => pattern.test(input));
    if (suspiciousMatches) {
        isSuspicious = true;
    }

    // Field-specific sanitization
    switch (fieldType) {
        case 'text':
            sanitizedValue = sanitizeText(sanitizedValue);
            break;
        case 'email':
            sanitizedValue = sanitizeEmail(sanitizedValue);
            break;
        case 'phone':
            sanitizedValue = sanitizePhone(sanitizedValue);
            break;
        case 'textarea':
            sanitizedValue = sanitizeTextarea(sanitizedValue);
            break;
        case 'number':
            sanitizedValue = sanitizeNumber(sanitizedValue);
            break;
        case 'select':
            sanitizedValue = sanitizeSelect(sanitizedValue);
            break;
    }

    return {
        isValid: securityIssues.length === 0,
        sanitizedValue,
        securityIssues,
        isSuspicious,
    };
};

export const sanitizeText = (input: string): string => {
    return input
        .trim()
        .replace(/[<>{}[\]\\]/g, '') // Only remove truly dangerous characters
        .replace(/\s+/g, ' ') // Normalize whitespace
        .substring(0, 100); // Reasonable limit for names
};

export const sanitizeEmail = (input: string): string => {
    return input
        .trim()
        .toLowerCase()
        .replace(/[<>{}[\]\\]/g, '') // Remove only dangerous chars, preserve dots
        .substring(0, 254); // RFC email length limit
};

export const sanitizePhone = (input: string): string => {
    return input
        .replace(/[^\d+\-\s().]/g, '') // Keep digits, +, -, spaces, parentheses, dots
        .trim()
        .substring(0, 20);
};

export const sanitizeTextarea = (input: string): string => {
    return input
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
        .replace(/javascript\s*:/gi, '') // Remove javascript protocols
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '') // Remove event handlers
        .substring(0, 2000); // Reasonable limit for descriptions
};

export const sanitizeNumber = (input: string): string => {
    return input.replace(/[^\d]/g, '').substring(0, 10);
};

export const sanitizeSelect = (input: string): string => {
    return input
        .trim()
        .replace(/[<>{}[\]\\\/]/g, '')
        .substring(0, 50);
};

export const validateSelectValue = (
    value: string,
    allowedValues: string[]
): { isValid: boolean; error?: string } => {
    if (!value) {
        return { isValid: true };
    }

    if (!allowedValues.includes(value)) {
        return {
            isValid: false,
            error: 'Invalid selection. Please choose from the available options.',
        };
    }

    return { isValid: true };
};

export const checkRateLimit = (identifier: string): boolean => {
    return true;
};

export const logSecurityIncident = (
    fieldName: string,
    input: string,
    securityIssues: string[],
    userContext?: any
): void => {
    console.warn('🚨 Security incident detected:', {
        field: fieldName,
        issues: securityIssues,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        input: input.substring(0, 100) + '...',
        context: userContext,
    });
};

export const validateFormSecurity = (
    formData: Record<string, any>,
    fieldTypes: Record<string, 'text' | 'email' | 'phone' | 'textarea' | 'number' | 'select'> = {}
): {
    isSecure: boolean;
    sanitizedData: Record<string, any>;
    securityReport: Record<string, string[]>;
    suspiciousFields: string[];
} => {
    const sanitizedData: Record<string, any> = {};
    const securityReport: Record<string, string[]> = {};
    const suspiciousFields: string[] = [];
    let isSecure = true;

    for (const [fieldName, value] of Object.entries(formData)) {
        if (typeof value === 'string') {
            const fieldType = fieldTypes[fieldName] || 'text';
            const validation = validateAndSanitizeInput(value, fieldType);

            sanitizedData[fieldName] = validation.sanitizedValue;

            if (!validation.isValid) {
                isSecure = false;
                securityReport[fieldName] = validation.securityIssues;
            }
            
            if (validation.isSuspicious && validation.securityIssues.length > 0) {
                suspiciousFields.push(fieldName);
                logSecurityIncident(fieldName, value, validation.securityIssues);
            }
        } else {
            sanitizedData[fieldName] = value;
        }
    }

    return {
        isSecure,
        sanitizedData,
        securityReport,
        suspiciousFields,
    };
};