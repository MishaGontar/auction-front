import {useAuth} from "../../provider/AuthProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {LARGE_BOX_CARD, MAIN_BOX_CONTAINER, SERVER_URL, SMALL_BOX_CARD, TEXT_STYLE} from "../../constans.ts";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import SpinnerView from "../template/Spinner.tsx";
import {ISellerProfile} from "./ISellerProfile.ts";
import {IAuction} from "../auction/IAuction.ts";
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import AuctionCard from "../auction/AuctionCard.tsx";
import {getImagePath} from "../../utils/ImageUtils.ts";

export default function SellerProfile() {
    const [isLoading, setIsLoading] = useState(true)
    const [seller, setSeller] = useState<ISellerProfile | null>(null)
    const [auctions, setAuctions] = useState<IAuction[] | null>(null)
    const [isOwner, setIsOwner] = useState(false)
    const {user} = useAuth()
    const {id} = useParams()
    const navigator = useNavigate()

    useEffect(() => {
        const is_owner = user?.seller_id === seller?.seller_id
        setIsOwner(is_owner)
        if (!is_owner && auctions) {
            setAuctions(auctions.filter(a => a.auction_status_id === 1))
        }
    }, [auctions, seller, user?.seller_id]);


    useEffect(() => {
        setIsLoading(true)
        axios.get(`${SERVER_URL}/seller/info/${id}`)
            .then(res => {
                setAuctions(res.data.auctions)
                setSeller(res.data.seller)

            })
            .catch(error => {
                sendErrorNotify(getErrorMessage(error))
                if (error.response.status === 404) {
                    navigator('/auctions')
                }
            })
            .finally(() => setIsLoading(false));
    }, [id, user]);

    if (isLoading) {
        return <SpinnerView/>
    }
    return (
        <div className={MAIN_BOX_CONTAINER}>
            <Card className={`${LARGE_BOX_CARD}`}>
                <CardHeader className="pb-0 pt-2 px-4 flex justify-center py-5">
                    <p className="text-3xl font-bold">All auctions</p>
                </CardHeader>
                <CardBody>
                    {auctions && auctions.length > 0 &&
                        auctions.map(auction => <AuctionCard key={auction.auction_id} auction={auction}/>)}
                </CardBody>
            </Card>
            <Card className={`${SMALL_BOX_CARD} order-first sm:order-last`}>
                <div className="flex flex-col items-center">
                    <CardHeader className="flex flex-col items-center">
                        <img src={getImagePath(seller?.image_url)} alt={"Avatar"}
                             className="w-[150px] h-auto"/>
                        {isOwner && <h1 className="text-blue-500 hover:cursor-pointer"
                                        onClick={() => console.log("Change photo")}>Change photo</h1>}
                    </CardHeader>
                    <div className="mx-1.5">
                        <h1 className={TEXT_STYLE}><strong>Seller name : </strong> {seller?.full_name}</h1>
                        <p className={TEXT_STYLE}><strong>Description: </strong> {seller?.description}</p>
                        <p className={TEXT_STYLE}><strong>Social media: </strong> {seller?.social_media}</p>
                        {seller?.address &&
                            <p className={TEXT_STYLE}><strong>Address: </strong> {seller.address}</p>}
                        {seller?.phone_number &&
                            <p className={TEXT_STYLE}><strong>Phone number: </strong> {seller.phone_number}</p>}
                    </div>
                </div>
            </Card>
        </div>
    )
}