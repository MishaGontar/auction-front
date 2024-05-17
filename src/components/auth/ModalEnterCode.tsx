import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import axios from "axios";
import {SERVER_URL} from "../../constans.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {IUser} from "../user/IUser.ts";
import {ErrorResponse, getErrorMessage} from "../../utils/ErrorUtils.ts";
import {getMfaAuthConfig, removeMfaToken, saveAuthToken} from "../../utils/TokenUtils.ts";

export interface IModalProps {
    isOpen: boolean,
    username_or_email: string,
}

export default function ModalEnterCode({isOpen, username_or_email}: IModalProps) {
    const [code, setCode] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('');
    const [user, setUser] = useState<IUser>();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${SERVER_URL}/user`, getMfaAuthConfig())
            .then(res => {
                setUser(res.data)
            })
            .catch((error: ErrorResponse) => console.log(getErrorMessage(error)))
            .finally(() => setIsLoading(false))
    }, []);

    function confirmCode() {

        const data = {
            login: username_or_email,
            code: code
        }

        setIsLoading(true)
        setError('')
        axios
            .post(`${SERVER_URL}/auth/code`, data, getMfaAuthConfig())
            .then(response => {
                removeMfaToken()
                saveAuthToken(response.data.token)
                navigate('/auctions')
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
                    <div>We send a code to <strong>{user?.email ?? username_or_email}</strong> to confirm that's you
                    </div>
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