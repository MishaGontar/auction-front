import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {SERVER_URL} from "../../constans.ts";
import {useEffect, useState} from "react";
import {IData} from "./AuctionsLotsAdminTable.tsx";
import CustomChip from "../template/CustomChip.tsx";
import {convertToKyivTime, formatNumberWithSpaces} from "../../utils/CustomUtils.ts";
import {ILotPageResponse} from "../lots/LotInterfaces.ts";
import ButtonModalConfirmDelete from "../template/ButtonModalConfirmDelete.tsx";
import ImagesSlider from "../template/ImagesSlider.tsx";
import axios from "axios";
import {getAdminAuthConfig} from "../../utils/TokenUtils.ts";
import {IImage} from "../../utils/ImageUtils.ts";
import SpinnerView from "../template/Spinner.tsx";
import NameValueView from "../template/NameValueView.tsx";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";

interface ModalProps {
    data: IData;
    onClose: () => void;
    handleClick: () => void;
}

export default function ModalAboutLot({data, onClose, handleClick}: ModalProps) {
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<IImage[]>([]);
    const lot: ILotPageResponse = data.data as ILotPageResponse;

    useEffect(() => {
        setLoading(true)
        axios.get(`${SERVER_URL}/lot/images/${lot.lot_id}`, getAdminAuthConfig())
            .then(res => setImages(res.data.images))
            .catch(error => sendErrorNotify(getErrorMessage(error)))
            .finally(() => setLoading(false));
    }, []);

    return (<>
        <Modal placement="top"
               scrollBehavior="normal"
               size="2xl"
               backdrop="opaque"
               isOpen={lot.lot_id !== undefined}
               onClose={onClose}
        >
            <ModalContent>
                {loading && <SpinnerView/>}
                {!loading && <>
                    <ModalHeader className="flex justify-center gap-1">
                        Лот {lot.lot_name}
                    </ModalHeader>
                    <ModalBody className="sm:mx-10">
                        <div className="bg-white shadow-md rounded-lg p-6 ">
                            <div className="mb-14">
                                <ImagesSlider images={images}/>
                            </div>

                            <h2 className="text-xl font-semibold text-center mb-2">
                                {lot.lot_name}
                            </h2>

                            <p className="text-sm text-gray-500 mb-4">
                                {lot.lot_description}
                            </p>

                            <ul className="divide-y divide-gray-200">
                                <NameValueView name="Продавець:"
                                               value={lot.seller_full_name}/>
                                <NameValueView name="Продається на аукціоні:"
                                               value={lot.auction_name}/>
                                <NameValueView name="Статус:"
                                               value={<CustomChip color={data.status.color} text={data.status.name}/>}/>
                                <NameValueView name="Поточна сума:"
                                               value={formatNumberWithSpaces(lot.lot_amount.toString())}/>
                                {lot.lot_monobank_link &&
                                    <NameValueView name="Посилання на Monobank банку:"
                                                   value={lot.lot_monobank_link}/>
                                }
                                {lot.lot_bank_card_number &&
                                    <NameValueView name="Номер картки:"
                                                   value={lot.lot_bank_card_number}/>
                                }
                                <NameValueView name="Дата створення:"
                                               value={convertToKyivTime(lot.lot_date_created)}/>
                            </ul>
                        </div>
                    </ModalBody>
                    <ModalFooter className="flex flex-col">
                        <ButtonModalConfirmDelete object="лот" onAccept={handleClick}/>
                    </ModalFooter>
                </>
                }
            </ModalContent>
        </Modal>
    </>)
}