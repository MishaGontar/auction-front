import AdminPage from "../../AdminPage.tsx";
import {useEffect, useMemo, useState} from "react";
import {AxiosResponse} from "axios";

import SpinnerView from "../../../../components/spinner/Spinner.tsx";
import {
    Input,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import ModalAboutSeller from "../../admin-modals/seller/ModalAboutSeller.tsx";
import {IStatus} from "../../../../utils/IStatus.ts";
import {capitalizeFirstLetter, getColorByStatus} from "../../../../utils/CustomUtils.ts";
import CustomChip from "../../../../components/chip/CustomChip.tsx";
import SmallAvatar from "../../../../components/avatar/SmallAvatar.tsx";
import useTitle from "../../../../hooks/useTitle.ts";
import useAxios from "../../../../hooks/useAxios.ts";
import {ISeller} from "../../../seller/ISeller.ts";


const columns: TableColumn[] = [
    {key: "avatar", label: "Аватар"},
    {key: "full_name", label: "Повне ім'я"},
    {key: "email", label: "Електрона пошта"},
    {key: "username", label: "Ім'я користувача"},
    {key: "status", label: "Статус"},
];

interface TableColumn {
    key: string;
    label: string
}

export default function SellerAdminTable() {
    useTitle('Адміністративна панель')

    const [sellers, setSellers] = useState<ISeller[]>([]);
    const [clickedRow, setClickedRow] = useState<ISeller | undefined>()
    const [searchQuery, setSearchQuery] = useState("");
    const [status, setStatus] = useState<IStatus[]>([])
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const {isLoading, getAdminRequest} = useAxios()
    useEffect(() => {
        getAdminRequest('/sellers/status', (res: AxiosResponse) => setStatus(res.data.status))
        loadSellers();
    }, []);

    function loadSellers() {
        getAdminRequest('/sellers', (res: AxiosResponse) => setSellers(res.data.sellers))
    }

    function openModal(seller: ISeller) {
        setClickedRow(seller)
    }

    function resetRow() {
        setClickedRow(undefined)
    }

    function handleSearch(e: any) {
        setSearchQuery(e.target.value);
    }

    const handleSelectionChange = (e: any) => {
        const status: string[] = e.target.value.trim().split(',');
        setStatusFilter(status)
    };

    const filteredSellers = useMemo(() => sellers.filter((seller) => {
        const matchFullName = seller.full_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchEmail = seller.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchUsername = seller.username.toLowerCase().includes(searchQuery.toLowerCase());

        const isMatch = matchFullName || matchEmail || matchUsername;
        if (statusFilter.length === 0 || (statusFilter.length === 1 && statusFilter[0] === "") || (statusFilter.length === status.length + 1)) {
            return isMatch;
        }
        return isMatch && statusFilter.some(s => +s === seller.seller_status_id);
    }), [sellers, statusFilter, searchQuery]);

    if (isLoading) {
        return <SpinnerView/>;
    }

    return (
        <AdminPage>
            {clickedRow && <ModalAboutSeller seller={clickedRow} onClose={resetRow} onChange={loadSellers}/>}
            <div className="flex flex-col gap-3">
                <div className="flex gap-3 justify-end mx-5">
                    <Input
                        placeholder="Пошук"
                        value={searchQuery}
                        className="max-w-xs"
                        onChange={handleSearch}
                    />
                    <Select
                        placeholder="Віберіть статус"
                        selectionMode="multiple"
                        className="max-w-xs"
                        onChange={handleSelectionChange}
                    >
                        {status.map((s: IStatus) => (
                            <SelectItem key={+s.id} value={s.name}>
                                {capitalizeFirstLetter(s.name)}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <Table aria-label="Таблиця продавців">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={filteredSellers}>
                        {item => (
                            <TableRow
                                onClick={() => openModal(item)}
                                key={item.username}
                                className="hover:bg-amber-200"
                            >
                                <TableCell>{<SmallAvatar path={item.image_url}/>}</TableCell>
                                <TableCell>{item.full_name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.username}</TableCell>
                                <TableCell>
                                    <CustomChip color={getColorByStatus(item.seller_status_id)}
                                                text={item.seller_status}/>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdminPage>
    );
}
