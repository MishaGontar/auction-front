import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/react";

interface IModalConfirmProps {
    object: string,
    onAccept: () => void
}

export default function ButtonModalConfirmDelete({object, onAccept}: IModalConfirmProps) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    function handleAccept(onClose: () => void) {
        onAccept()
        onClose()
    }

    return (<>
        <Button onPress={onOpen} className="mt-3.5" variant="light" color="danger">Видалити</Button>
        <Modal
            backdrop="opaque"
            placement="top-center"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Підтвердження видалення</ModalHeader>
                        <ModalBody>
                            <p>Чи дійсно ви хочете <strong className="text-red-600">видалити</strong> цей {object}?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onPress={onClose}>
                                Ні
                            </Button>
                            <Button color="danger" variant="light" onPress={() => handleAccept(onClose)}>
                                Так
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>)
}