import AdminPage from "./AdminPage.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import axios from "axios";

import SpinnerView from "../template/Spinner.tsx";
import {
    Chip,
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
import {SERVER_URL} from "../../constans.ts";
import ModalAboutSeller from "./ModalAboutSeller.tsx";
import {ISeller} from "../seller/ISeller.ts";
import {IStatus} from "../../utils/IStatus.ts";
import {getAdminAuthConfig} from "../../utils/TokenUtils.ts";


const columns = [
    {key: "full_name", label: "Full Name"},
    {key: "email", label: "Email"},
    {key: "username", label: "Username"},
    {key: "status", label: "Status"},
];


export default function AdminDashBoard() {
    const [sellers, setSellers] = useState<ISeller[]>([]);
    const [loading, setLoading] = useState(true);
    const [clickedRow, setClickedRow] = useState<ISeller | undefined>()
    const [searchQuery, setSearchQuery] = useState("");
    const [status, setStatus] = useState<IStatus[]>([])
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    useEffect(() => {
        document.title = "Admin Dash Board";
        setLoading(true)
        axios.get(`${SERVER_URL}/sellers/status`, getAdminAuthConfig())
            .then(response => setStatus(response.data.status))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
        loadSellers();
    }, []);

    function loadSellers() {
        setLoading(true);
        axios.get(`${SERVER_URL}/sellers`, getAdminAuthConfig())
            .then(response => setSellers(response.data.sellers))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }

    function openModal(seller: ISeller) {
        setClickedRow(seller)
    }

    function resetRow() {
        setClickedRow(undefined)
    }

    function handleSearch(event: ChangeEvent<HTMLInputElement>) {
        setSearchQuery(event.target.value);
    }

    function getColorByStatus(s: string) {
        if (s === "accepted") return "success"
        if (s === "pending") return "warning"
        if (s === "rejected") return "danger"
    }

    const handleSelectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const status: string[] = e.target.value.trim().split(',');
        setStatusFilter(status)
    };

    const filteredSellers = sellers.filter((seller) => {
        const matchFullName = seller.full_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchEmail = seller.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchUsername = seller.username.toLowerCase().includes(searchQuery.toLowerCase());

        const isMatch = matchFullName || matchEmail || matchUsername;
        if (statusFilter.length === 0 || (statusFilter.length === 1 && statusFilter[0] === "") || (statusFilter.length === status.length + 1)) {
            return isMatch;
        }
        return isMatch && statusFilter.some(s => s === seller.seller_status);
    });

    if (loading) {
        return <SpinnerView/>;
    }

    return (
        <AdminPage>
            {clickedRow && <ModalAboutSeller seller={clickedRow} onClose={resetRow} onChange={loadSellers}/>}
            <div className="flex flex-col gap-3">
                <div className="flex justify-center items-center">
                    <div className="text-center mt-8">
                        <h1 className="text-3xl font-bold text-gray-800">All Sellers</h1>
                        <div className="w-20 h-1 bg-indigo-600 mx-auto mt-2 rounded"></div>
                    </div>
                </div>
                <div className="flex gap-3 justify-end mx-5">
                    <Input
                        placeholder="Search "
                        value={searchQuery}
                        className="max-w-xs"
                        onChange={handleSearch}
                    />
                    <Select
                        placeholder="Select a status"
                        selectionMode="multiple"
                        className="max-w-xs"
                        onChange={handleSelectionChange}
                    >
                        <SelectItem key="accepted" value="Accepted" color="success">
                            Accepted
                        </SelectItem>
                        <SelectItem key="pending" value="Pending" color="warning">
                            Pending
                        </SelectItem>
                        <SelectItem key="rejected" value="Rejected" color="danger">
                            Rejected
                        </SelectItem>
                    </Select>
                </div>
                <Table aria-label="Sellers Table">
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
                                <TableCell>{item.full_name}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.username}</TableCell>
                                <TableCell>
                                    <Chip className="capitalize"
                                          color={getColorByStatus(item.seller_status)}
                                          size="sm"
                                          variant="flat">
                                        {item.seller_status}
                                    </Chip>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdminPage>
    );
}
