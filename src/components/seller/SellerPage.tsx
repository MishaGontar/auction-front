import {useAuth} from "../../provider/AuthProvider.tsx";
import {ReactNode, useEffect, useState} from "react";
import {Spinner} from "@nextui-org/react";
import {useNavigate} from "react-router-dom";

export default function SellerPage({children}: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSeller, setIsSeller] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const {user} = useAuth();

    useEffect(() => {
        setIsLoading(true)
        setIsSeller(user?.status_id === 2)
        setIsLoading(false)
    }, [user]);

    if (isSeller !== null && !isSeller) {
        navigate('/')
    }

    return isLoading
        ? <Spinner label="Loading..." size="lg" color="warning" className="flex justify-center h-screen"/>
        : <>{children} </>;
}