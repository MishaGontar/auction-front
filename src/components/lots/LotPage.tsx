import {useAuth} from "../../provider/AuthProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {ChangeEvent, useEffect, useState} from "react";
import {ILotData, ILotPageResponse} from "./LotInterfaces.ts";
import axios from "axios";
import {LARGE_BOX_CARD, MAIN_BOX_CONTAINER, SERVER_URL, SMALL_BOX_CARD} from "../../constans.ts";
import {convertFormattedAmountToNumber, formatNumberWithSpaces, getInfoStatusById} from "../../utils/CustomUtils.ts";
import SpinnerView from "../template/Spinner.tsx";

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import {Button, Card, CardBody, CardHeader, Chip, Input, Link} from "@nextui-org/react";
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


const boxStyle = "m-2.5 p-2.5 bg-gray-100 rounded";

export default function LotPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [lot, setLot] = useState<ILotData | null>(null);
    const [bets, setBets] = useState<IBet[]>([])
    const [socket, setSocket] = useState<Socket>()
    const [userAmount, setUserAmount] = useState({
        amount: '',
        isMoreThanBet: false
    })
    const [isEdit, setIsEdit] = useState<boolean>(false)

    const {user} = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        document.title = 'Lot Info';
        getLot();
    }, [user]);


    useEffect(() => {
        if (user) {
            const newSocket = io(SERVER_URL, {
                auth: {
                    token: getAuthToken()
                },
                query: {
                    user: JSON.stringify(user),
                    is_owner: lot?.is_owner,
                    lotId: id
                }
            });

            newSocket.on('updatedBet', handleUpdatedBet);
            newSocket.on('finishedLot', getLot)
            setSocket(newSocket);
        }
        return () => {
            if (socket) {
                socket.disconnect(); // Роз'єднати сокет під час видалення компонента
            }
        };
    }, [lot]);

    const handleUpdatedBet = (json: string) => {
        const res = JSON.parse(json);
        console.log(res)
        const newBets: IBet[] = res.bets;
        const winner: IWinner = res.winner;
        if (winner !== undefined && winner !== null && lot) {
            console.warn("Update Lot")
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
    };

    const handleUpdate = () => {
        if (socket) {
            const sendAmount =
                (userAmount.amount
                    ? convertFormattedAmountToNumber(userAmount.amount)
                    : lot?.lot.lot_amount)
                || 0
            console.log(sendAmount)
            if (!lot?.is_owner && !userAmount.isMoreThanBet && bets.length > 0) {
                return
            }
            socket.emit('updatedBet', sendAmount);
        }
    };

    function handleAmountInput(event: ChangeEvent<HTMLInputElement>) {
        const newAmount = event.target.value.replace(/\D/g, '');
        setUserAmount({
            amount: formatNumberWithSpaces(newAmount),
            isMoreThanBet: bets.length > 0 && (+newAmount > bets[0].amount)
        });
    }

    function getLot() {
        setIsLoading(true);
        axios.get(`${SERVER_URL}/auction/lot/${id}`, getAuthConfig())
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
                    status: getInfoStatusById(lot.lot_status_id)
                })
                const initAmount = bets.length > 0 ? bets[0].amount : lot.lot_amount;
                console.log(bets.length > 0 && (initAmount > bets[0].amount))
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
        axios.delete(`${SERVER_URL}/delete/lot/${lot?.lot.lot_id}/bet/${bet_id}`, getAuthConfig())
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
                        <CardHeader>
                            <ImagesSlider images={lot.images}/>
                        </CardHeader>
                        <CardBody className="pt-8">
                            <div className="flex justify-between">
                                <small className="text-default-500 hover:cursor-pointer"
                                       onClick={() => navigate(`/seller/${id}`)}>
                                    Seller: {lot.lot.seller_full_name}
                                </small>
                                <Chip color={lot.status.color} className="hover:cursor-default">
                                    {lot.status.name}
                                </Chip>
                            </div>
                        </CardBody>
                    </Card>
                    <Card className={LARGE_BOX_CARD}>
                        <Link className="text-sm mx-3.5 flex justify-end hover:cursor-pointer"
                              onClick={() => navigate(`/auction/${lot.lot.auction_id}`)}>
                            Back to auction
                        </Link>
                        <CardHeader className="pb-0 pt-2 px-4 flex justify-center">
                            <p className="text-2xl font-bold">{lot.lot.lot_name}</p>
                        </CardHeader>
                        <CardBody className="flex flex-col">
                            <div className={boxStyle}>
                                <p className="font-sans">
                                    <strong>About: </strong>{lot.lot.lot_description}
                                </p>
                            </div>
                            <div className={boxStyle}>
                                <p className="font-sans">
                                    ({bets && bets.length} bets)
                                    <strong>{lot.winner ? " Finish amount is " : " Current amount: "}  </strong>
                                    {formatNumberWithSpaces((bets.length > 0 ? bets[0].amount : lot?.lot.lot_amount).toString())} UAH
                                </p>
                            </div>

                            {lot.winner && user?.user_id === lot.winner?.user_id && (
                                <Congratulation lot={lot.lot}/>
                            )}
                            {!lot.winner && (<>
                                <div className="flex justify-center">
                                    {!user && (
                                        <Button className="mx-3.5 w-3/5"
                                                variant="bordered"
                                                onClick={() => navigate('/login')}
                                                color="secondary">
                                            Login to start bet
                                        </Button>
                                    )}
                                    {user && <>

                                        {bets.length === 0 && !lot.is_owner &&
                                            <Button color="warning" onClick={handleUpdate}>
                                                Bet {lot.lot.lot_amount} UAH
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
                                                Bet
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
                                            <Button color="warning" onClick={handleUpdate}>Set</Button>
                                        </>
                                        }
                                    </>
                                    }
                                </div>
                                {lot.is_owner && (
                                    <div className="flex justify-center my-5">
                                        <Button onClick={() => setIsEdit(true)}
                                                variant="light" color="success" className="sm:w-1/3 w-full mx-3.5">
                                            Edit lot
                                        </Button>
                                        <Button onClick={submitFinishLot}
                                                variant="light" color="danger" className="sm:w-1/3 w-full mx-3.5">
                                            Finished lot
                                        </Button>
                                    </div>
                                )}
                            </>)
                            }
                            <TableBets bets={bets} is_owner={lot.is_owner} onDelete={handleDeleteBet}/>
                        </CardBody>
                    </Card>
                </div>
            </>)}
        </>
    );
}