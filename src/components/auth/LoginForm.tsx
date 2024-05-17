import {ChangeEvent, useEffect, useState} from 'react';
import {Input} from '@nextui-org/react';
import axios from 'axios';
import PasswordInput from '../template/PasswordInput.tsx';
import FormTemplate from '../template/FormTemplate.tsx';
import ModalEnterCode from './ModalEnterCode.tsx';
import {SERVER_URL} from "../../constans.ts";
import {saveMfaToken} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";

interface FormData {
    login: string;
    password: string;
}

export default function LoginForm() {
    const [formData, setFormData] = useState<FormData>({
        login: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        document.title = 'Login';
    }, []);

    const handleInputChange = (field: keyof FormData, e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value.trim(),
        }));
    };

    const handleLogin = () => {
        setIsLoading(true);
        setError('');

        axios
            .post(`${SERVER_URL}/login`, formData)
            .then((response) => {
                saveMfaToken(response.data.token);
                setShowModal(true);
            })
            .catch((error) => {
                setError(getErrorMessage(error));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            {showModal && <ModalEnterCode username_or_email={formData.login} isOpen={showModal}/>}
            <FormTemplate
                title="Login"
                submitBtnTxt="Login"
                onSubmit={handleLogin}
                error={error}
                isLoading={isLoading}
                link="/registration"
                linkText="Create new account"
            >
                <Input
                    label="Username or email"
                    required
                    minLength={4}
                    value={formData.login}
                    onChange={(e) => handleInputChange('login', e)}
                />
                <PasswordInput
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e)}
                />
            </FormTemplate>
        </>
    );
}
