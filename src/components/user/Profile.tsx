import AuthPage from "../auth/AuthPage.tsx";
import {LARGE_BOX_CARD, MAIN_BOX_CONTAINER, SERVER_URL, SMALL_BOX_CARD, TEXT_STYLE} from "../../constans.ts";
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import {useAuth} from "../../provider/AuthProvider.tsx";
import {getImagePath} from "../../utils/ImageUtils.ts";
import {useEffect, useState} from "react";
import axios from "axios";
import {getAuthConfig} from "../../utils/TokenUtils.ts";
import UserBetCard from "./UserBetCard.tsx";
import {IUserBet} from "./IUserBet.ts";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import SpinnerView from "../template/Spinner.tsx";
import ButtonModalConfirmDelete from "../template/ButtonModalConfirmDelete.tsx";
import {useNavigate} from "react-router-dom";


export default function Profile() {
    const {user, logout} = useAuth()
    const navigator = useNavigate();

    const [bets, setBets] = useState<IUserBet[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${SERVER_URL}/user/bets`, getAuthConfig())
            .then(res => {
                const userBets = res.data;
                let sortedBets;
                if (userBets && userBets.length > 1) {
                    sortedBets = userBets.sort((a: IUserBet, b: IUserBet) => {
                        return new Date(b.date_created).getTime() - new Date(a.date_created).getTime();
                    });
                }
                setBets(sortedBets || userBets)
            })
            .catch(error => sendErrorNotify(getErrorMessage(error)))
            .finally(() => setIsLoading(false));
    }, [user]);

    function handleConfirmDelete() {
        setIsLoading(true)
        axios.delete(`${SERVER_URL}/user/delete`, getAuthConfig())
            .then(() => {
                logout()
                navigator('/auction')
                window.location.reload()
            })
            .catch(e => sendErrorNotify(getErrorMessage(e)))
            .finally(() => setIsLoading(false));
    }

    if (isLoading) {
        return <SpinnerView/>
    }
    return (<AuthPage>
        <div className={MAIN_BOX_CONTAINER}>
            <Card className={`${LARGE_BOX_CARD}`}>
                <CardHeader className="pb-0 pt-2 px-4 flex justify-center py-5">
                    <p className="text-3xl font-bold">Всі ваші ставки</p>
                </CardHeader>
                <CardBody>
                    {bets && bets.length > 0 && bets.map(bet => <UserBetCard key={bet.date_created} bet={bet}/>)}
                </CardBody>
            </Card>
            <Card className={`${SMALL_BOX_CARD} order-first sm:order-last`}>
                <div className="flex flex-col items-center">
                    <CardHeader className="flex flex-col items-center">
                        <img src={getImagePath(user?.image_url)} alt={`slide-${0}`}
                             className="w-[150px] h-auto"/>
                        <h1 className="text-blue-500 hover:cursor-pointer"
                            onClick={() => console.log("Change photo")}>Змінити фото</h1>
                    </CardHeader>
                    <div>
                        <h1 className={TEXT_STYLE}><strong>Ім'я користувача: </strong> {user?.username}</h1>
                        <p className={TEXT_STYLE}><strong>Електрона адреса: </strong> {user?.email}</p>
                        <ButtonModalConfirmDelete object={"аккаунт"} onAccept={handleConfirmDelete}/>
                    </div>
                </div>
            </Card>
        </div>
    </AuthPage>)
}