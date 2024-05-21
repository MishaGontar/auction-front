import {Chip, Image} from "@nextui-org/react";
import {getImagePath} from "../../utils/ImageUtils.ts";
import {convertToOnlyData, getInfoStatusById} from "../../utils/CustomUtils.ts";
import {useNavigate} from "react-router-dom";
import {IAuction} from "./IAuction.ts";
import {IMAGE_SIZE_STYLE, TEXT_STYLE} from "../../constans.ts";

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
                    <Chip color={getInfoStatusById(auction.auction_status_id).color}
                          className="hover:cursor-default">
                        {auction.auction_status}
                    </Chip>
                </div>
                <div className={`${TEXT_STYLE} my-1.5`}>
                    Дата: {convertToOnlyData(auction.date_created)}
                </div>
            </div>
        </div>
    )
}