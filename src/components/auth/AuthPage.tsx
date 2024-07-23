import {ReactNode, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {getAuthToken} from "../../utils/TokenUtils.ts";
import SpinnerView from "../template/Spinner.tsx";
import {usePage} from "../page/PageContext.tsx";

export default function AuthPage({children}: { children: ReactNode }) {
    const {isLoading, setIsLoading} = usePage();
    const navigate = useNavigate();
    useEffect(() => {
        setIsLoading(true)
        if (!getAuthToken())
            navigate("/login")
        setIsLoading(false)
    }, []);


    return isLoading
        ? <SpinnerView/>
        : <>{children} </>;
}