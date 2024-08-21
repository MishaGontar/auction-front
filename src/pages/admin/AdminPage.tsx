import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Spinner} from "@nextui-org/react";
import {getAdminToken, getAuthToken} from "../../utils/TokenUtils.ts";
import useAxios from "../../hooks/useAxios.ts";

export default function AdminPage({children}: any) {
    const navigate = useNavigate();
    const {error, postAdminRequest, isLoading} = useAxios()
    useEffect(() => {
        if (!getAuthToken()) navigate("/login")
        if (!getAdminToken()) navigate("/admin/login")

        postAdminRequest(`/admin/check`, {})
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