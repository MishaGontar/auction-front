import {useAuth} from "../../provider/AuthProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ILotData, ILotPageResponse} from "./LotInterfaces.ts";
import axios from "axios";
import {LARGE_BOX_CARD, MAIN_BOX_CONTAINER, SERVER_URL, SMALL_BOX_CARD, TEXT_STYLE} from "../../constans.ts";
import {
    convertFormattedAmountToNumber,
    convertToKyivTime,
    formatNumberWithSpaces,
    getInfoStatusById
} from "../../utils/CustomUtils.ts";
import SpinnerView from "../template/Spinner.tsx";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import {Button, Card, CardBody, CardHeader, Input, Link} from "@nextui-org/react";
import "dayjs/plugin/timezone";
import {IBet} from "./IBet.ts";
import io, {Socket} from "socket.io-client";
import ModalLotForm from "./ModalLotForm.tsx";
import {getAuthConfig, getAuthToken} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";
import Congratulation from "./Congratulation.tsx";
import ImagesSlider from "../template/ImagesSlider.tsx";
import TableBets from "./TableBets.tsx";
import {IWinner} from "./IWinner.ts";
import CustomChip from "../template/CustomChip.tsx";
import SmallAvatar from "../template/SmallAvatar.tsx";
import {usePage} from "../page/PageContext.tsx";
import useTitle from "../../hooks/TitleHook.tsx";

const boxStyle = "m-2.5 p-2.5 bg-gray-100 rounded";

export default function LotPage() {
    useTitle('Лот')

    const [lot, setLot] = useState<ILotData | null>(null);
    const [bets, setBets] = useState<IBet[]>([])
    const [socket, setSocket] = useState<Socket>()
    const [userAmount, setUserAmount] = useState({
        amount: '',
        isMoreThanBet: false
    })
    const [isEdit, setIsEdit] = useState<boolean>(false)

    const {isLoading, setIsLoading} = usePage();
    const {user} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => getLot(), [user]);

    useEffect(() => {
        if (lot?.status.id === 3 && !lot.is_owner) {
            sendErrorNotify("Не знайшли лот")
            navigate(`/auction/${lot?.lot.auction_id}`);
            return
        }
        if (user && !lot?.is_blocked) {
            const newSocket = io(SERVER_URL, {
                auth: {
                    token: getAuthToken()
                },
                query: {
                    user: JSON.stringify(user),
                    is_owner: lot?.is_owner,
                    lotId: id,
                    sellerId: lot?.lot.seller_id
                }
            });

            newSocket.on('updatedBet', handleUpdatedBet);
            newSocket.on('blockUser', getLot);
            newSocket.on('finishedLot', getLot)
            setSocket(newSocket);
        }
        return () => {
            if (socket) {
                socket.disconnect(); // Роз'єднати сокет під час видалення компонента
            }
        };
    }, [lot]);

    function handleUpdatedBet(json: string) {
        const res = JSON.parse(json);
        const newBets: IBet[] = res.bets;
        const winner: IWinner = res.winner;
        if (winner !== undefined && winner !== null && lot) {
            const updatedLot: ILotData = {
                ...lot,
                winner: winner
            };
            setLot(updatedLot)
        }
        const initAmount = (newBets.length > 0 ? newBets[0].amount : lot?.lot.lot_amount) || 0;
        setUserAmount({
            amount: formatNumberWithSpaces(initAmount.toString()),
            isMoreThanBet: false
        });
        setBets(newBets);
    }

    function handleUpdate() {
        if (socket) {
            const sendAmount =
                (userAmount.amount
                    ? convertFormattedAmountToNumber(userAmount.amount)
                    : lot?.lot.lot_amount)
                || 0
            if (!lot?.is_owner && !userAmount.isMoreThanBet && bets.length > 0 && lot?.is_blocked) {
                return
            }
            socket.emit('updatedBet', sendAmount);
        }
    }

    function handleAmountInput(e: any) {
        const newAmount = e.target.value.replace(/\D/g, '');
        setUserAmount({
            amount: formatNumberWithSpaces(newAmount),
            isMoreThanBet: bets.length > 0 && (+newAmount > bets[0].amount)
        });
    }

    function getLot() {
        setIsLoading(true);
        axios.get(`/auction/lot/${id}`, getAuthConfig())
            .then((response) => {
                const lot: ILotPageResponse = response.data.lot;
                const is_owner = lot.seller_id === user?.seller_id;
                const bets = response.data.bets;
                setBets(bets)
                setLot({
                    winner: response.data.winner,
                    lot: lot,
                    images: response.data.images,
                    is_owner: is_owner,
                    status: getInfoStatusById(lot.lot_status_id),
                    is_blocked: response.data.is_blocked
                })
                const initAmount = bets.length > 0 ? bets[0].amount : lot.lot_amount;
                setUserAmount({
                    amount: formatNumberWithSpaces(initAmount.toString()),
                    isMoreThanBet: bets.length > 0 && (initAmount > bets[0].amount)
                });
            })
            .catch(error => {
                sendErrorNotify(getErrorMessage(error));
                if (error.response && error.response.status === 403) {
                    navigate('/auctions');
                }
            })
            .finally(() => setIsLoading(false));
    }

    function handleDeleteBet(bet_id: number) {
        setIsLoading(true)
        axios.delete(`/delete/lot/${lot?.lot.lot_id}/bet/${bet_id}`, getAuthConfig())
            .then(() => {
                if (socket) {
                    socket.emit('updatedBets', lot?.lot.lot_id);
                }
            })
            .catch(error => sendErrorNotify(getErrorMessage(error)))
            .finally(() => setIsLoading(false))
    }

    function submitFinishLot() {
        if (!socket) {
            return
        }
        socket.emit("finishedLot")
    }

    function handleBlockUserById(id: number) {
        if (!socket) {
            return
        }
        socket.emit('blockUser', id)
    }

    function onSubmitLotEdit() {
        getLot()
        setIsEdit(false)
    }

    if (isLoading) {
        return <SpinnerView/>;
    }
    return (
        <>
            {lot?.lot && bets && (<>
                {isEdit && <ModalLotForm
                    isOpen={isEdit}
                    auction={null}
                    lot={lot}
                    onSubmit={onSubmitLotEdit}
                    closeModal={() => setIsEdit(false)}/>
                }
                <div className={MAIN_BOX_CONTAINER}>
                    <Card className={SMALL_BOX_CARD}>
                        <CardHeader className="flex justify-center items-center mb-10">
                            <ImagesSlider images={lot.images}/>
                        </CardHeader>
                        <CardBody className="pt-8">
                            <div className="flex justify-between">
                                <div>
                                    <Link className="hover:cursor-pointer"
                                          size="sm"
                                          showAnchorIcon
                                          onClick={() => navigate(`/seller/${lot.lot.seller_id}`)}>
                                        <SmallAvatar path={lot.lot.seller_img_path}/>
                                        {lot.lot.seller_full_name}
                                    </Link>
                                </div>
                                <CustomChip color={lot.status.color} text={lot.status.name}/>
                            </div>
                            {lot.lot.lot_date_finished &&
                                <div className={`flex justify-center text-small ${TEXT_STYLE}`}>
                                    <p>Завершено: {convertToKyivTime(lot.lot.lot_date_finished)}</p>
                                </div>
                            }
                        </CardBody>
                    </Card>
                    <Card className={LARGE_BOX_CARD}>
                        <Link className="text-sm mx-3.5 flex justify-end hover:cursor-pointer"
                              onClick={() => navigate(`/auction/${lot.lot.auction_id}`)}>
                            Повернутися до аукціону
                        </Link>
                        <CardHeader className="pb-0 pt-2 px-4 flex justify-center">
                            <p className="text-2xl font-bold">{lot.lot.lot_name}</p>
                        </CardHeader>
                        <CardBody className="flex flex-col">
                            <div className={boxStyle}>
                                <p className="font-sans">
                                    <strong>Опис: </strong>{lot.lot.lot_description}
                                </p>
                            </div>
                            <div className={boxStyle}>
                                <p className="font-sans">
                                    <sup>(всього ставок: {bets && bets.length})</sup>
                                    <strong> {lot.winner ? "Кінцева сума " : "Поточна сума: "}  </strong>
                                    {formatNumberWithSpaces((bets.length > 0 ? bets[0].amount : lot?.lot.lot_amount).toString())} грн
                                </p>
                            </div>

                            {lot.winner && user?.user_id === lot.winner?.user_id && (
                                <Congratulation lot={lot.lot}/>
                            )}
                            {!lot.winner && lot?.is_blocked && (
                                <div className="flex justify-center">
                                    <div className="text-red-500 border-1 border-red-500 p-2 rounded font-bold w-fit">
                                        Вас було заблоковано продавцем
                                    </div>
                                </div>
                            )
                            }
                            {!lot.winner && !lot?.is_blocked && (<>
                                <div className="flex justify-center">
                                    {!user && (
                                        <Button className="mx-3.5 w-3/5"
                                                variant="bordered"
                                                onClick={() => navigate('/login')}
                                                color="secondary">
                                            Увійти, щоб поставити ставку
                                        </Button>
                                    )}
                                    {user && <>

                                        {bets.length === 0 && !lot.is_owner &&
                                            <Button color="warning" onClick={handleUpdate}>
                                                Поставити {lot.lot.lot_amount} UAH
                                            </Button>
                                        }

                                        {bets.length > 0 && !lot.is_owner && <>
                                            <Input
                                                type="text"
                                                color="success"
                                                onChange={handleAmountInput}
                                                value={String(userAmount.amount)}
                                                className="w-1/4 mx-3.5"
                                            />
                                            <Button color="success" isDisabled={!userAmount.isMoreThanBet}
                                                    onClick={handleUpdate}>
                                                Поставити
                                            </Button>
                                        </>
                                        }

                                        {lot.is_owner && <>
                                            <Input
                                                type="text"
                                                color="warning"
                                                onChange={handleAmountInput}
                                                value={String(userAmount.amount)}
                                                className="w-1/4 mx-3.5"
                                            />
                                            <Button color="warning" onClick={handleUpdate}>Поставити</Button>
                                        </>
                                        }
                                    </>
                                    }
                                </div>
                                {lot.is_owner && (
                                    <div className="flex justify-center my-5">
                                        <Button onClick={() => setIsEdit(true)}
                                                variant="light" color="success" className="sm:w-1/3 w-full mx-3.5">
                                            Редагувати лот
                                        </Button>
                                        {bets.length > 0 &&
                                            <Button onClick={submitFinishLot}
                                                    variant="light" color="danger"
                                                    className="sm:w-1/3 w-full mx-3.5">
                                                Завершити лот
                                            </Button>}
                                    </div>
                                )}
                            </>)
                            }
                            {bets.length === 0 && <p className="text-center my-10">Поки немає ставок</p>}
                            {bets.length > 0 &&
                                <TableBets
                                    bets={bets}
                                    is_owner={lot.is_owner}
                                    onDelete={handleDeleteBet}
                                    onBlockUser={handleBlockUserById}
                                />}
                        </CardBody>
                    </Card>
                </div>
            </>)}
        </>
    );
}