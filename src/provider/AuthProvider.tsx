import {createContext, ReactNode, useContext, useState} from 'react';
import {IUser} from "../components/user/IUser.ts";

interface AuthContextType {
    user: IUser | null;
    login: (userData: IUser) => void;
    logout: () => void; // Додали новий метод logout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<IUser | null>(null);

    const login = (userData: IUser) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
    };

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
