import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {NextUIProvider} from "@nextui-org/react";
import {AuthProvider} from "./provider/AuthProvider.tsx";
import {Notifications} from "react-push-notification";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <NextUIProvider>
            <AuthProvider>
                <Notifications position="top-right"/>
                <App/>
            </AuthProvider>
        </NextUIProvider>
    </StrictMode>,
)
