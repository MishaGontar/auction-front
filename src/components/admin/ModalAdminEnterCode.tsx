import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import axios from "axios";
import {SERVER_URL} from "../../constans.ts";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {IModalProps} from "../auth/ModalEnterCode.tsx";
import {ErrorResponse, getErrorMessage} from "../../utils/ErrorUtils.ts";
import {getMfaAuthConfig, removeMfaToken, saveAdminToken, saveAuthToken} from "../../utils/TokenUtils.ts";


export default function ModalAdminEnterCode({isOpen, username_or_email}: IModalProps) {
    const [code, setCode] = useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('');
    const navigate = useNavigate();

    function confirmCode() {

        const data = {
            login: username_or_email,
            code: code
        }

        setIsLoading(true)
        setError('')
        axios
            .post(`${SERVER_URL}/admin/confirm`, data, getMfaAuthConfig())
            .then(response => {
                removeMfaToken()
                const data = response.data;
                saveAdminToken(data.admin_token)
                saveAuthToken(data.auth_token)
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
                <ModalHeader className="flex flex-col gap-1">Confirm your identity</ModalHeader>
                <ModalBody>
                    <div>We send a code to your email to confirm that's you</div>
                    {error && <div className="text-red-500">{error}</div>}
                    <Input
                        readOnly={isLoading}
                        autoFocus
                        isInvalid={error !== ''}
                        onChange={(e) => setCode(e.target.value)}
                        label="Enter your code"
                        variant="bordered"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button isLoading={isLoading} color="primary" onClick={confirmCode}>
                        Send code
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}