import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {SERVER_URL} from "../../../../constans.ts";
import SpinnerView from "../../../../components/spinner/Spinner.tsx";
import {sendInfoNotify} from "../../../../utils/NotifyUtils.ts";
import ImageModal from "../../../../components/image/ImageModal.tsx";
import {useMemo} from "react";
import useAxios from "../../../../hooks/useAxios.ts";
import {ISeller} from "../../../seller/ISeller.ts";

interface SellerModalProps {
    seller: ISeller;
    onClose: () => void;
    onChange: () => void;
}

export default function ModalAboutSeller({seller, onClose, onChange}: SellerModalProps) {
    const sellerStatus = useMemo(() => seller.seller_status_id, [seller])
    const buttonsVisible = useMemo(() => sellerStatus === 1 || sellerStatus === 3, [sellerStatus])
    const colorStatus = useMemo(() => sellerStatus === 3 ? "text-red-600" : "", [sellerStatus])
    const {isLoading, postAdminRequest} = useAxios();

    async function changeSellerStatus(action_id: number) {
        const action = action_id === 2 ? 'підтвердили' : 'відхилили';

        function handleSeller() {
            postAdminRequest(`/seller/${action_id}`, seller,
                () => sendInfoNotify(`Ми успішно ${action} продавця ${seller.full_name}`))
            onChange()
            onClose()
        }

        handleSeller();
    }

    async function rejectSeller() {
        await changeSellerStatus(3)
    }

    async function acceptSeller() {
        await changeSellerStatus(2)
    }

    return (<>
        <Modal placement="top-center"
               size="lg"
               backdrop="opaque"
               isOpen={seller.seller_id !== null || seller.seller_id}
               onClose={onClose}
        >
            <ModalContent>
                {isLoading && <SpinnerView/>}
                {!isLoading && <>
                    <ModalHeader className="flex justify-center gap-1">
                        Продавець {seller.full_name}
                    </ModalHeader>
                    <ModalBody className="sm:mx-10">
                        <div className="bg-white shadow-md rounded-lg p-6 ">
                            <div className="flex justify-center">
                                <ImageModal img_path={`${SERVER_URL}${seller.image_url}`}>
                                    <img src={`${SERVER_URL}${seller.image_url}`}
                                         alt={seller.full_name}
                                         className="w-[100px] sm:w-[200px] md:w-[150px] h-auto"/>
                                </ImageModal>
                            </div>
                            <h2 className="text-xl font-semibold text-center mb-2">
                                {seller.full_name}
                            </h2>

                            <p className="text-sm text-gray-500 mb-4">
                                {seller.description}
                            </p>

                            <ul className="divide-y divide-gray-200">
                                <li className="py-1">
                                    <span className="font-semibold mx-0.5">Електрона адреса:</span>
                                    {seller.email}
                                </li>

                                {seller.phone_number && (
                                    <li className="py-1">
                                        <span className="font-semibold mx-0.5">Телефон:</span>
                                        {seller.phone_number}
                                    </li>
                                )}

                                {seller.address && (
                                    <li className="py-1">
                                        <span className="font-semibold mx-0.5">Адреса:</span>
                                        {seller.address}
                                    </li>
                                )}

                                <li className="py-1">
                                    <span className="font-semibold mx-0.5">Соціальні мережі:</span>
                                    {seller.social_media}
                                </li>

                                <li className={`py-1 ${colorStatus}`}>
                                <span className="font-semibold mx-0.5">
                                    Статус:
                                </span>
                                    {seller.seller_status}
                                </li>
                            </ul>
                        </div>
                    </ModalBody>
                    <ModalFooter className="flex flex-col-reverse">
                        {buttonsVisible && (<>
                            {sellerStatus === 1 &&
                                <Button color="danger"
                                        onPress={rejectSeller}>
                                    Відмовитися від продавця
                                </Button>
                            }
                            <Button color="success"
                                    onPress={acceptSeller}>
                                Підтвердити продавця
                            </Button>
                        </>)}
                    </ModalFooter>
                </>}
            </ModalContent>
        </Modal>
    </>)
}