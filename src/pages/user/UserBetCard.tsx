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
                    loading="lazy"
                    className={IMAGE_SIZE_STYLE}
                    alt="Лот фото"
                    src={getImagePath(bet.images[0].image_url)}
                />
                <div className="text-sm">
                    Продавець: {bet.seller_name}
                </div>
            </div>
            <div className="lg:basis-2/4 flex flex-col">
                <div className="my-1.5 text-xl">
                    {bet.is_winner && <strong className="text-green-500 font-black">Ти виграв : </strong>}
                    {bet.lot_name}
                </div>
                <div className="my-1.5">
                    <strong>Сума: </strong> {formatNumberWithSpaces(bet.amount.toString())} грн
                </div>
                <div className={`${TEXT_STYLE} my-1.5`}>
                    Дата ставки: {convertToKyivTime(bet.date_created)}
                </div>
            </div>
        </div>
    )
}