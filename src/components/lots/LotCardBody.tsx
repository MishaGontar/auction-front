import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {getInfoStatusById} from "../../utils/CustomUtils.ts";
import {ILot} from "./LotInterfaces.ts";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {SERVER_URL} from "../../constans.ts";
import {useState} from "react";
import SpinnerView from "../template/Spinner.tsx";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {getAuthConfig} from "../../utils/TokenUtils.ts";
import {sendErrorNotify, sendSuccessfulNotify} from "../../utils/NotifyUtils.ts";
import CustomChip from "../template/CustomChip.tsx";
import {IStatus} from "../../utils/IStatus.ts";

interface LotCardProps {
    is_owner?: boolean,
    lot: ILot,
    onDelete?: () => void,
}


export default function LotCardBody({lot, is_owner, onDelete}: LotCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const lotInfo: IStatus = getInfoStatusById(lot.status_id);

    function deleteLot() {

        setIsLoading(true)

        axios.delete(`${SERVER_URL}/delete/lot/${lot.id}`, getAuthConfig())
            .then(() => {
                sendSuccessfulNotify("Лот видалився успішно")
                if (onDelete) {
                    onDelete()
                }
            })
            .catch(error => sendErrorNotify(getErrorMessage(error)))
            .finally(() => setIsLoading(false))
    }

    function handleClick() {
        navigate(`/auction/lot/${lot.id}`)
    }

    if (isLoading) {
        return <SpinnerView/>
    }
    return (
        <div onClick={handleClick}
             className="flex flex-row justify-between rounded p-3 mt-3.5 hover:bg-gray-200 hover:cursor-pointer">
            <div className="w-1/2 font-sans text-large text-ellipsis overflow-hidden">{lot.name}</div>
            <CustomChip color={lotInfo?.color ?? "default"} text={lotInfo?.name}/>
            {is_owner &&
                <Dropdown>
                    <DropdownTrigger>
                        <Button size="md">
                            Дії
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="delete" className="text-danger" color="danger" onClick={deleteLot}>
                            Видалити лот
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            }
        </div>
    )
}