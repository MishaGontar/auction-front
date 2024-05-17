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
    const sellerStatus = seller.seller_status;
    const buttonsVisible = sellerStatus === "rejected" || sellerStatus === "pending"
    const colorStatus = sellerStatus === "rejected" ? "text-red-600" : ""

    function changeSellerStatus(action: string) {
        setIsLoading(true)
        axios.post(`${SERVER_URL}/seller/${action}`, seller, getAdminAuthConfig())
            .then(() => sendInfoNotify(`We successful ${action} seller ${seller.full_name} `))
            .catch(error => sendErrorNotify(error.message))
            .finally(() => {
                setIsLoading(false)
                onChange()
                onClose()
            })
    }

    function rejectSeller() {
        changeSellerStatus("reject")
    }

    function acceptSeller() {
        changeSellerStatus("accept")
    }

    return (<>
        <Modal placement="top-center"
               backdrop="opaque"
               isOpen={seller.seller_id !== null || seller.seller_id}
               onClose={onClose}
        >
            <ModalContent>
                {isLoading && <SpinnerView/>}
                {!isLoading && <>
                    <ModalHeader className="flex justify-center gap-1">
                        Seller {seller.full_name}
                    </ModalHeader>
                    <ModalBody className="sm:mx-10">
                        <div className="bg-white shadow-md rounded-lg p-6 w-80 ">
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
                                    <span className="font-semibold mx-0.5">Email:</span>
                                    {seller.email}
                                </li>

                                {seller.phone_number && (
                                    <li className="py-1">
                                        <span className="font-semibold mx-0.5">Phone:</span>
                                        {seller.phone_number}
                                    </li>
                                )}

                                {seller.address && (
                                    <li className="py-1">
                                        <span className="font-semibold mx-0.5">Address:</span>
                                        {seller.address}
                                    </li>
                                )}

                                <li className="py-1">
                                    <span className="font-semibold mx-0.5">Social Media:</span>
                                    {seller.social_media}
                                </li>

                                <li className={`py-1 ${colorStatus}`}>
                                <span className="font-semibold mx-0.5">
                                    Status:
                                </span>
                                    {seller.seller_status}
                                </li>
                            </ul>
                        </div>
                    </ModalBody>
                    <ModalFooter className="flex flex-col-reverse">
                        {buttonsVisible && (<>
                            {seller.seller_status === "pending" &&
                                <Button color="danger"
                                        onPress={rejectSeller}>
                                    Reject seller
                                </Button>
                            }
                            <Button color="success"
                                    onPress={acceptSeller}>
                                Accept seller
                            </Button>
                        </>)}
                    </ModalFooter>
                </>}
            </ModalContent>
        </Modal>
    </>)
}