import {IAuction} from "../auction/IAuction.ts";
import {LARGE_BOX_CARD} from "../../constans.ts";
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import AuctionCard from "../auction/AuctionCard.tsx";
import {useNavigate} from "react-router-dom";

export default function SellerAllAuctions({auctions}: { auctions: IAuction[] | null }) {
    const navigator = useNavigate()
    return (
        <Card className={`${LARGE_BOX_CARD}`}>
            <CardHeader className="pb-0 pt-2 px-4 flex justify-center py-5">
                <p className="text-3xl font-bold">Всі аукціони</p>
            </CardHeader>
            <CardBody>
                {auctions && auctions.length === 0 &&
                    <p className="text-center">Ви ще не
                        <strong className="text-blue-500 cursor-pointer"
                                onClick={() => navigator('/create/auction')}> створили </strong>
                        жодного аукціону
                    </p>
                }
                {auctions && auctions.length > 0 &&
                    auctions.map(auction => <AuctionCard key={auction.auction_id} auction={auction}/>)}
            </CardBody>
        </Card>
    )
}