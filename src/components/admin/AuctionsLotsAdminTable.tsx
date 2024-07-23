import AdminPage from "./AdminPage.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import axios from "axios";

import SpinnerView from "../template/Spinner.tsx";
import {Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {getAdminAuthConfig} from "../../utils/TokenUtils.ts";
import ButtonModalConfirmDelete from "../template/ButtonModalConfirmDelete.tsx";
import {IAuction} from "../auction/IAuction.ts";
import {ILotDashResponse, ILotPageResponse} from "../lots/LotInterfaces.ts";
import {IStatus} from "../../utils/IStatus.ts";
import {getInfoStatusById} from "../../utils/CustomUtils.ts";
import CustomChip from "../template/CustomChip.tsx";
import ModalAboutAuction from "./ModalAboutAuctions.tsx";
import {sendErrorNotify, sendSuccessfulNotify} from "../../utils/NotifyUtils.ts";
import ModalAboutLot from "./ModalAboutLots.tsx";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import SmallAvatar from "../template/SmallAvatar.tsx";
import {usePage} from "../page/PageContext.tsx";


const columns: TableColumn[] = [
    {key: "picture", label: "Картинка"},
    {key: "name", label: "Назва"},
    {key: "seller", label: "Продавець"},
    {key: "status", label: "Статус"},
    {key: "delete", label: "Видалити"},
];

interface TableColumn {
    key: string;
    label: string
}

export interface IData {
    name: string;
    seller_name: string;
    status: IStatus;
    data: IAuction | ILotDashResponse;
    img_path: string;
}

export default function AuctionsLotsAdminTable() {
    const [listData, setListData] = useState<IData[]>([]);
    const [clickedRow, setClickedRow] = useState<IData | undefined>()
    const {loading, setLoading} = usePage();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setLoading(true)
        loadData();
    }, []);

    function loadData() {
        setLoading(true);
        axios.get(`/auctions_and_lots/all`, getAdminAuthConfig())
            .then(response => {
                const {auctions, lots} = response.data
                const newData: IData[] = []
                auctions.forEach((a: IAuction) => {
                    const auction: IData = {
                        name: a.auction_name,
                        seller_name: a.seller_name,
                        status: getInfoStatusById(a.auction_status_id),
                        data: a,
                        img_path: a.auction_img_path
                    }
                    newData.push(auction)
                })
                lots.forEach((l: ILotDashResponse) => {
                    const lot: IData = {
                        name: l.lot_name,
                        seller_name: l.seller_full_name,
                        status: getInfoStatusById(l.lot_status_id),
                        data: l,
                        img_path: l.images[0].image_url
                    }
                    newData.push(lot)
                })
                setListData(newData)
            })
            .catch(error => sendErrorNotify(getErrorMessage(error)))
            .finally(() => setLoading(false));
    }

    function handleSearch(event: ChangeEvent<HTMLInputElement>) {
        setSearchQuery(event.target.value);
    }

    const filteredData: IData[] = listData.filter((a) => {
        const matchName = a.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchSellerName = a.seller_name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchName || matchSellerName;
    });

    function handleDelete(data: IData) {
        setLoading(true)
        setClickedRow(undefined)
        const lot: ILotPageResponse = data.data as ILotPageResponse
        const auction: IAuction = data.data as IAuction

        const isLot = lot.lot_id !== undefined
        const url = isLot ? `lot/${lot.lot_id}` : `auction/${auction.auction_id}`
        axios.delete(`/delete/${url}`, getAdminAuthConfig())
            .then(() => {
                sendSuccessfulNotify(
                    `Видалено ${isLot ? `лот ${lot.lot_name}` : `аукціон ${auction.auction_name}`} успішно!`
                )
                loadData()
            })
            .catch(error => sendErrorNotify(getErrorMessage(error)))
            .finally(() => setLoading(false));
    }


    if (loading) {
        return <SpinnerView/>;
    }
    return (
        <AdminPage>
            {clickedRow && (clickedRow.data as ILotPageResponse).lot_id !== undefined &&
                <ModalAboutLot
                    data={clickedRow}
                    onClose={() => setClickedRow(undefined)}
                    handleClick={() => handleDelete(clickedRow)}/>
            }
            {clickedRow && (clickedRow.data as IAuction).auction_img_path !== undefined &&
                <ModalAboutAuction
                    data={clickedRow}
                    dataList={listData}
                    onClose={() => setClickedRow(undefined)}
                    handleClick={() => handleDelete(clickedRow)}/>
            }

            <div className="flex flex-col gap-3">
                <div className="flex gap-3 justify-end mx-5">
                    <Input
                        placeholder="Пошук"
                        value={searchQuery}
                        className="max-w-xs"
                        onChange={handleSearch}
                    />
                </div>
                <Table aria-label="Таблиця аукціонів та лотів">
                    <TableHeader columns={columns}>
                        {(column: TableColumn) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((d: IData) => (
                            <TableRow key={d.name + d.seller_name + d.status} className="hover:bg-amber-200"
                                      onClick={() => setClickedRow(d)}
                            >
                                <TableCell><SmallAvatar path={d.img_path}/></TableCell>
                                <TableCell>{d.name}</TableCell>
                                <TableCell>{d.seller_name}</TableCell>
                                <TableCell>
                                    <CustomChip color={d.status.color} text={d.status.name}/>
                                </TableCell>
                                <TableCell>
                                    <ButtonModalConfirmDelete
                                        object={`${d.name} ${d.data as ILotPageResponse ? "лот" : "аукціон"}`}
                                        onAccept={() => handleDelete(d)}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AdminPage>
    );
}
