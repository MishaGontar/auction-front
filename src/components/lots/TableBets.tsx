import {IBet} from "./IBet.ts";
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from "@nextui-org/react";
import {convertToKyivTime, formatNumberWithSpaces} from "../../utils/CustomUtils.ts";
import ClickableAvatar from "../template/ClickableAvatar.tsx";

interface Props {
    is_owner: boolean,
    bets: IBet[],
    onDelete: (bet_id: number) => void,
    onBlockUser: (user_id: number) => void
}

export default function TableBets({is_owner, bets, onDelete, onBlockUser}: Props) {
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
                            <ClickableAvatar path={bet.user_img_url ?? "/images/user_logo_standard.png"}/>
                        </TableCell>
                        <TableCell>{bet.username ?? "Власник"}</TableCell>
                        <TableCell>{formatNumberWithSpaces(String(bet.amount))} грн</TableCell>
                        <TableCell>{convertToKyivTime(bet.date_created)}</TableCell>
                        {is_owner ? (
                            <TableCell>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button size="md" color="primary" variant="bordered">
                                            Дії
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Static Actions">
                                        <DropdownItem key="delete" className="font-bold my-1.5"
                                                      onClick={() => onDelete(bet.bet_id)}>
                                            Видалити ставку
                                        </DropdownItem>
                                        <DropdownItem key="block"
                                                      className={`${bet.username ? "" : "hidden"} text-danger`}
                                                      color="danger"
                                                      onClick={() => onBlockUser(bet.user_id)}>
                                            Заблокувати користувача
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
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