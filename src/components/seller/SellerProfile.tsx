import {useAuth} from "../../provider/AuthProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {MAIN_BOX_CONTAINER, SERVER_URL, SMALL_BOX_CARD, TEXT_STYLE} from "../../constans.ts";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import SpinnerView from "../template/Spinner.tsx";
import {ISellerProfile} from "./ISellerProfile.ts";
import {IAuction} from "../auction/IAuction.ts";
import {Card, CardHeader, Tab, Tabs} from "@nextui-org/react";
import {getImagePath} from "../../utils/ImageUtils.ts";
import ImageModal from "../template/ImageModal.tsx";
import SellerAllAuctions from "./SellerAllAuctions.tsx";
import SellerBanUsers from "./SellerBanUsers.tsx";

export default function SellerProfile() {
    const [isLoading, setIsLoading] = useState(true)
    const [seller, setSeller] = useState<ISellerProfile | null>(null)
    const [auctions, setAuctions] = useState<IAuction[] | null>(null)
    const [isOwner, setIsOwner] = useState(false)
    const [selected, setSelected] = useState("auctions");

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
                setIsOwner(user?.seller_id === sellerData.seller_id);
                if (user?.seller_id === sellerData.seller_id) {
                    setAuctions(auctionsData);
                } else {
                    setAuctions(auctionsData.filter((a: IAuction) => a.auction_status_id === 1));
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
            {isOwner && <div className="w-full sm:w-1/2">
                <Tabs
                    aria-label="Options"
                    className="my-1.5 flex justify-center items-center"
                    selectedKey={selected}
                    onSelectionChange={(key) => setSelected(key.toString())}
                >
                    <Tab key="auctions"
                         className=""
                         title={
                             <div className="flex items-center space-x-2 w-fit justify-center p-1.5">
                                 <img src="/auction-24.png" alt="аукціони" className="w-6 h-6"/>
                                 <span>Аукціони</span>
                             </div>
                         }
                    >
                        <SellerAllAuctions auctions={auctions}/>
                    </Tab>
                    <Tab key="auctions2"
                         title={
                             <div className="flex items-center space-x-2 w-fit justify-center p-1.5">
                                 <img src="/block.svg" alt="Увійти лого" className="w-6 h-6"/>
                                 <span>Заблоковані користувачі</span>
                             </div>
                         }
                    >
                        <SellerBanUsers seller_id={user?.seller_id}/>
                    </Tab>
                </Tabs>
            </div>}
            {!isOwner && <SellerAllAuctions auctions={auctions}/>}
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