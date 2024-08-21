import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {AxiosResponse} from "axios";
import {useNavigate} from "react-router-dom";
import {IModalProps} from "../ModalEnterCode.tsx";
import {removeMfaToken, saveAdminToken, saveAuthToken} from "../../../utils/TokenUtils.ts";
import useInput from "../../../hooks/useInput.ts";
import useAxios from "../../../hooks/useAxios.ts";


export default function ModalAdminEnterCode({isOpen, username_or_email}: IModalProps) {
    const code = useInput('');
    const navigate = useNavigate();
    const {error, isLoading, postMfaRequest} = useAxios();

    function confirmCode() {
        const data = {
            login: username_or_email,
            code: code.value
        }

        postMfaRequest('/admin/confirm', data, (res: AxiosResponse) => {
            removeMfaToken()
            const {admin_token, auth_token} = res.data;
            saveAdminToken(admin_token)
            saveAuthToken(auth_token)
            navigate('/admin/dashboard')
        })
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