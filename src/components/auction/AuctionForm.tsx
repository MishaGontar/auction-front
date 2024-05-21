import SellerPage from "../seller/SellerPage.tsx";
import FormTemplate from "../template/FormTemplate.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import axios from "axios";
import {SERVER_URL} from "../../constans.ts";
import {capitalizeFirstLetter,} from "../../utils/CustomUtils.ts";
import {useAuth} from "../../provider/AuthProvider.tsx";
import SpinnerView from "../template/Spinner.tsx";
import {Input, Select, SelectItem, Textarea} from "@nextui-org/react";
import {useNavigate} from "react-router-dom";
import {PlusLogo} from "../../icons/PlusLogo.tsx";
import {IStatus} from "../../utils/IStatus.ts";
import {getAuthConfig, getAuthFormDataConfig} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";
import {checkImageFile} from "../../utils/ImageUtils.ts";

interface FormData {
    name: string;
    description: string;
    status: string;
}

export default function AuctionForm() {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [statuses, setStatuses] = useState<IStatus[]>([])
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        status: '',
    });

    const {user} = useAuth()
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleRemoveFile = () => {
        setSelectedImage(null)
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

        setSelectedImage(file);
    };

    useEffect(() => {
        setIsLoading(true)
        document.title = 'Create Auction';
        axios.get(`${SERVER_URL}/auction/create_statuses`, getAuthConfig())
            .then(response => {
                const data = response.data.statuses;
                setStatuses(data)
                setFormData((prev) => ({
                    ...prev,
                    status: data[0].name,
                }));
            })
            .catch(error => setError(getErrorMessage(error)))
            .finally(() => setIsLoading(false))
    }, [user]);

    const handleInputChange = (field: keyof FormData, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    function handleSubmit() {
        if (!selectedImage) {
            sendErrorNotify("Потрібно вибрати фото");
            return;
        }

        const form = new FormData();
        form.append('image', selectedImage);
        form.append('name', formData.name);
        form.append('description', formData.description);
        const status_id = statuses.find(s => s.name === formData.status)?.id.toString()
        form.append('status_id', status_id || "1");

        setIsLoading(true)
        axios
            .post(`${SERVER_URL}/create/auction`, form, getAuthFormDataConfig())
            .then(response => navigate(`/auction/${response.data.auction_id}`))
            .catch(error => setError(getErrorMessage(error)))
            .finally(() => setIsLoading(false));
    }


    if (isLoading) {
        return <SpinnerView/>
    }

    return (<SellerPage>
            <FormTemplate
                error={error}
                title="Створити аукціон"
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitBtnTxt="Створити">
                <Input
                    label="Ім'я"
                    isRequired
                    required
                    minLength={1}
                    className="my-1.5"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e)}
                />
                <Textarea
                    isRequired
                    required
                    label="Опис аукціону"
                    minLength={10}
                    value={formData.description}
                    className="my-1.5"
                    onChange={(e) => handleInputChange('description', e)}
                />

                <Select
                    isRequired
                    required
                    label="Статус"
                    placeholder="Виберіть статус"
                    className="my-1.5"
                    onChange={(e) => handleInputChange('status', e)}
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
