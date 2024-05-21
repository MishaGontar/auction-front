import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {IModalProps} from "../auth/ModalEnterCode.tsx";
import {useNavigate} from "react-router-dom";

export default function SellerSendModal({isOpen, username_or_email}: IModalProps) {
    const navigation = useNavigate();
    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            placement="top-center"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Інформація</ModalHeader>
                <ModalBody>
                    <div>Ми надіслали листа адміністрації для підтвердження вашої заявки щоб стати продавцем.
                        Ми надішлемо вам листа на пошту <strong>{username_or_email} </strong> .
                    </div>
                    <div className="italic text-orange-600">
                        Якщо ви хочете швидше отримати відповідь, зв'яжіться з нами
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => navigation('/auctions')}> Добре </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}