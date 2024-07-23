import {createContext, useContext, useState} from "react";

const PageContext = createContext<any>({});

export function usePage() {
    return useContext(PageContext);
}

export default function PageProvider({children}: any) {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    return (
        <PageContext.Provider value={{
            error: error,
            isLoading: isLoading,
            setError: setError,
            setIsLoading: setIsLoading
        }}>
            {children}
        </PageContext.Provider>
    )
}