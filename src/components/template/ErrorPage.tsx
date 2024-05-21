import {useRouteError} from "react-router-dom";

type ErrorRouter = {
    message: string,
    statusText: string,
}

export default function ErrorPage() {
    const error: ErrorRouter = useRouteError() as ErrorRouter;
    console.error(error);

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Вибачте, сталася неочікувана помилка.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>)
}