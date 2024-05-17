import {Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {getInfoStatusById} from "../../utils/CustomUtils.ts";
import {ILot} from "./LotInterfaces.ts";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {SERVER_URL} from "../../constans.ts";
import {useState} from "react";
import SpinnerView from "../template/Spinner.tsx";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {getAuthConfig} from "../../utils/TokenUtils.ts";
import {sendErrorNotify, sendInfoNotify} from "../../utils/NotifyUtils.ts";

interface LotCardProps {
    is_owner?: boolean,
    lot: ILot,
    onClick?: () => void,
    onDelete?: () => void,
}


export default function LotCardBody({lot, is_owner, onDelete}: LotCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const lotInfo = lot.id != null ? getInfoStatusById(lot.status_id) : {name: "default", color: "default"};

    function deleteLot() {

        setIsLoading(true)

        axios.delete(`${SERVER_URL}/delete/lot/${lot.id}`, getAuthConfig())
            .then(() => {
                sendInfoNotify("Lot delete successful")
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
            <Chip color={lotInfo?.color ?? "default"} className="w-1/2 mx-3.5">{lotInfo?.name}</Chip>
            {is_owner &&
                <Dropdown>
                    <DropdownTrigger>
                        <Button size="md">
                            Actions
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                        <DropdownItem key="delete" className="text-danger" color="danger" onClick={deleteLot}>
                            Delete lot
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            }
        </div>
    )
}