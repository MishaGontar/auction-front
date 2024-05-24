import {ReactNode, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Spinner} from "@nextui-org/react";
import axios from "axios";
import {SERVER_URL} from "../../constans.ts";
import {getAdminAuthConfig, getAdminToken, getAuthToken} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";

export default function AdminPage({children}: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('')
    const navigate = useNavigate();

    useEffect(() => {
            setError('')
            if (!getAuthToken()) navigate("/login")
            if (!getAdminToken()) navigate("/admin/login")

            axios.post(`${SERVER_URL}/admin/check`, {}, getAdminAuthConfig())
                .then(() => {})
                .catch(e => {
                    setError(getErrorMessage(e))
                    sendErrorNotify(getErrorMessage(e))
                })
                .finally(() => setIsLoading(false))
        },
        []);

    if (error) {
        return (
            <h1 className="flex justify-center text-3xl text-orange-500">
                {error}
            </h1>
        )
    }

    return isLoading
        ? <Spinner label="Loading..." size="lg" color="warning" className="flex justify-center h-screen"/>
        : <>{children} </>;
}