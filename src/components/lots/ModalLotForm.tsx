import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea
} from "@nextui-org/react";
import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import SpinnerView from "../template/Spinner.tsx";
import {IAuction} from "../auction/IAuction.ts";
import axios from "axios";
import {SERVER_URL} from "../../constans.ts";
import {capitalizeFirstLetter,} from "../../utils/CustomUtils.ts";
import {ILot, ILotData} from "./LotInterfaces.ts";
import {PlusLogo} from "../../icons/PlusLogo.tsx";
import UAH from "../../icons/UAH.tsx";
import {checkImageFile, getImagePath, IImage} from "../../utils/ImageUtils.ts";
import {IStatus} from "../../utils/IStatus.ts";
import {getAuthConfig, getAuthFormDataConfig} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";
import {validateCardNumber} from "../../utils/CardValidation.ts";

interface IModalLotProps {
    isOpen: boolean,
    auction: IAuction,
    lot?: ILotData,
    onSubmit: () => void,
    closeModal: () => void,
}

const monobank_start: string = 'https://send.monobank.ua/jar/'

export default function ModalLotForm({isOpen, auction, onSubmit, closeModal, lot}: IModalLotProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>('');
    const [errorInputCard, setErrorInputCard] = useState({
        monobank: false,
        bank_card: false
    });
    const [statuses, setStatuses] = useState<IStatus[]>([])
    const [lotForm, setLotForm] = useState<ILot>({
        name: lot?.lot.lot_name ?? '',
        description: lot?.lot.lot_description ?? '',
        seller_id: lot?.lot.seller_id ?? auction?.seller_id,
        auction_id: lot?.lot.auction_id ?? auction?.auction_id,
        status_id: lot?.lot.lot_status_id ?? 1,
        bank_card_number: lot?.lot.lot_bank_card_number ?? '',
        monobank_link: lot?.lot.lot_monobank_link ?? '',
        amount: 0,
    })
    const [files, setFiles] = useState<(File | null)[]>([]);
    const [showAddButton, setShowAddButton] = useState(true);

    useEffect(() => {
        setIsLoading(true)
        axios.get(`${SERVER_URL}/auction/create_statuses`, getAuthConfig())
            .then(response => setStatuses(response.data.statuses))
            .catch(error => setError(getErrorMessage(error)))
            .finally(() => setIsLoading(false))
    }, []);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];

            const error = checkImageFile(file)
            if (error !== null) {
                sendErrorNotify(error)
                return;
            }

            const updatedFiles = [...files, file];
            setFiles(updatedFiles);

            if (updatedFiles.length >= 3) {
                setShowAddButton(false);
            }
        }
    };

    const handleRemoveFile = (index: number) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
        setShowAddButton(true);
    };

    const handleInputChange = (field: keyof ILot, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setErrorInputCard({
            bank_card: false,
            monobank: false,
        })
        setLotForm((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setErrorInputCard({
            bank_card: false,
            monobank: false,
        })

        const inputCardNumber = e.target.value
            .replace(/\D/g, '')
            .replace(/(\d{4})/g, '$1 ')
            .trim();
        setLotForm((prev) => ({
            ...prev,
            ['bank_card_number']: inputCardNumber,
        }));
    };

    function isIncorrectData(): boolean {
        const {bank_card_number, monobank_link} = lotForm;

        if (!monobank_link && !bank_card_number) {
            setErrorInputCard({
                bank_card: true,
                monobank: true,
            })
            sendErrorNotify("Введіть номер банківської карти або посилання на monobank")
            return true;
        }

        if (monobank_link && !monobank_link.startsWith(monobank_start)) {
            sendErrorNotify("Невірне посилання monobank!")
            setErrorInputCard((prev) => ({
                ...prev,
                ['monobank']: true,
            }));
            return true;
        }
        if (bank_card_number && !validateCardNumber(bank_card_number)) {
            setErrorInputCard((prev) => ({
                ...prev,
                ['bank_card']: true,
            }));
            sendErrorNotify("Невірний номер банківської картки!")
            return true;
        }

        if (!lot && (!files || files.length === 0)) {
            sendErrorNotify("Потрібно завантажити мінімум 1 фото")
            return true;
        }
        return false
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (isIncorrectData()) {
            return;
        }
        createLot()
    }


    function createLot() {

        const form = new FormData();
        form.append('name', lotForm.name);
        form.append('description', lotForm.description);
        form.append('seller_id', String(lotForm.seller_id));
        form.append('auction_id', String(lotForm.auction_id));
        form.append('status_id', String(lotForm.status_id));
        form.append('amount', String(lotForm.amount));

        if (lotForm.bank_card_number) {
            form.append('bank_card_number', lotForm.bank_card_number);
        }
        if (lotForm.monobank_link) {
            form.append('monobank_link', lotForm.monobank_link);
        }

        files.forEach((file) => {
            if (file) {
                form.append('image', file);
            }
        });

        setIsLoading(true)
        const url = lot ? `/update/lot/${lot?.lot.lot_id}` : `/create/lot`
        axios
            .post(`${SERVER_URL}${url}`, form, getAuthFormDataConfig())
            .then(() => onSubmit())
            .catch(error => setError(getErrorMessage(error)))
            .finally(() => setIsLoading(false));
    }

    return (
        <Modal
            backdrop="opaque"
            size="md"
            isDismissable={false}
            isOpen={isOpen}
            scrollBehavior="outside"
            onClose={closeModal}
        >
            <ModalContent>
                {isLoading && <SpinnerView/>}
                {!isLoading &&
                    <form onSubmit={handleSubmit}>
                        <ModalHeader className="flex flex-col gap-1">
                            {lot ? "Редагувати" : "Створити"} лот
                        </ModalHeader>
                        {error && <p className="text-xl text-red-500 mb-5 ml-1 ">{error}</p>}
                        <ModalBody>

                            <Input
                                label="Назва"
                                required
                                isRequired
                                minLength={5}
                                value={lotForm.name}
                                className="m-1.5"
                                onChange={(e) => handleInputChange('name', e)}
                            />
                            <Textarea
                                isRequired
                                label="Опис"
                                minLength={10}
                                value={lotForm.description}
                                className="m-1.5"
                                onChange={(e) => handleInputChange('description', e)}
                            />
                            {!lot && <Input
                                label="Стартова ціна"
                                required
                                type="number"
                                placeholder="0.00"
                                endContent={<UAH/>}
                                value={String(lotForm.amount)}
                                className="m-1.5"
                                onChange={(e) => handleInputChange('amount', e)}
                            />}
                            <Input
                                label="Посилання на monobank банку"
                                placeholder={`${monobank_start}...`}
                                value={lotForm.monobank_link}
                                isInvalid={errorInputCard.monobank}
                                className="m-1.5"
                                onChange={(e) => handleInputChange('monobank_link', e)}
                            />
                            <Input
                                label="Банківська картка"
                                minLength={19}
                                maxLength={19}
                                isInvalid={errorInputCard.bank_card}
                                placeholder="0000 0000 0000 0000"
                                value={lotForm.bank_card_number}
                                className="m-1.5"
                                onChange={handleCardNumberChange}
                            />
                            <Select
                                isRequired
                                required
                                defaultSelectedKeys={String(lotForm.status_id)}
                                label="Статус"
                                placeholder="Виберіть статус"
                                className="my-1.5"
                                onChange={(e) => handleInputChange('status_id', e)}
                            >
                                {statuses.map((st) => (
                                    <SelectItem key={st.id} value={st.id}>
                                        {capitalizeFirstLetter(st.name)}
                                    </SelectItem>
                                ))}
                            </Select>
                            <div className="flex sm:flex-row flex-col items-center gap-4">
                                {lot?.images && (
                                    lot.images.map((image: IImage) => (
                                        <div key={image.lot_image_id} className="sm:w-1/2">
                                            <div className="relative">
                                                <img src={getImagePath(image.image_url)} alt="Selected"
                                                     className="max-w-full sm:h-auto h-64 rounded-lg"/>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="flex sm:flex-row flex-col items-center gap-4">
                                {files.map((file, index) => (
                                    <div key={index} className="sm:w-1/2">
                                        <div className="relative">
                                            {file && (
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="Selected"
                                                    className="max-w-full sm:h-auto h-64 rounded-lg"
                                                />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex justify-center items-center"
                                            >
                                                X
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {showAddButton && (
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer block border-dashed border-2 border-gray-300 p-4 text-center rounded-lg"
                                    >
                                        <PlusLogo/>
                                        <span className="text-gray-400">
                                            {lot ? "Замінити фото" : "Клікнути щоб додати фото"}
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/jpeg, image/png"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            id="file-upload"
                                        />
                                    </label>
                                )}
                            </div>
                        </ModalBody>
                        <ModalFooter className="my-1.5">
                            <Button variant="light" color="danger" onClick={closeModal}>
                                Закрити
                            </Button>
                            <Button isLoading={isLoading}
                                    type="submit"
                                    color="success"
                            >
                                {lot ? "Оновити" : "Зберегти"} лот
                            </Button>
                        </ModalFooter>
                    </form>
                }
            </ModalContent>
        </Modal>
    )
}