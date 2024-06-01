import {useAuth} from "../../provider/AuthProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {ChangeEvent, useEffect, useState} from "react";
import axios from "axios";
import {IMAGE_SIZE_STYLE, MAIN_BOX_CONTAINER, SERVER_URL, SMALL_BOX_CARD, TEXT_STYLE} from "../../constans.ts";
import {capitalizeFirstLetter, ColorType, convertToKyivTime, getInfoStatusById,} from "../../utils/CustomUtils.ts";
import SpinnerView from "../template/Spinner.tsx";
import {IAuction} from "./IAuction.ts";
import {Button, Card, CardBody, CardHeader, Image, Input, Link, Select, SelectItem, Textarea} from "@nextui-org/react";
import LotCardBody from "../lots/LotCardBody.tsx";
import ModalLotForm from "../lots/ModalLotForm.tsx";
import {ILot} from "../lots/LotInterfaces.ts";
import {PlusLogo} from "../../icons/PlusLogo.tsx";
import ButtonModalConfirmDelete from "../template/ButtonModalConfirmDelete.tsx";
import {IStatus} from "../../utils/IStatus.ts";
import {getAuthConfig, getAuthFormDataConfig} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {sendErrorNotify, sendInfoNotify, sendSuccessfulNotify} from "../../utils/NotifyUtils.ts";
import {checkImageFile, getImagePath} from "../../utils/ImageUtils.ts";
import CustomChip from "../template/CustomChip.tsx";
import SmallAvatar from "../template/SmallAvatar.tsx";
import ImageModal from "../template/ImageModal.tsx";

export default function AuctionPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [auction, setAuction] = useState<IAuction | null>()
    const [lots, setLots] = useState<ILot[] | null>()
    const [color, setColor] = useState<ColorType>("default")
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const {user} = useAuth()
    const {id} = useParams();

    const [newAuction, setNewAuction] = useState<IAuction | null>()
    const [selectedNewImage, setSelectedNewImage] = useState<File | null>(null);
    const [statuses, setStatuses] = useState<IStatus[]>([])
    const [isEditMode, setIsEditMode] = useState(false)

    useEffect(() => {
        document.title = 'Інформація про аукціон'
        getInfoAuction()
    }, [user]);

    useEffect(() => {
        setNewAuction(auction)
        const status_id = auction?.auction_status_id;
        if (status_id === 3 && user?.seller_id !== auction?.seller_id) {
            navigate('/auctions')
        }

        if (status_id) {
            setColor(getInfoStatusById(status_id).color)
        }
        getAllLots();
    }, [auction]);


    function getInfoAuction() {
        setIsLoading(true)
        axios.get(`${SERVER_URL}/auction/info/${id}`, getAuthConfig())
            .then((response) => {
                const auction_data = response.data.auction
                setAuction({
                    ...auction_data,
                    is_owner: auction_data.seller_id === user?.seller_id,
                })
            })
            .catch(error => {
                if (error.response.status === 403) {
                    sendErrorNotify(getErrorMessage(error))
                    navigate('/auctions')
                    return
                }
                sendErrorNotify(getErrorMessage(error))
            })
            .finally(() => setIsLoading(false))
    }

    function getAllLots() {
        setIsLoading(true)
        axios.get(`${SERVER_URL}/auction/${id}/lots`, getAuthConfig())
            .then((response) => {
                if (auction?.is_owner) {
                    setLots(response.data.lots)
                } else {
                    setLots(response.data.lots.filter((l: ILot) => l.status_id !== 3 && l.status_id !== 2))
                }
            })
            .catch(error => {
                if (error.response.status === 403) {
                    sendErrorNotify(getErrorMessage(error))
                    navigate('/auctions')
                    return
                }
                sendErrorNotify(getErrorMessage(error))
            })
            .finally(() => setIsLoading(false))
    }

    function onCloseModal() {
        setShowModal(false);
    }

    function onCreated() {
        sendSuccessfulNotify("Лот створився успішно");
        onCloseModal();
        getAllLots();
    }

    function handleEditAuction() {
        setIsEditMode(true)
        if (statuses.length === 0) {
            getStatuses()
        }
    }

    function handleSaveAuction() {
        if (!newAuction || (auction === newAuction && !selectedNewImage)) {
            sendInfoNotify("Нічого не змінилось")
            handleCancelAuction()
            return;
        }

        const form = new FormData();
        if (selectedNewImage) {
            form.append('image', selectedNewImage);
        }

        form.append('auction_id', String(newAuction.auction_id));
        form.append('auction_name', newAuction.auction_name);
        form.append('auction_description', newAuction.auction_description);
        form.append('auction_status_id', String(newAuction.auction_status_id));
        form.append('auction_img_path', newAuction.auction_img_path)
        form.append('seller_id', String(newAuction.seller_id))

        setIsLoading(true)
        axios
            .post(`${SERVER_URL}/update/auction`, form, getAuthFormDataConfig())
            .then(() => getInfoAuction())
            .catch(error => sendErrorNotify(getErrorMessage(error)))
            .finally(() => setIsLoading(false));

        handleCancelAuction()
    }

    function handleCancelAuction() {
        setIsEditMode(false)
        setSelectedNewImage(null)
        setNewAuction(auction)
    }

    function getStatuses() {
        axios.get(`${SERVER_URL}/auction/status`, getAuthConfig())
            .then(response => setStatuses(response.data.statuses))
            .catch(error => sendErrorNotify(getErrorMessage(error)))
            .finally(() => setIsLoading(false))
    }

    function handleDeleteAuction() {
        setIsLoading(true)
        axios.delete(`${SERVER_URL}/delete/auction/${auction?.auction_id}`, getAuthConfig())
            .then(() => {
                sendSuccessfulNotify("Аукціон видалився успішно")
                navigate('/auctions')
            })
            .catch(error => sendErrorNotify(getErrorMessage(error)))
            .finally(() => setIsLoading(false));
    }

    function handleDeleteLot() {
        getAllLots()
    }

    const handleInputChange = (field: keyof IAuction, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewAuction((prev) => {
            if (!prev) return prev
            return {
                ...prev,
                [field]: e.target.value
            };
        });
    };

    const handleRemoveFile = () => {
        setSelectedNewImage(null)
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = e.target.files?.[0];
        if (!file) {
            return
        }

        const error = checkImageFile(file)
        if (error !== null) {
            sendErrorNotify(error)
            return;
        }

        setSelectedNewImage(file);
    };

    if (isLoading) {
        return <SpinnerView/>
    }

    return (<>
        {showModal &&
            <ModalLotForm
                isOpen={showModal}
                auction={auction}
                closeModal={onCloseModal}
                onSubmit={onCreated}/>
        }
        <div className={MAIN_BOX_CONTAINER}>
            <Card className={SMALL_BOX_CARD}>
                <CardHeader className={"pb-0 pt-2 px-4 flex justify-center flex-col"}>
                    <ImageModal img_path={getImagePath(auction?.auction_img_path)}>
                        <Image
                            isZoomed
                            isBlurred
                            alt="Card background"
                            className={`${IMAGE_SIZE_STYLE}`}
                            src={getImagePath(auction?.auction_img_path)}
                        />
                    </ImageModal>
                    {isEditMode && <>
                        {selectedNewImage &&
                            <div className="flex sm:flex-row flex-col items-center gap-4 my-5">
                                <div className="sm:w-1/2">
                                    <div className="relative">
                                        <img src={URL.createObjectURL(selectedNewImage)} alt="Вибраний"
                                             className="max-w-full sm:h-auto h-64 rounded-lg"/>
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center"
                                        >
                                            X
                                        </button>
                                    </div>
                                </div>
                            </div>
                        }
                        {!selectedNewImage && (
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer block border-dashed border-2 border-gray-300 p-4 text-center rounded-lg my-3"
                            >
                                <PlusLogo/>
                                <span
                                    className="text-gray-400">Натисніть щоб вибрати зображення , яке замінить теперішнє</span>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    id="file-upload"
                                />
                            </label>
                        )}
                    </>}
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    {isEditMode && <>
                        <Input
                            label="Назва аукціону"
                            isRequired
                            required
                            minLength={1}
                            className="my-1.5"
                            value={newAuction?.auction_name}
                            onChange={(e) => handleInputChange('auction_name', e)}
                        />
                        <Textarea
                            isRequired
                            required
                            label="Про аукціон"
                            minLength={10}
                            value={newAuction?.auction_description}
                            className="my-1.5"
                            onChange={(e) => handleInputChange('auction_description', e)}
                        />
                        <Select
                            isRequired
                            required
                            label="Статус аукціону"
                            placeholder="Віберіть статус"
                            defaultSelectedKeys={[newAuction?.auction_status_id ?? "defaultValue"]}
                            className="my-1.5"
                            onChange={(e) => handleInputChange('auction_status_id', e)}
                        >
                            {statuses.map((st) => (
                                <SelectItem key={st.id} value={st.id}>
                                    {capitalizeFirstLetter(st.name)}
                                </SelectItem>
                            ))}
                        </Select>
                    </>}
                    {!isEditMode && <>
                        <h4 className=" text-balance font-bold text-large flex justify-center">{auction?.auction_name}</h4>
                        <p className="text-tiny font-sans my-2">{auction?.auction_description}</p>
                        <div className="flex justify-between my-2">
                            <CustomChip color={color}
                                        text={`${auction?.auction_status}`}/>
                            <div className="flex justify-center items-center space-x-1.5">
                                <Link className="hover:cursor-pointer"
                                      size="sm"
                                      showAnchorIcon
                                      onClick={() => navigate(`/seller/${auction?.seller_id}`)}>
                                    <SmallAvatar path={auction?.seller_img_path}/>
                                    {auction?.seller_name}
                                </Link>
                            </div>
                        </div>
                        {auction?.date_finished &&
                            <div className={`flex justify-center text-small ${TEXT_STYLE}`}>
                                <p>Завершено: {convertToKyivTime(auction?.date_finished)}</p>
                            </div>
                        }
                    </>}

                    {auction?.is_owner && <>
                        {isEditMode && <>
                            <Button color="warning" className="mb-2" onClick={handleSaveAuction}>
                                Зберегти зміни
                            </Button>
                            <Button color="default" className="mb-2" onClick={handleCancelAuction}>
                                Відхилити
                            </Button>
                        </>
                        }
                        {!isEditMode &&
                            <Button color="success"
                                    className="my-2"
                                    onClick={handleEditAuction}>
                                Редагувати аукціон
                            </Button>
                        }
                        <ButtonModalConfirmDelete object={"аукціон"} onAccept={handleDeleteAuction}/>
                    </>
                    }
                </CardBody>
            </Card>
            <Card className="lg:basis-2/4 flex flex-col">
                <CardHeader className="pb-0 pt-2 px-4 flex sm:justify-between sm:flex-row flex-col">
                    <p className="text-2xl font-bold"> Лоти аукціону :</p>
                    {auction?.is_owner && auction.auction_status_id !== 5 &&
                        <Button onClick={() => setShowModal(true)}
                                className=" sm:m-0 my-2"
                                color="primary">
                            Створити лот
                        </Button>
                    }
                </CardHeader>
                <CardBody className="flex flex-col">
                    {lots?.length === 0 &&
                        <h1 className="flex justify-center">Немає доступних лотів</h1>
                    }
                    {lots?.map(lot => (
                        <LotCardBody key={lot.id}
                                     is_owner={auction?.is_owner}
                                     lot={lot}
                                     onDelete={handleDeleteLot}
                        />
                    ))}
                </CardBody>
            </Card>
        </div>
    </>)
}