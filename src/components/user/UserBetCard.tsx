import {Image} from "@nextui-org/react";
import {getImagePath} from "../../utils/ImageUtils.ts";
import {convertToKyivTime, formatNumberWithSpaces} from "../../utils/CustomUtils.ts";
import {IUserBet} from "./IUserBet.ts";
import {useNavigate} from "react-router-dom";
import {IMAGE_SIZE_STYLE, TEXT_STYLE} from "../../constans.ts";

interface UserBetCardProps {
    bet: IUserBet
}

const MAIN_BOX_CSS = "flex flex-col sm:flex-row justify-center " +
    "rounded-xl  p-2 py-4 my-1.5 " +
    "hover:cursor-pointer hover:bg-gray-100"

export default function UserBetCard({bet}: UserBetCardProps) {
    const navigate = useNavigate();

    function handleClickCard() {
        navigate(`/auction/lot/${bet.lot_id}`)
    }

    return (
        <div onClick={handleClickCard} className={MAIN_BOX_CSS}>
            <div className="lg:basis-1/4 flex flex-col justify-center items-center mx-3.5">
                <Image
                    className={IMAGE_SIZE_STYLE}
                    alt={"Lot photo"}
                    src={getImagePath(bet.images[0].image_url)}
                />
                <div className="text-sm">
                    Seller: {bet.seller_name}
                </div>
            </div>
            <div className="lg:basis-2/4 flex flex-col">
                <div className="my-1.5 text-xl">
                    {bet.is_winner && <strong className="text-green-500 font-black">You win : </strong>}
                    {bet.lot_name}
                </div>
                <div className="my-1.5">
                    <strong>Your bet is : </strong> {formatNumberWithSpaces(bet.amount.toString())} UAH
                </div>
                <div className={`${TEXT_STYLE} my-1.5`}>
                    Date: {convertToKyivTime(bet.date_created)}
                </div>
            </div>
        </div>
    )
}