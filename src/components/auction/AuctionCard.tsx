import {Image} from "@nextui-org/react";
import {getImagePath} from "../../utils/ImageUtils.ts";
import {convertToKyivTime, convertToOnlyData, getInfoStatusById} from "../../utils/CustomUtils.ts";
import {useNavigate} from "react-router-dom";
import {IAuction} from "./IAuction.ts";
import {IMAGE_SIZE_STYLE, TEXT_STYLE} from "../../constans.ts";
import CustomChip from "../template/CustomChip.tsx";

interface AuctionCardProps {
    auction: IAuction
}

const MAIN_BOX_CSS = "flex flex-col sm:flex-row justify-center " +
    "rounded-xl  p-2 py-4 my-3 " +
    "hover:cursor-pointer hover:bg-gray-100"

export default function AuctionCard({auction}: AuctionCardProps) {
    const navigate = useNavigate();

    function handleClickCard() {
        navigate(`/auction/${auction.auction_id}`)
    }

    return (
        <div onClick={handleClickCard} className={MAIN_BOX_CSS}>
            <div className="lg:basis-1/4 flex flex-col justify-center items-center mx-3.5">
                <Image
                    loading="lazy"
                    className={IMAGE_SIZE_STYLE}
                    alt="Фото аукціону"
                    src={getImagePath(auction.auction_img_path)}
                />
            </div>
            <div className="lg:basis-2/4 flex flex-col">
                <div className="my-1.5 text-xl font-bold">
                    {auction.auction_name}
                </div>
                <div className="my-1.5">
                    <CustomChip color={getInfoStatusById(auction.auction_status_id).color}
                                text={auction.auction_status}/>
                </div>
                <div className={`${TEXT_STYLE} my-1.5`}>
                    Дата створення: {convertToOnlyData(auction.date_created)}
                </div>
                {auction.date_finished &&
                    <div className={`${TEXT_STYLE} my-1.5`}>
                        Дата завершення: {convertToKyivTime(auction.date_finished)}
                    </div>
                }
            </div>
        </div>
    )
}