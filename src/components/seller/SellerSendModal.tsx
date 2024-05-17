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
                <ModalHeader className="flex flex-col gap-1">Information</ModalHeader>
                <ModalBody>
                    <div>We have sent a letter to the administration to confirm your application to become an auction
                        seller. We will send you a letter to your mail <strong>{username_or_email}</strong>
                    </div>
                    <div className="italic text-orange-500">
                        If you want to get a faster answer, please contact us
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={() => navigation('/auctions')}> Okay </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}