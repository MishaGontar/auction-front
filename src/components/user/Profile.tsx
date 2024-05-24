import AuthPage from "../auth/AuthPage.tsx";
import {LARGE_BOX_CARD, MAIN_BOX_CONTAINER, SERVER_URL, SMALL_BOX_CARD, TEXT_STYLE} from "../../constans.ts";
import {Button, Card, CardBody, CardHeader} from "@nextui-org/react";
import {useAuth} from "../../provider/AuthProvider.tsx";
import {getImagePath} from "../../utils/ImageUtils.ts";
import {ChangeEvent, useEffect, useState} from "react";
import axios from "axios";
import {getAuthConfig, getAuthFormDataConfig, saveAuthToken} from "../../utils/TokenUtils.ts";
import UserBetCard from "./UserBetCard.tsx";
import {IUserBet} from "./IUserBet.ts";
import {sendErrorNotify, sendSuccessfulNotify} from "../../utils/NotifyUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import SpinnerView from "../template/Spinner.tsx";
import ButtonModalConfirmDelete from "../template/ButtonModalConfirmDelete.tsx";
import {useNavigate} from "react-router-dom";
import ImageModal from "../template/ImageModal.tsx";


export default function Profile() {
    const {user, login, logout} = useAuth()
    const navigator = useNavigate();

    const [bets, setBets] = useState<IUserBet[] | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [file, setFile] = useState<(File | null)>(null);

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${SERVER_URL}/user/bets`, getAuthConfig())
            .then(res => {
                const userBets = res.data.bets;
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
                sendSuccessfulNotify("Ваш аккаунт видалено")
            })
            .catch(e => sendErrorNotify(getErrorMessage(e)))
            .finally(() => setIsLoading(false));
    }

    function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    }

    function handleSavePhoto() {
        setIsLoading(true)
        if (!file) {
            sendErrorNotify("Вам треба вибрати зображення")
            return
        }
        const form = new FormData();
        form.append("image", file);
        axios.post(`${SERVER_URL}/user/photo`, form, getAuthFormDataConfig())
            .then((res) => {
                sendSuccessfulNotify("Зображення збережено")
                saveAuthToken(res.data.token)
                if (user) {
                    const u = user;
                    u.image_url = res.data.image_url
                    console.table(u)
                    login(u)
                }
                window.location.reload()
            })
            .catch(error => sendErrorNotify(getErrorMessage(error)))
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
                    {!bets && <p className="text-center">Ви ще не ставили жодних ставок</p>}
                    {bets && bets.length > 0 && bets.map(bet => <UserBetCard key={bet.date_created} bet={bet}/>)}
                </CardBody>
            </Card>
            <Card className={`${SMALL_BOX_CARD} order-first sm:order-last`}>
                <div className="flex flex-col items-center">
                    <CardHeader className="flex flex-col items-center">
                        <div className="flex justify-between">
                            {file && <>
                                <img src={URL.createObjectURL(file)} alt={`slide-${0}`}
                                     className="w-[100px] sm:w-[200px] md:w-[150px] h-auto rounded"/>
                                <div className="mx-1.5 flex justify-center items-center">
                                    <img src="/arrow-right.svg" alt="Arrow right"/>
                                </div>
                            </>}

                            <ImageModal img_path={getImagePath(user?.image_url)}>
                                <img src={getImagePath(user?.image_url)} alt={`slide-${0}`}
                                     className={`${file !== null ? "w-[100px]" : "w-[200px]"} sm:w-[200px] md:w-[150px] h-auto rounded`}/>
                            </ImageModal>
                        </div>
                        {file &&
                            <div className="my-5 space-x-5 w-full flex justify-center">
                                <Button color="success"
                                        variant="shadow"
                                        className="hover:cursor-pointer"
                                        onClick={handleSavePhoto}
                                >
                                    Зберегти
                                </Button>
                                <Button color="default"
                                        onClick={() => setFile(null)}
                                        variant="light"
                                        className=" hover:cursor-pointer">
                                    Очистити
                                </Button>
                            </div>
                        }
                        <label htmlFor="file-upload" className="my-1.5">
                            <h1 className="text-blue-500 hover:cursor-pointer">Змінити фото</h1>
                            <input
                                type="file"
                                accept="image/jpeg, image/png"
                                className="hidden"
                                onChange={handleFileChange}
                                id="file-upload"
                            />
                        </label>
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