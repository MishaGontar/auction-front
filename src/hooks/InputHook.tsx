import {useState} from "react";

export default function useInput(initValue: string) {
    const [value, setValue] = useState(initValue);

    return {
        value,
        setValue,
        reset: () => setValue(''),
        bind: {
            value,
            onChange: (event: any) => setValue(event.target.value)
        }
    };
}