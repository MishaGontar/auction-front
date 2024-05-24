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
import ImageModal from "../template/ImageModal.tsx";

export default function SellerProfile() {
    const [isLoading, setIsLoading] = useState(true)
    const [seller, setSeller] = useState<ISellerProfile | null>(null)
    const [auctions, setAuctions] = useState<IAuction[] | null>(null)
    const {user} = useAuth()
    const {id} = useParams()
    const navigator = useNavigate()

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${SERVER_URL}/seller/info/${id}`)
            .then(res => {
                const sellerData = res.data.seller;
                const auctionsData = res.data.auctions;

                setSeller(sellerData);

                if (user?.seller_id === sellerData.seller_id) {
                    setAuctions(auctionsData);
                } else {
                    setAuctions(auctionsData.filter((a:IAuction) => a.auction_status_id === 1));
                }
            })
            .catch(error => {
                sendErrorNotify(getErrorMessage(error));
                if (error.response && error.response.status === 404) {
                    navigator('/auctions');
                }
            })
            .finally(() => setIsLoading(false));
    }, [id, user, navigator]);


    if (isLoading) {
        return <SpinnerView/>
    }
    return (
        <div className={MAIN_BOX_CONTAINER}>
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
            <Card className={`${SMALL_BOX_CARD} order-first sm:order-last`}>
                <div className="flex flex-col items-center">
                    <CardHeader className="flex flex-col items-center">
                        <ImageModal img_path={getImagePath(seller?.image_url)}>
                            <img src={getImagePath(seller?.image_url)} alt={"Avatar"}
                                 className="w-[150px] h-auto rounded"/>
                        </ImageModal>
                    </CardHeader>
                    <div className="mx-1.5">
                        <h1 className={TEXT_STYLE}><strong>Продавець : </strong> {seller?.full_name}</h1>
                        <p className={TEXT_STYLE}><strong>Опис: </strong> {seller?.description}</p>
                        <p className={TEXT_STYLE}><strong>Соціальні мережі: </strong> {seller?.social_media}</p>
                        {seller?.address &&
                            <p className={TEXT_STYLE}><strong>Адреса: </strong> {seller.address}</p>}
                    </div>
                </div>
            </Card>
        </div>
    )
}