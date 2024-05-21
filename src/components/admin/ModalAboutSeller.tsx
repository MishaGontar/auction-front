import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {SERVER_URL} from "../../constans.ts";
import axios from "axios";
import {useState} from "react";
import SpinnerView from "../template/Spinner.tsx";
import {ISeller} from "../seller/ISeller.ts";
import {getAdminAuthConfig} from "../../utils/TokenUtils.ts";
import {sendErrorNotify, sendInfoNotify} from "../../utils/NotifyUtils.ts";

interface SellerModalProps {
    seller: ISeller;
    onClose: () => void;
    onChange: () => void;
}

export default function ModalAboutSeller({seller, onClose, onChange}: SellerModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const sellerStatus = seller.seller_status_id;
    const buttonsVisible = sellerStatus === 1 || sellerStatus === 3
    const colorStatus = sellerStatus === 3 ? "text-red-600" : ""

    function changeSellerStatus(action_id: number) {
        setIsLoading(true)
        const action = action_id === 2 ? 'підтвердили' : 'відхилили';
        axios.post(`${SERVER_URL}/seller/${action_id}`, seller, getAdminAuthConfig())
            .then(() => sendInfoNotify(`Ми успішно ${action} продавця ${seller.full_name}`))
            .catch(error => sendErrorNotify(error.message))
            .finally(() => {
                setIsLoading(false)
                onChange()
                onClose()
            })
    }

    function rejectSeller() {
        changeSellerStatus(3)
    }

    function acceptSeller() {
        changeSellerStatus(2)
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
                            <img src={`${SERVER_URL}${seller.image_url}`}
                                 alt={seller.full_name}
                                 className="rounded-full w-20 h-20 mx-auto mb-4"/>

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