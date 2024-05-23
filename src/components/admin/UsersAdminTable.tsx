import AdminPage from "./AdminPage.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import axios from "axios";

import SpinnerView from "../template/Spinner.tsx";
import {Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {SERVER_URL} from "../../constans.ts";
import {getAdminAuthConfig} from "../../utils/TokenUtils.ts";
import {IUser} from "../user/IUser.ts";
import ButtonModalConfirmDelete from "../template/ButtonModalConfirmDelete.tsx";
import {sendErrorNotify, sendSuccessfulNotify} from "../../utils/NotifyUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import SmallAvatar from "../template/SmallAvatar.tsx";


const columns: TableColumn[] = [
    {key: "avatar", label: "Аватар"},
    {key: "username", label: "Ім'я"},
    {key: "email", label: "Електрона пошта"},
    {key: "delete", label: "Видалити"},
];

interface TableColumn {
    key: string;
    label: string
}

export default function UserAdminTable() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setLoading(true)
        loadUsers();
    }, []);

    function loadUsers() {
        setLoading(true);
        axios.get(`${SERVER_URL}/users`, getAdminAuthConfig())
            .then(response => {
                console.table(response.data.users)
                setUsers(response.data.users)
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }

    function handleSearch(event: ChangeEvent<HTMLInputElement>) {
        setSearchQuery(event.target.value);
    }

    const filteredUsers = users.filter((u) => {
        const matchFullName = u.username.toLowerCase().includes(searchQuery.toLowerCase());
        const matchEmail = u.email.toLowerCase().includes(searchQuery.toLowerCase());

        return matchFullName || matchEmail;
    });

    function handleDelete(id: number, seller_id?: number) {
        setLoading(true)
        axios.delete(`${SERVER_URL}/user/delete/${id}/${seller_id}`, getAdminAuthConfig())
            .then(res => {
                const data = res.data;
                console.log(data)
                sendSuccessfulNotify(`Користувача ${data.user.username} видалено успішно`)
                loadUsers()
            })
            .catch(e => sendErrorNotify(getErrorMessage(e)))
            .finally(() => setLoading(false))
    }

    if (loading) {
        return <SpinnerView/>;
    }

    return (
        <AdminPage>
            <div className="flex flex-col gap-3">
                <div className="flex gap-3 justify-end mx-5">
                    <Input
                        placeholder="Пошук"
                        value={searchQuery}
                        className="max-w-xs"
                        onChange={handleSearch}
                    />
                </div>
                <Table aria-label="Таблиця користувачів">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={filteredUsers}>
                        {item => (
                            <TableRow
                                key={item.username}
                                className="hover:bg-amber-200"
                            >
                                <TableCell><SmallAvatar path={item.image_url}/></TableCell>
                                <TableCell>{item.username}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>
                                    <ButtonModalConfirmDelete
                                        object={`${item.username} акаунт`}
                                        onAccept={() => handleDelete(item.user_id, item?.seller_id)}/>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </AdminPage>
    );
}
