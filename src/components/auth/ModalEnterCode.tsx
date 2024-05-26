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
    onClose: () => void,
    username_or_email: string,
}

export default function ModalEnterCode({isOpen, onClose, username_or_email}: IModalProps) {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [user, setUser] = useState<IUser>();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            axios.get(`${SERVER_URL}/user`, getMfaAuthConfig())
                .then(res => {
                    setUser(res.data);
                })
                .catch((error: ErrorResponse) => console.log(getErrorMessage(error)))
                .finally(() => setIsLoading(false));
        }
    }, [isOpen]);

    function confirmCode() {
        const data = {
            login: username_or_email,
            code: code
        };

        setIsLoading(true);
        setError('');
        axios
            .post(`${SERVER_URL}/auth/code`, data, getMfaAuthConfig())
            .then(response => {
                removeMfaToken();
                saveAuthToken(response.data.token);
                navigate('/auctions');
                onClose();  // Закриваємо модалку після успішного підтвердження коду
            })
            .catch((error: ErrorResponse) => setError(getErrorMessage(error)))
            .finally(() => setIsLoading(false));
    }

    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            onClose={onClose}
            placement="top-center"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Підтвердьте свою особу
                </ModalHeader>
                <ModalBody>
                    <div>Ми надіслали код на <strong>{user?.email ?? username_or_email}</strong> щоб підтвердити що це
                        ви.
                    </div>
                    {error && <div className="text-red-500">{error}</div>}
                    <Input
                        readOnly={isLoading}
                        autoFocus
                        isInvalid={error !== ''}
                        onChange={(e) => setCode(e.target.value)}
                        label="Ввести код"
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
    );
}
