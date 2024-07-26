import { useState } from "react";

export default function useInput(initialValue: string) {
    const [value, setValue] = useState(initialValue);

    const handleChange = (event: any) => {
        setValue(event.target.value);
    };

    return {
        value,
        onChange: handleChange,
        setValue
    };
};