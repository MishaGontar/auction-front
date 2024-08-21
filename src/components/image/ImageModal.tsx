import { Modal, ModalContent } from "@nextui-org/react";
import {ReactNode, useState} from "react";

interface ImageModalProps {
    img_path: string;
    children: ReactNode;
}

export default function ImageModal({ img_path, children }: ImageModalProps) {
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    function openImageModal() {
        setIsImageModalOpen(true);
    }

    function closeImageModal() {
        setIsImageModalOpen(false);
    }

    return (
        <>
            <div onClick={openImageModal} className="cursor-pointer">
                {children}
            </div>
            <Modal
                placement="top"
                size="lg"
                backdrop="blur"
                isOpen={isImageModalOpen}
                onClose={closeImageModal}
            >
                <ModalContent>
                    <img src={img_path} alt="Enlarged view" className="w-auto h-auto max-w-full max-h-full" />
                </ModalContent>
            </Modal>
        </>
    );
}
