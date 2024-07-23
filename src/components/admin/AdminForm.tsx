import {useState} from 'react';
import {Input} from '@nextui-org/react';
import axios from 'axios';
import PasswordInput from '../template/PasswordInput.tsx';
import FormTemplate from '../template/FormTemplate.tsx';
import ModalAdminEnterCode from "./ModalAdminEnterCode.tsx";
import {saveMfaToken} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {usePage} from "../page/PageContext.tsx";
import useTitle from "../../hooks/TitleHook.tsx";
import useInput from "../../hooks/InputHook.tsx";

export default function AdminLoginForm() {
    useTitle('Адмін логін');

    const login = useInput('')
    const secure_code = useInput('')
    const password = useInput('')

    const {setIsLoading, setError} = usePage();
    const [showModal, setShowModal] = useState(false);

    function handleLogin() {
        setIsLoading(true);
        setError('');
        const formData = {
            login: login.value.trim(),
            password: password.value.trim(),
            secure_code: secure_code.value.trim(),
        }

        axios
            .post(`/admin/login`, formData)
            .then((response) => {
                saveMfaToken(response.data.token);
                setShowModal(true);
            })
            .catch((error) => setError(getErrorMessage(error)))
            .finally(() => setIsLoading(false));
    }

    return (
        <>
            {showModal && <ModalAdminEnterCode username_or_email={login.value} isOpen={showModal}/>}
            <FormTemplate
                title="Вхід адміністратора"
                submitBtnTxt="Вхід"
                onSubmit={handleLogin}
            >
                <Input
                    label="Логін"
                    required
                    minLength={4}
                    {...login.bind}
                />
                <PasswordInput {...password.bind}/>
                <PasswordInput label="Код безпеки" {...secure_code.bind}/>
            </FormTemplate>
        </>
    );
}
