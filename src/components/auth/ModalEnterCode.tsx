import {Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import axios from "axios";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {IUser} from "../user/IUser.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {getMfaAuthConfig, removeMfaToken, saveAuthToken} from "../../utils/TokenUtils.ts";
import {usePage} from "../page/PageContext.tsx";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";

export interface IModalProps {
    isOpen: boolean,
    onClose?: () => void,
    username_or_email: string,
}

export default function ModalEnterCode({isOpen, onClose, username_or_email}: IModalProps) {
    const [code, setCode] = useState('');
    const {isLoading, setIsLoading, error, setError} = usePage();
    const [user, setUser] = useState<IUser>();
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            axios.get(`/user`, getMfaAuthConfig())
                .then(res => setUser(res.data))
                .catch((error) => sendErrorNotify(getErrorMessage(error)))
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
        axios.post(`/auth/code`, data, getMfaAuthConfig())
            .then(response => {
                removeMfaToken();
                saveAuthToken(response.data.token);
                navigate('/auctions');
                onClose && onClose();
            })
            .catch((error) => setError(getErrorMessage(error)))
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
                <ModalHeader className="flex flex-col gap-1" data-test-id="modal-header">
                    Підтвердьте свою особу
                </ModalHeader>
                <ModalBody>
                    <div data-test-id="modal-text">
                        Ми надіслали код на <strong>{user?.email ?? username_or_email}</strong> щоб підтвердити що це
                        ви.
                    </div>
                    {error &&
                        <div className="text-red-500" data-test-id="modal-error">
                            {error}
                        </div>
                    }
                    <Input
                        readOnly={isLoading}
                        autoFocus
                        isInvalid={error !== ''}
                        onChange={(e) => setCode(e.target.value)}
                        label="Ввести код"
                        data-test-id="modal-enter-code"
                        variant="bordered"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        isLoading={isLoading}
                        color="primary"
                        onClick={confirmCode}
                        data-test-id="modal-send-button"
                    >
                        Надіслати код
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
