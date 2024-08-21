import {useState} from 'react';
import {Input} from '@nextui-org/react';
import {AxiosResponse} from 'axios';
import FormTemplate from '../../../components/input-form/FormTemplate.tsx';
import PasswordInput from '../../../components/input-form/PasswordInput.tsx';
import ModalEnterCode from '../ModalEnterCode.tsx';
import {removeMfaToken, saveMfaToken} from "../../../utils/TokenUtils.ts";
import useInput from "../../../hooks/useInput.ts";
import useAxios from "../../../hooks/useAxios.ts";

export default function RegistrationForm() {

    const username = useInput('')
    const email = useInput('')
    const password = useInput('')
    const confirmPassword = useInput('')

    const [isNotEqualsPassword, setIsNotEqualsPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const {postRequest} = useAxios();

    async function handleRegistration() {
        if (confirmPassword.value !== password.value) {
            setIsNotEqualsPassword(true)
            return;
        }

        const formData = {
            username: username.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value
        };

        postRequest(`/registration`, formData, {}, (response: AxiosResponse) => {
            saveMfaToken(response.data.token);
            setShowModal(true);
        })
    }

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