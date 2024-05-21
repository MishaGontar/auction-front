import {ChangeEvent, useEffect, useState} from 'react';
import {Input} from '@nextui-org/react';
import axios from 'axios';
import PasswordInput from '../template/PasswordInput.tsx';
import FormTemplate from '../template/FormTemplate.tsx';
import {SERVER_URL} from "../../constans.ts";
import ModalAdminEnterCode from "./ModalAdminEnterCode.tsx";
import {saveMfaToken} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";

interface AdminFormData {
    login: string;
    secure_code: string;
    password: string;
}

export default function AdminLoginForm() {
    const [formData, setFormData] = useState<AdminFormData>({
        login: '',
        secure_code: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        document.title = 'Адмін логін';
    }, []);

    const handleInputChange = (field: keyof AdminFormData, e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value.trim(),
        }));
    };

    const handleLogin = () => {
        setIsLoading(true);
        setError('');

        axios
            .post(`${SERVER_URL}/admin/login`, formData)
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
            {showModal && <ModalAdminEnterCode username_or_email={formData.login} isOpen={showModal}/>}
            <FormTemplate
                title="Вхід адміністратора"
                submitBtnTxt="Вхід"
                onSubmit={handleLogin}
                error={error}
                isLoading={isLoading}
            >
                <Input
                    label="Логін"
                    required
                    minLength={4}
                    value={formData.login}
                    onChange={(e) => handleInputChange('login', e)}
                />
                <PasswordInput
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e)}
                />
                <PasswordInput
                    label="Код безпеки"
                    value={formData.secure_code}
                    onChange={(e) => handleInputChange('secure_code', e)}
                />
            </FormTemplate>
        </>
    );
}
