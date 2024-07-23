import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {IModalProps} from "../auth/ModalEnterCode.tsx";
import {ErrorResponse, getErrorMessage} from "../../utils/ErrorUtils.ts";
import {getMfaAuthConfig, removeMfaToken, saveAdminToken, saveAuthToken} from "../../utils/TokenUtils.ts";
import {usePage} from "../page/PageContext.tsx";
import useInput from "../../hooks/InputHook.tsx";


export default function ModalAdminEnterCode({isOpen, username_or_email}: IModalProps) {
    const code = useInput('');
    const {isLoading, setIsLoading, error, setError} = usePage()
    const navigate = useNavigate();

    function confirmCode() {
        const data = {
            login: username_or_email,
            code: code.value
        }

        setIsLoading(true)
        setError('')
        axios
            .post(`/admin/confirm`, data, getMfaAuthConfig())
            .then(response => {
                removeMfaToken()
                const {admin_token, auth_token} = response.data;
                saveAdminToken(admin_token)
                saveAuthToken(auth_token)
                navigate('/admin/dashboard')
            })
            .catch((error: ErrorResponse) => setError(getErrorMessage(error)))
            .finally(() => setIsLoading(false))
    }

    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            placement="top-center"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Підтвердьте свою особу</ModalHeader>
                <ModalBody>
                    <div>Ми надіслали код на вашу електронну адресу, щоб підтвердити, що це ви</div>
                    {error && <div className="text-red-500">{error}</div>}
                    <Input
                        {...code.bind}
                        label="Введіть ваш код"
                        readOnly={isLoading}
                        autoFocus
                        isInvalid={error !== ''}
                        variant="bordered"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button isLoading={isLoading} color="primary" onClick={confirmCode}>
                        Надіслати код
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}