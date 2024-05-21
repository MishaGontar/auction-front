import {Bounce, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const options = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
}

export function sendSuccessfulNotify(msg: string) {
    // @ts-ignore
    toast.success(msg, options)
}

export function sendInfoNotify(msg: string) {
    // @ts-ignore
    toast.info(msg, options)
}

export function sendErrorNotify(msg: string) {
    // @ts-ignore
    toast.error(msg, options)
}