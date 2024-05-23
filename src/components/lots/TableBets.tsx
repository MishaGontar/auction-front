import {IBet} from "./IBet.ts";
import {Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {convertToKyivTime, formatNumberWithSpaces} from "../../utils/CustomUtils.ts";
import SmallAvatar from "../template/SmallAvatar.tsx";

interface Props {
    is_owner: boolean,
    bets: IBet[],
    onDelete: (bet_id: number) => void
}

export default function TableBets({is_owner, bets, onDelete}: Props) {
    return (<div className="my-5">
        <h1 className="mx-3.5 text-xl font-bold">Ставки користувачів:</h1>
        <Table>
            <TableHeader>
                <TableColumn>Аватар</TableColumn>
                <TableColumn>Ім'я</TableColumn>
                <TableColumn>Сума ставки</TableColumn>
                <TableColumn>Дата</TableColumn>
                {is_owner ? (
                    <TableColumn>Дії</TableColumn>
                ) : (
                    <TableColumn>{""}</TableColumn>
                )}
            </TableHeader>
            <TableBody>
                {bets.map((bet: IBet) => (
                    <TableRow key={bet.bet_id}
                              className={"hover:bg-amber-100"}>
                        <TableCell>
                            <SmallAvatar path={bet.user_img_url ?? "/images/user_logo_standard.png"}/>
                        </TableCell>
                        <TableCell>{bet.username ?? "Власник"}</TableCell>
                        <TableCell>{formatNumberWithSpaces(String(bet.amount))} грн</TableCell>
                        <TableCell>{convertToKyivTime(bet.date_created)}</TableCell>
                        {is_owner ? (
                            <TableCell>
                                <Button onClick={() => onDelete(bet.bet_id)}
                                        color="danger" variant="light">Видалити ставку</Button>
                            </TableCell>
                        ) : (
                            <TableCell>{""}</TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>)
}