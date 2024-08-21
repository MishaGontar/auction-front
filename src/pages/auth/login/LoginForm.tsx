import {useState} from 'react';
import {Input} from '@nextui-org/react';
import {AxiosResponse} from 'axios';
import PasswordInput from '../../../components/input-form/PasswordInput.tsx';
import FormTemplate from '../../../components/input-form/FormTemplate.tsx';
import ModalEnterCode from '../ModalEnterCode.tsx';
import {removeMfaToken, saveMfaToken} from "../../../utils/TokenUtils.ts";
import useTitle from "../../../hooks/useTitle.ts";
import useInput from "../../../hooks/useInput.ts";
import useAxios from "../../../hooks/useAxios.ts";

export default function LoginForm() {
    useTitle('Вхід');

    const [showModal, setShowModal] = useState(false);
    const login = useInput('')
    const password = useInput('')

    const {postRequest} = useAxios();

    function handleLogin() {
        const formData = {
            login: login.value,
            password: password.value,
        }

        postRequest('/login', formData, {}, (response: AxiosResponse) => {
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
                <PasswordInput {...password.bind}/>
            </FormTemplate>
        </>
    );
}
