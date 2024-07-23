import {createContext, useContext, useState} from 'react';
import {IUser} from "../components/user/IUser.ts";
import {removeAllTokens} from "../utils/TokenUtils.ts";

interface AuthContextType {
    user: IUser | null;
    login: (userData: IUser) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: any) {
    const [user, setUser] = useState<IUser | null>(null);

    function login(userData: IUser) {
        setUser(userData);
    }

    function logout() {
        removeAllTokens()
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}


export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
