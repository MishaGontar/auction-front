import {lazy, useState} from 'react';
import {Input} from '@nextui-org/react';
import {AxiosResponse} from 'axios';
import PasswordInput from '../../../components/input-form/PasswordInput.tsx';
import FormTemplate from '../../../components/input-form/FormTemplate.tsx';
import {saveMfaToken} from "../../../utils/TokenUtils.ts";
import useTitle from "../../../hooks/useTitle.ts";
import useInput from "../../../hooks/useInput.ts";
import useAxios from "../../../hooks/useAxios.ts";

const ModalAdminEnterCode = lazy(() => import('./ModalAdminEnterCode.tsx'));

export default function AdminLoginForm() {
    useTitle('Адмін логін');

    const login = useInput('')
    const secure_code = useInput('')
    const password = useInput('')
    const [showModal, setShowModal] = useState(false);
    const {postRequest} = useAxios();

    function handleLogin() {
        const formData = {
            login: login.value.trim(),
            password: password.value.trim(),
            secure_code: secure_code.value.trim(),
        }

        postRequest('/admin/login', formData, {}, (response: AxiosResponse) => {
            saveMfaToken(response.data.token);
            setShowModal(true);
        })
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
