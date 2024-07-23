import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import {AuthProvider} from "./provider/AuthProvider.tsx";
import {ToastContainer} from "react-toastify";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <NextUIProvider>
            <AuthProvider>
                <App/>
                <ToastContainer/>
            </AuthProvider>
        </NextUIProvider>
    </StrictMode>,
)
