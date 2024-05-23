import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import {SERVER_URL} from "../../constans.ts";
import {useEffect, useState} from "react";
import {IData} from "./AuctionsLotsAdminTable.tsx";
import {IAuction} from "../auction/IAuction.ts";
import CustomChip from "../template/CustomChip.tsx";
import {convertToKyivTime} from "../../utils/CustomUtils.ts";
import {ILotPageResponse} from "../lots/LotInterfaces.ts";
import ButtonModalConfirmDelete from "../template/ButtonModalConfirmDelete.tsx";

interface ModalProps {
    data: IData;
    dataList: IData[]
    onClose: () => void;
    handleClick: () => void;
}

export default function ModalAboutAuction({data, dataList, onClose, handleClick}: ModalProps) {
    const [count, setCount] = useState(0);
    const auction: IAuction = data.data as IAuction;

    useEffect(() => {
        setCount(dataList.filter((d: IData) => {
            const d_l = d.data as ILotPageResponse
            return d_l.auction_id === auction.auction_id && d_l.lot_id !== undefined;
        }).length);
    }, []);

    return (<>
        <Modal placement="top-center"
               size="lg"
               scrollBehavior="normal"
               backdrop="opaque"
               isOpen={auction.auction_id !== undefined}
               onClose={onClose}
        >
            <ModalContent>
                <ModalHeader className="flex justify-center gap-1">
                    Аукціон {auction.auction_name}
                </ModalHeader>
                <ModalBody className="sm:mx-10">
                    <div className="bg-white shadow-md rounded-lg p-6 ">
                        <img src={`${SERVER_URL}${auction.auction_img_path}`}
                             alt={auction.auction_name}
                             className=" w-120 h-120 mx-auto mb-4"/>

                        <h2 className="text-xl font-semibold text-center mb-2">
                            {auction.auction_name}
                        </h2>

                        <p className="text-sm text-gray-500 mb-4">
                            {auction.auction_description}
                        </p>

                        <ul className="divide-y divide-gray-200">
                            <li className="py-1">
                                <span className="font-semibold mx-0.5">Продавець:</span>
                                {auction.seller_name}
                            </li>

                            <li className="py-1">
                                <span className="font-semibold mx-0.5">Кількість лотів:</span>
                                {count}
                            </li>

                            <li className={`py-1`}>
                                    <span className="font-semibold mx-0.5">
                                        Статус:
                                    </span>
                                <CustomChip color={data.status.color} text={data.status.name}/>
                            </li>

                            <li className={`py-1`}>
                                    <span className="font-semibold mx-0.5">
                                        Дата створення:
                                    </span>
                                {convertToKyivTime(auction.date_created)}
                            </li>
                        </ul>
                    </div>
                </ModalBody>
                <ModalFooter className="flex flex-col">
                    <ButtonModalConfirmDelete object="аукціон" onAccept={handleClick}/>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>)
}