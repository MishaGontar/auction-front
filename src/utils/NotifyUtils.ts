import addNotification from "react-push-notification";

export function sendInfoNotify(msg: string) {
    addNotification({
        title: 'Information',
        message: msg,
        theme: 'darkblue',
    });
}

export function sendErrorNotify(msg: string) {
    addNotification({
        title: 'Information',
        message: msg,
        theme: 'red',
    });
}