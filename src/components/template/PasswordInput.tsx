import {ChangeEvent, InputHTMLAttributes, useState} from "react";
import {EyeSlashFilledIcon} from "../../icons/EyeSlashFilledIcon.tsx";
import {EyeFilledIcon} from "../../icons/EyeFilledIcon.tsx";
import {Input} from "@nextui-org/react";

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
    const toggleVisibility = () => setIsVisible(prevState => !prevState);
    return (
        <Input
            required
            minLength={4}
            label={label ? label : "Password"}
            value={value}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible
                        ? <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                        : <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                    }
                </button>
            }
            type={isVisible ? "text" : "password"}
            onChange={onChange}
            width="100%"
            className={"mt-2"}
        />
    )
}