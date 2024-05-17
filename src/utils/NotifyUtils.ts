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
    theme: "light",
    transition: Bounce,
}

export function sendInfoNotify(msg: string) {
    toast.info(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    })
}

export function sendErrorNotify(msg: string) {
    // @ts-ignore
    toast.error(msg, options)
}