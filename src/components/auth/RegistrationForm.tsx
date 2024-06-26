import {ChangeEvent, useState} from 'react';
import {Input} from '@nextui-org/react';
import axios from 'axios';
import {SERVER_URL} from './../../constans.ts';
import FormTemplate from '../template/FormTemplate.tsx';
import PasswordInput from '../template/PasswordInput.tsx';
import ModalEnterCode from './ModalEnterCode.tsx';
import {removeMfaToken, saveMfaToken} from "../../utils/TokenUtils.ts";

const initialFormData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
};
type FormData = typeof initialFormData;

const RegistrationForm = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState('');
    const [isNotEqualsPassword, setIsNotEqualsPassword] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const handleInputChange = (field: keyof FormData, e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value.trim(),
        }));
        setIsNotEqualsPassword(false)
    };

    const handleRegistration = () => {
        const {password, confirmPassword} = formData;

        if (confirmPassword !== password) {
            setIsNotEqualsPassword(true)
            return;
        }

        setIsLoading(true);

        axios
            .post(`${SERVER_URL}/registration`, formData)
            .then((response) => {
                saveMfaToken(response.data.token);
                setShowModal(true);
            })
            .catch((error) => setError(error.response?.data?.message || 'Сталося помилка'))
            .finally(() => setIsLoading(false));
    };

    function handleCloseModal(){
        removeMfaToken();
        setShowModal(false);
    }

    return (
        <>
            {showModal && <ModalEnterCode username_or_email={formData.email} isOpen={showModal} onClose={handleCloseModal}/>}
            <FormTemplate
                title="Реєстрація"
                submitBtnTxt="Зареєструватись"
                onSubmit={handleRegistration}
                error={error}
                isLoading={isLoading}
                link="/login"
            >
                <Input
                    required
                    minLength={4}
                    label="Ім'я користувача"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e)}
                />
                <Input
                    required
                    type="email"
                    minLength={10}
                    label="Електрона адреса"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e)}
                    className={"mt-2"}
                />
                <PasswordInput
                    label="Пароль"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e)}
                    isInvalid={isNotEqualsPassword}
                />
                <PasswordInput
                    label="Повторіть пароль"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e)}
                    isInvalid={isNotEqualsPassword}
                    errorMessage="Паролі не співпадають"
                />
            </FormTemplate>
        </>
    );
};

export default RegistrationForm;
