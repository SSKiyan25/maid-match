export const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.startsWith('63')) {
        if (cleaned.length <= 12) return '+' + cleaned;
    } else if (cleaned.startsWith('0')) {
        if (cleaned.length <= 11) return cleaned;
    } else if (cleaned.length <= 10) {
        return cleaned;
    }
    
    return value;
};

export const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
};

export const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 50) return "bg-red-500";
    if (strength < 75) return "bg-yellow-500";
    return "bg-green-500";
};

export const getPasswordStrengthText = (strength: number): string => {
    if (strength < 25) return "Very Weak";
    if (strength < 50) return "Weak";
    if (strength < 75) return "Good";
    return "Strong";
};