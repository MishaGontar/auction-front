import {Tab, Tabs} from "@nextui-org/react";
import {lazy, useState} from "react";
import {usePage} from "../page/PageContext.tsx";

const LoginForm = lazy(() => import("./login/LoginForm.tsx"));
const RegistrationForm = lazy(() => import("./registration/RegistrationForm.tsx"));

export default function MainAuthPage() {
    const [selected, setSelected] = useState("login");
    const {setError} = usePage();

    return (
        <div className="flex w-full justify-center items-center flex-col my-5">
            <Tabs
                aria-label="Options"
                selectedKey={selected}
                onSelectionChange={(key) => {
                    setError('')
                    setSelected(key.toString())
                }}
            >

                <Tab key="login"
                     className="w-full"
                     title={
                         <div className="flex items-center space-x-2 w-fit justify-center p-1.5">
                             <img src="/login.png" alt="Увійти лого" className="w-6 h-6"/>
                             <span>Увійти </span>
                         </div>
                     }
                >
                    <LoginForm/>
                </Tab>
                <Tab key="registration"
                     className="w-full"
                     title={
                         <div className="flex items-center space-x-2 w-fit justify-center p-1.5">
                             <img src="/register.svg" alt="Реєструватись лого" className="w-6 h-6"/>
                             <span>Зареєструватися</span>
                         </div>
                     }
                >
                    <RegistrationForm/>
                </Tab>

            </Tabs>
        </div>
    )
}