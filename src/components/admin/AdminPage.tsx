import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Spinner} from "@nextui-org/react";
import axios from "axios";
import {getAdminAuthConfig, getAdminToken, getAuthToken} from "../../utils/TokenUtils.ts";
import {getErrorMessage} from "../../utils/ErrorUtils.ts";
import {sendErrorNotify} from "../../utils/NotifyUtils.ts";
import {usePage} from "../page/PageContext.tsx";

export default function AdminPage({children}: any) {
    const {error, isLoading, setIsLoading, setError} = usePage();
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true)
        if (!getAuthToken()) navigate("/login")
        if (!getAdminToken()) navigate("/admin/login")

        axios.post(`/admin/check`, {}, getAdminAuthConfig())
            .then(() => {
            })
            .catch(e => {
                setError(getErrorMessage(e))
                sendErrorNotify(getErrorMessage(e))
            })
            .finally(() => setIsLoading(false))
    }, []);

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