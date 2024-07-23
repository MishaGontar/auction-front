import AuthPage from "../auth/AuthPage.tsx";
import FormTemplate from "../template/FormTemplate.tsx";
import {useEffect, useState} from "react";
import {Input, Textarea} from "@nextui-org/react";
import SpinnerView from "../template/Spinner.tsx";
import axios from "axios";
import SellerSendModal from "./SellerSendModal.tsx";
import {useAuth} from "../../provider/AuthProvider.tsx";
import {getAuthConfig, saveAuthToken} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import useTitle from "../../hooks/TitleHook.tsx";
import {usePage} from "../page/PageContext.tsx";
import useInput from "../../hooks/InputHook.tsx";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";

interface ISellerForm {
    full_name: string,
    social_media: string,
    description: string,
    address?: string,
    phone_number?: string
}

export default function SellerForm() {
    useTitle('Стати продавцем')

    const full_name = useInput('')
    const social_media = useInput('')
    const description = useInput('')
    const address = useInput('')
    const phone_number = useInput('380')

    const [isAlreadySend, setIsAlreadySend] = useState(false)
    const [isSuccessful, setIsSuccessful] = useState(false);

    const {user} = useAuth();
    const {isLoading, setIsLoading, setError} = usePage();

    useEffect(() => {
            setIsLoading(true)

            axios.get(`/seller`, getAuthConfig())
                .then(response => {
                    if (response.data.seller) {
                        setIsAlreadySend(true)
                    }
                })
                .catch(e => sendErrorNotify(getErrorMessage(e)))
                .finally(() => setIsLoading(false))
        },
        []
    )

    function handleSubmit() {
        const formSeller: ISellerForm = {
            full_name: full_name.value,
            social_media: social_media.value,
            description: description.value,
            phone_number: phone_number.value
        }

        if (address.value) {
            formSeller.address = address.value
        }
        if (!formSeller.phone_number || formSeller.phone_number.trim().length === 3) {
            delete formSeller.phone_number
        }

        setIsLoading(true)
        axios.post(`/create/seller`, formSeller, getAuthConfig())
            .then(response => {
                const {new_token} = response.data;
                if (!new_token) {
                    setError("Щось пішло не так , повторіть будь ласка пізніше.")
                    return
                }
                saveAuthToken(new_token)
                setIsSuccessful(true);
            })
            .catch((error) => {
                setError(getErrorMessage(error));
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    if (isAlreadySend) {
        return (<AuthPage>
            <div className="flex justify-center items-center mt-10">
                <div className="p-6 bg-white rounded-lg shadow-lg text-3xl text-orange-500 border-1.5 border-green-500">
                    <h3 className="mb-4">Ви вже надіслали заяву, щоб стати продавцем.</h3>
                    <h3>Будь ласка, зачекайте або зв'яжіться з нами.</h3>
                </div>
            </div>
        </AuthPage>)
    }

    if (isLoading) {
        return (<AuthPage>
            <SpinnerView/>
        </AuthPage>)
    }

    return (<AuthPage>
        {isSuccessful && <SellerSendModal isOpen={isSuccessful} username_or_email={user?.email || ''} onClose={() => {
        }}/>}
        <FormTemplate
            title="Стати продавцем"
            onSubmit={handleSubmit}
            submitBtnTxt="Надіслати заяву"
        >
            <Input
                label="Ім'я продавця або компанії"
                required
                isRequired
                minLength={5}
                {...full_name.bind}
                className="m-1.5"
            />
            <Input
                label="Соціальна мережа"
                required
                isRequired
                minLength={5}
                placeholder="instagram: @some_inst_teg чи щось інше"
                {...social_media.bind}
                className="m-1.5"
            />
            <Input
                label="Адреса (необов'язково)"
                minLength={5}
                className="m-1.5"
                {...address.bind}
            />
            <Input
                label="Телефон (необов'язково)"
                minLength={12}
                {...phone_number.bind}
                className="m-1.5"
            />
            <Textarea
                isRequired
                label="Опис продавця або компанії"
                minLength={10}
                className="m-1.5"
                {...description.bind}
            />
        </FormTemplate>
    </AuthPage>)
}