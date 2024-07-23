import {useState} from 'react';
import {Input} from '@nextui-org/react';
import axios from 'axios';
import PasswordInput from '../template/PasswordInput.tsx';
import FormTemplate from '../template/FormTemplate.tsx';
import ModalEnterCode from './ModalEnterCode.tsx';
import {removeMfaToken, saveMfaToken} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {usePage} from "../page/PageContext.tsx";
import useTitle from "../../hooks/TitleHook.tsx";
import useInput from "../../hooks/InputHook.tsx";

export default function LoginForm() {
    useTitle('Вхід');

    const login = useInput('')
    const password = useInput('')
    const {setIsLoading, setError} = usePage();
    const [showModal, setShowModal] = useState(false);

    const handleLogin = () => {
        setIsLoading(true);
        setError('');

        const formData = {
            login: login.value,
            password: password.value,
        }

        axios
            .post(`/login`, formData)
            .then((response) => {
                saveMfaToken(response.data.token);
                setShowModal(true);
            })
            .catch((error) => setError(getErrorMessage(error)))
            .finally(() => setIsLoading(false));
    };

    function handleCloseModal() {
        removeMfaToken();
        setShowModal(false);
    }

    return (
        <>
            {showModal &&
                <ModalEnterCode username_or_email={login.value} isOpen={showModal} onClose={handleCloseModal}/>}
            <FormTemplate
                title="Вхід в систему"
                submitBtnTxt="Вхід"
                onSubmit={handleLogin}
                link="/registration"
            >
                <Input
                    data-test-id="form-input-username"
                    label="Ім'я користувача або електрона пошта"
                    required
                    minLength={4}
                    {...login.bind}
                />
                <PasswordInput {...login.bind}/>
            </FormTemplate>
        </>
    );
}
