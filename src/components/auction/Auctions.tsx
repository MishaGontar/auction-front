import {Card, CardBody, CardFooter, Image} from "@nextui-org/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAuth} from "../../provider/AuthProvider.tsx";
import {IAuction} from "./IAuction.ts";
import {IMAGE_SIZE_STYLE, SERVER_URL} from "../../constans.ts";
import SpinnerView from "../template/Spinner.tsx";
import {useNavigate} from "react-router-dom";
import {getAuthConfig} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";
import {getImagePath} from "../../utils/ImageUtils.ts";

export default function Auctions() {
    const [auctions, setAuctions] = useState<IAuction[]>()
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate();
    const {user} = useAuth();

    useEffect(() => {
        document.title = 'Аукціони'
        setIsLoading(true)
        if (user) {
            axios.get(`${SERVER_URL}/auctions/all_auth`, getAuthConfig())
                .then(response => setAuctions(response.data.auctions))
                .catch(error => sendErrorNotify(getErrorMessage(error)))
                .finally(() => setIsLoading(false));
        } else {
            axios.get(`${SERVER_URL}/auctions/all`)
                .then(response => setAuctions(response.data.auctions))
                .catch(error => sendErrorNotify(getErrorMessage(error)))
                .finally(() => setIsLoading(false));
        }
    }, [user])

    if (isLoading) {
        return <SpinnerView/>
    }

    return (
        <div className="flex justify-center">
            <div className="m-7 gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {auctions?.length === 0 &&
                    <h1 className="flex justify-center">Немає доступних аукціонів</h1>
                }
                {auctions?.map((auction, index) => (
                    <Card shadow="sm"
                          className={"h-full"}
                          key={index}
                          isPressable
                          onPress={() => navigate(`/auction/${auction.auction_id}`)}>
                        <CardBody>
                            <div className="flex justify-center">
                                <Image
                                    shadow="sm"
                                    radius="lg"
                                    sizes="sm"
                                    alt={auction.auction_img_path}
                                    className={IMAGE_SIZE_STYLE}
                                    src={getImagePath(auction.auction_img_path)}
                                />
                            </div>
                        </CardBody>
                        <CardFooter className="text-small flex-col mt-0">
                            <b className="truncate w-3/4">{auction.auction_name}</b>
                            <p className="text-default-500">{auction.seller_name}</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}