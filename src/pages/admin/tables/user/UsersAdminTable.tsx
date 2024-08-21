import AdminPage from "../../AdminPage.tsx";
import {useEffect, useMemo, useState} from "react";
import {AxiosResponse} from "axios";

import SpinnerView from "../../../../components/spinner/Spinner.tsx";
import {Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {IUser} from "../../../user/IUser.ts";
import ButtonModalConfirmDelete from "../../../../components/buttons/ButtonModalConfirmDelete.tsx";
import {sendSuccessfulNotify} from "../../../../utils/NotifyUtils.ts";
import ClickableAvatar from "../../../../components/avatar/ClickableAvatar.tsx";
import useAxios from "../../../../hooks/useAxios.ts";
import useInput from "../../../../hooks/useInput.ts";


const columns: ITableColumn[] = [
    {key: "avatar", label: "Аватар"},
    {key: "username", label: "Ім'я"},
    {key: "email", label: "Електрона пошта"},
    {key: "delete", label: "Видалити"},
];

interface ITableColumn {
    key: string;
    label: string
}

export default function UserAdminTable() {
    const [users, setUsers] = useState<IUser[]>([]);
    const search = useInput('');
    const {isLoading, getAdminRequest, deleteAdminRequest} = useAxios();

    useEffect(() => loadUsers(), []);

    function loadUsers() {
        getAdminRequest('/users', (res: AxiosResponse) => setUsers(res.data.users))
    }

    const filteredUsers = useMemo(() => users.filter((u) => {
        const matchFullName = u.username.toLowerCase().includes(search.value.toLowerCase());
        const matchEmail = u.email.toLowerCase().includes(search.value.toLowerCase());

        return matchFullName || matchEmail;
    }), [users, search.value]);

    function handleDelete(id: number, seller_id?: number) {
        deleteAdminRequest(`/user/delete/${id}/${seller_id}`, (res: AxiosResponse) => {
            sendSuccessfulNotify(`Користувача ${res.data.user.username} видалено успішно`)
            loadUsers()
        })
    }

    if (isLoading) {
        return <SpinnerView/>;
    }

    return (
        <AdminPage>
            <div className="flex flex-col gap-3">
                <div className="flex gap-3 justify-end mx-5">
                    <Input
                        placeholder="Пошук"
                        className="max-w-xs"
                        {...search.bind}
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
                                <TableCell><ClickableAvatar path={item.image_url}/></TableCell>
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
