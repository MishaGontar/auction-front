import {ReactNode, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getAuthToken} from "../../utils/TokenUtils.ts";
import SpinnerView from "../template/Spinner.tsx";

export default function AuthPage({children}: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        if (!getAuthToken())
            navigate("/login")
        setIsLoading(false)
    }, []);


    return isLoading
        ? <SpinnerView/>
        : <>{children} </>;
}