import {useState} from 'react';
import {Input} from '@nextui-org/react';
import axios from 'axios';
import FormTemplate from '../template/FormTemplate.tsx';
import PasswordInput from '../template/PasswordInput.tsx';
import ModalEnterCode from './ModalEnterCode.tsx';
import {removeMfaToken, saveMfaToken} from "../../utils/TokenUtils.ts";
import {usePage} from "../page/PageContext.tsx";
import useInput from "../../hooks/InputHook.tsx";

export default function RegistrationForm() {
    const {setIsLoading, setError} = usePage();

    const username = useInput('')
    const email = useInput('')
    const password = useInput('')
    const confirmPassword = useInput('')

    const [isNotEqualsPassword, setIsNotEqualsPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const handleRegistration = () => {
        if (confirmPassword.value !== password.value) {
            setIsNotEqualsPassword(true)
            return;
        }

        setIsLoading(true);
        const formData = {
            username: username.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value
        };

        axios.post(`/registration`, formData)
            .then((response) => {
                saveMfaToken(response.data.token);
                setShowModal(true);
            })
            .catch((error) => setError(error.response?.data?.message || 'Сталося помилка'))
            .finally(() => setIsLoading(false));
    };

    function handleCloseModal() {
        removeMfaToken();
        setShowModal(false);
    }

    return (
        <>
            {showModal &&
                <ModalEnterCode username_or_email={email.value} isOpen={showModal} onClose={handleCloseModal}/>}
            <FormTemplate
                title="Реєстрація"
                submitBtnTxt="Зареєструватись"
                onSubmit={handleRegistration}
                link="/login"
            >
                <Input
                    required
                    minLength={4}
                    label="Ім'я користувача"
                    {...username.bind}
                />
                <Input
                    required
                    type="email"
                    minLength={10}
                    label="Електрона адреса"
                    {...email.bind}
                    className={"mt-2"}
                />
                <PasswordInput
                    label="Пароль"
                    {...password.bind}
                    isInvalid={isNotEqualsPassword}
                />
                <PasswordInput
                    label="Повторіть пароль"
                    {...confirmPassword.bind}
                    isInvalid={isNotEqualsPassword}
                    errorMessage="Паролі не співпадають"
                />
            </FormTemplate>
        </>
    );
};