import {IBet} from "./IBet.ts";
import {Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {convertToKyivTime, formatNumberWithSpaces} from "../../utils/CustomUtils.ts";

interface Props {
    is_owner: boolean,
    bets: IBet[],
    onDelete: (bet_id: number) => void
}

export default function TableBets({is_owner, bets, onDelete}: Props) {
    return (<div className="my-5">
        <h1 className="mx-3.5 text-xl font-bold">Users bets:</h1>
        <Table>
            <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Bet amount</TableColumn>
                <TableColumn>Date</TableColumn>
                {is_owner ? (
                    <TableColumn>Delete Action</TableColumn>
                ) : (
                    <TableColumn>{""}</TableColumn>
                )}
            </TableHeader>
            <TableBody>
                {bets.map((bet: IBet) => (
                    <TableRow key={bet.bet_id}
                              className={"hover:bg-amber-100"}>
                        <TableCell>{bet.username ?? "Owner"}</TableCell>
                        <TableCell>{formatNumberWithSpaces(String(bet.amount))} UAH</TableCell>
                        <TableCell>{convertToKyivTime(bet.date_created)}</TableCell>
                        {is_owner ? (
                            <TableCell>
                                <Button onClick={() => onDelete(bet.bet_id)}
                                        color="danger" variant="light">Delete bet</Button>
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