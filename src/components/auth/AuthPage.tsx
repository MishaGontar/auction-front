import {ReactNode, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Spinner} from "@nextui-org/react";
import {getAuthToken} from "../../utils/TokenUtils.ts";

export default function AuthPage({children}: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        if (!getAuthToken())
            navigate("/login")
        setIsLoading(false)
    }, []);

    return isLoading
        ? <Spinner label="Loading..." size="lg" color="warning" className="flex justify-center h-screen"/>
        : <>{children} </>;
}