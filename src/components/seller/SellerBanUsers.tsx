import {LARGE_BOX_CARD} from "../../constans.ts";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import {useEffect, useState} from "react";
import SpinnerView from "../template/Spinner.tsx";
import axios from "axios";
import {getAuthConfig} from "../../utils/TokenUtils.ts";
import {sendErrorNotify, sendSuccessfulNotify} from "../../utils/NotifyUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import ClickableAvatar from "../template/ClickableAvatar.tsx";
import {convertToKyivTime} from "../../utils/CustomUtils.ts";
import {usePage} from "../page/PageContext.tsx";

interface IUserTable {
    user_id: number,
    username: string,
    image_url: string;
    date_created: string
}

export default function SellerBanUsers({seller_id}: { seller_id: number | undefined }) {
    const {isLoading, setIsLoading} = usePage();
    const [users, setUsers] = useState<IUserTable[]>([])

    useEffect(() => getBlockUsers(), []);

    function getBlockUsers() {
        setIsLoading(true)
        axios.post(`/seller/users/blocked`, {seller_id: seller_id}, getAuthConfig())
            .then(res => setUsers(res.data.users))
            .catch(error => sendErrorNotify(getErrorMessage(error)))
            .finally(() => setIsLoading(false));
    }

    function handleUnblockUser(user_id: number, username: string) {
        setIsLoading(true)
        axios.post(`/seller/users/unblock/${user_id}`, {seller_id: seller_id}, getAuthConfig())
            .then(() => {
                sendSuccessfulNotify(`Користувача ${username} було розблаковано`);
                getBlockUsers()
            })
            .catch(error => sendErrorNotify(getErrorMessage(error)))
            .finally(() => setIsLoading(false));
    }

    if (isLoading) {
        return <SpinnerView/>
    }
    return (
        <Card className={`${LARGE_BOX_CARD} w-full`}>
            <CardHeader className="pb-0 pt-2 px-4 flex justify-center py-5">
                <p className="text-3xl font-bold">Заблоковані користувачі</p>
            </CardHeader>
            <CardBody>
                <Table aria-label="Таблиця користувачів">
                    <TableHeader>
                        <TableColumn key="avatar">Аватар</TableColumn>
                        <TableColumn key="ім'я">Ім'я</TableColumn>
                        <TableColumn key="дата">Дата блокування</TableColumn>
                        <TableColumn key="дія">Дія</TableColumn>
                    </TableHeader>
                    <TableBody items={users}>
                        {item => (
                            <TableRow
                                key={item.username}
                                className="hover:bg-amber-200"
                            >
                                <TableCell><ClickableAvatar path={item.image_url}/></TableCell>
                                <TableCell>{item.username}</TableCell>
                                <TableCell>{convertToKyivTime(item.date_created)}</TableCell>
                                <TableCell>
                                    <Button color="success" variant="solid"
                                            onClick={() => handleUnblockUser(item.user_id, item.username)}>
                                        Розблокувати
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardBody>
        </Card>
    )
}