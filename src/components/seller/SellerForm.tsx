import AuthPage from "../auth/AuthPage.tsx";
import FormTemplate from "../template/FormTemplate.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import {Input, Textarea} from "@nextui-org/react";
import SpinnerView from "../template/Spinner.tsx";
import axios from "axios";
import {SERVER_URL} from "../../constans.ts";
import SellerSendModal from "./SellerSendModal.tsx";
import {useAuth} from "../../provider/AuthProvider.tsx";
import {getAuthConfig, saveAuthToken} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";

interface ISellerForm {
    full_name: string,
    social_media: string,
    description: string,
    address?: string,
    phone_number?: string
}

export default function SellerForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [formSeller, setFormSeller] = useState<ISellerForm>(
        {
            full_name: '',
            social_media: '',
            description: '',
            address: '',
            phone_number: '380'
        }
    )
    const [isAlreadySend, setIsAlreadySend] = useState(false)
    const [error, setError] = useState('');
    const {user} = useAuth();
    const [isSuccessful, setIsSuccessful] = useState(false);

    useEffect(() => {
            document.title = "Become a seller"
            setIsLoading(true)

            axios.get(`${SERVER_URL}/seller`, getAuthConfig())
                .then(response => {
                    if (response.data.seller) {
                        setIsAlreadySend(true)
                    }
                })
                .catch(e => console.error(e))
                .finally(() => {
                    setIsLoading(false)
                })
        },
        []
    )

    const handleInputChange = (field: keyof ISellerForm, e: ChangeEvent<HTMLInputElement>) => {
        setFormSeller((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    function handleSubmit() {
        const {address, phone_number} = formSeller;
        if (!address) delete formSeller.address
        if (!phone_number || phone_number.trim().length === 3) delete formSeller.phone_number

        setIsLoading(true)
        axios.post(`${SERVER_URL}/create/seller`, formSeller, getAuthConfig())
            .then(response => {
                const {new_token} = response.data;
                if (!new_token) {
                    setError("Something went wrong , try again.")
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
            <div className="flex justify-center text-3xl text-orange-500">
                <div>
                    <h3> You have already send message to become a seller. </h3>
                    <h3>Please wait or contact us</h3>
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
        {isSuccessful && <SellerSendModal isOpen={isSuccessful} username_or_email={user?.email || ''}/>}
        <FormTemplate
            title="Become a seller"
            onSubmit={handleSubmit}
            error={error}
            isLoading={isLoading}
            submitBtnTxt="Submit an application"
        >
            <Input
                label="Full name"
                required
                isRequired
                minLength={5}
                value={formSeller.full_name}
                className="m-1.5"
                onChange={(e) => handleInputChange('full_name', e)}
            />
            <Input
                label="Social media"
                required
                isRequired
                minLength={5}
                placeholder="instagram: @some_inst_teg or else"
                value={formSeller.social_media}
                className="m-1.5"
                onChange={(e) => handleInputChange('social_media', e)}
            />
            <Input
                label="Adress"
                minLength={5}
                value={formSeller.address}
                className="m-1.5"
                onChange={(e) => handleInputChange('address', e)}
            />
            <Input
                label="Phone number"
                minLength={12}
                value={formSeller.phone_number}
                className="m-1.5"
                onChange={(e) => handleInputChange('phone_number', e)}
            />
            <Textarea
                isRequired
                label="About you"
                placeholder="It will be in your profile"
                minLength={10}
                value={formSeller.description}
                className="m-1.5"
                onChange={(e) => handleInputChange('description', e)}
            />
        </FormTemplate>
    </AuthPage>)
}