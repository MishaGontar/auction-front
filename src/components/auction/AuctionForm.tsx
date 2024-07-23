import SellerPage from "../seller/SellerPage.tsx";
import FormTemplate from "../template/FormTemplate.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {capitalizeFirstLetter,} from "../../utils/CustomUtils.ts";
import {useAuth} from "../../provider/AuthProvider.tsx";
import SpinnerView from "../template/Spinner.tsx";
import {Input, Select, SelectItem, Textarea} from "@nextui-org/react";
import {useNavigate} from "react-router-dom";
import {IStatus} from "../../utils/IStatus.ts";
import {getAuthConfig, getAuthFormDataConfig} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";
import {checkImageFile} from "../../utils/ImageUtils.ts";
import {usePage} from "../page/PageContext.tsx";
import useTitle from "../../hooks/TitleHook.tsx";
import useInput from "../../hooks/InputHook.tsx";
import PlusLogo from "../../icons/PlusLogo.tsx";

export default function AuctionForm() {
    useTitle('Створити аукціон')

    const {isLoading, setIsLoading, setError} = usePage()
    const [statuses, setStatuses] = useState<IStatus[]>([])

    const name = useInput('')
    const description = useInput('')
    const status = useInput('')

    const {user} = useAuth()
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleRemoveFile = () => {
        setSelectedImage(null)
    };

    const handleImageChange = (e: any) => {
        const file: File | undefined = e.target.files?.[0];
        if (!file) {
            return
        }

        const error = checkImageFile(file)
        if (error !== null) {
            sendErrorNotify(error)
            return;
        }

        setSelectedImage(file);
    };

    useEffect(() => {
        setIsLoading(true)
        axios.get(`/auction/create_statuses`, getAuthConfig())
            .then(response => {
                const data = response.data.statuses;
                setStatuses(data)
                status.setValue(data[0].name)
            })
            .catch(error => setError(getErrorMessage(error)))
            .finally(() => setIsLoading(false))
    }, [user]);

    function handleSubmit() {
        if (!selectedImage) {
            sendErrorNotify("Потрібно вибрати фото");
            return;
        }

        const form = new FormData();
        form.append('image', selectedImage);
        form.append('name', name.value);
        form.append('description', description.value);
        form.append('status_id', statuses.find(s => s.name === status.value)?.id.toString() || "1");

        setIsLoading(true)
        axios
            .post(`/create/auction`, form, getAuthFormDataConfig())
            .then(response => navigate(`/auction/${response.data.auction_id}`))
            .catch(error => setError(getErrorMessage(error)))
            .finally(() => setIsLoading(false));
    }


    if (isLoading) {
        return <SpinnerView/>
    }

    return (<SellerPage>
            <FormTemplate
                title="Створити аукціон"
                onSubmit={handleSubmit}
                submitBtnTxt="Створити">
                <Input
                    label="Назва аукціону"
                    isRequired
                    required
                    minLength={1}
                    className="my-1.5"
                    {...name.bind}
                />
                <Textarea
                    isRequired
                    required
                    label="Опис аукціону"
                    minLength={10}
                    className="my-1.5"
                    {...description.bind}
                />

                <Select
                    isRequired
                    required
                    label="Статус"
                    placeholder="Виберіть статус"
                    className="my-1.5"
                    onChange={status.bind.onChange}
                >
                    {statuses.map((st) => (
                        <SelectItem key={st.name} value={st.name}>
                            {capitalizeFirstLetter(st.name)}
                        </SelectItem>
                    ))}
                </Select>
                {selectedImage &&
                    <div className="flex sm:flex-row flex-col items-center gap-4 my-5">
                        <div className="sm:w-1/2">
                            <div className="relative">
                                <img src={URL.createObjectURL(selectedImage)} alt="Вибраний"
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
                {!selectedImage && (
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer block border-dashed border-2 border-gray-300 p-4 text-center rounded-lg my-3"
                    >
                        <PlusLogo/>
                        <span className="text-gray-400">Натисніть , щоб додати фото</span>
                        <input
                            type="file"
                            accept="image/jpeg, image/png"
                            className="hidden"
                            onChange={handleImageChange}
                            id="file-upload"
                        />
                    </label>
                )}
            </FormTemplate>
        </SellerPage>
    )
}
