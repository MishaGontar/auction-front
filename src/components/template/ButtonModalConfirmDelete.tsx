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
        <Button onPress={onOpen} className="mt-3.5" variant="light" color="danger">Delete</Button>
        <Modal
            backdrop="opaque"
            placement="top-center"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Modal confirm delete</ModalHeader>
                        <ModalBody>
                            <p>Are you sure you want <strong className="text-red-600">delete</strong> this {object}?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onPress={onClose}>
                                No
                            </Button>
                            <Button color="danger" variant="light" onPress={() => handleAccept(onClose)}>
                                Yes
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>)
}