import { useState, useEffect } from "react";

export function useDecimalInput(
    value: number | null | undefined,
    onChange: (val: number | null) => void
) {
    const [input, setInput] = useState(
        value !== null && value !== undefined ? Number(value).toFixed(2) : ""
    );

    useEffect(() => {
        setInput(
            value !== null && value !== undefined
                ? Number(value).toFixed(2)
                : ""
        );
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleBlur = () => {
        let val = input.trim();
        if (val === "") {
            onChange(null);
        } else {
            const num = parseFloat(val);
            if (!isNaN(num)) {
                onChange(Number(num.toFixed(2)));
                setInput(num.toFixed(2));
            } else {
                onChange(null);
            }
        }
    };

    return { input, handleChange, handleBlur };
}
