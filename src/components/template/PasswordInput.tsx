import {ChangeEvent, InputHTMLAttributes, useCallback, useState} from "react";
import {Input} from "@nextui-org/react";
import EyeFilledIcon from "../../icons/EyeFilledIcon.tsx";
import EyeSlashFilledIcon from "../../icons/EyeSlashFilledIcon.tsx";

interface IPassword {
    value: string,
    onChange: (value: ChangeEvent<HTMLInputElement>) => void,
    label?: string,
    props?: InputHTMLAttributes<HTMLInputElement>,
    isInvalid?: boolean,
    errorMessage?: string
}

export default function PasswordInput({value, onChange, label, isInvalid, errorMessage}: IPassword) {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = useCallback(() => setIsVisible(prevState => !prevState), [isVisible]);

    return (
        <Input
            required
            minLength={4}
            label={label ? label : "Пароль"}
            value={value}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? <EyeSlashFilledIcon/> : <EyeFilledIcon/>}
                </button>
            }
            data-test-id="form-input-password"
            type={isVisible ? "text" : "password"}
            onChange={onChange}
            width="100%"
            className={"mt-2"}
        />
    )
}