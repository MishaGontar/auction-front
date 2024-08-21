import AdminPage from "../../AdminPage.tsx";
import {ChangeEvent, lazy, useEffect, useState} from "react";
import {AxiosResponse} from "axios";

import SpinnerView from "../../../../components/spinner/Spinner.tsx";
import {Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import ButtonModalConfirmDelete from "../../../../components/buttons/ButtonModalConfirmDelete.tsx";
import {IAuction} from "../../../auction/IAuction.ts";
import {IStatus} from "../../../../utils/IStatus.ts";
import {getInfoStatusById} from "../../../../utils/CustomUtils.ts";
import CustomChip from "../../../../components/chip/CustomChip.tsx";
import {sendSuccessfulNotify} from "../../../../utils/NotifyUtils.ts";
import SmallAvatar from "../../../../components/avatar/SmallAvatar.tsx";
import useAxios from "../../../../hooks/useAxios.ts";
import {ILotDashResponse, ILotPageResponse} from "../../../lots/LotInterfaces.ts";

const ModalAboutAuction = lazy(() => import("../../admin-modals/auction/ModalAboutAuctions.tsx"));
const ModalAboutLot = lazy(() => import("../../admin-modals/lot/ModalAboutLots.tsx"));

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
    const [clickedRow, setClickedRow] = useState<IData | undefined>();
    const [searchQuery, setSearchQuery] = useState("");
    const {isLoading, getAdminRequest, deleteAdminRequest} = useAxios();

    useEffect(() => {
        getAllData()
    }, []);

    function getAllData() {
        getAdminRequest(`/auctions_and_lots/all`, onSuccessRequest);
    }

    function onSuccessRequest(response: AxiosResponse) {
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
    }

    function handleSearch(event: ChangeEvent<HTMLInputElement>) {
        setSearchQuery(event.target.value);
    }

    const filteredData: IData[] = listData.filter((a) => {
        const matchName = a.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchSellerName = a.seller_name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchName || matchSellerName;
    });

    async function handleDelete(data: IData) {
        setClickedRow(undefined)
        const lot: ILotPageResponse = data.data as ILotPageResponse
        const auction: IAuction = data.data as IAuction

        const isLot = lot.lot_id !== undefined
        const url = isLot ? `lot/${lot.lot_id}` : `auction/${auction.auction_id}`

        deleteAdminRequest(`/delete/${url}`, async () => {
            sendSuccessfulNotify(
                `Видалено ${isLot ? `лот ${lot.lot_name}` : `аукціон ${auction.auction_name}`} успішно!`)
            getAllData()
        })
    }

    if (isLoading) {
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
