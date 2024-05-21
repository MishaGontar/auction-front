export type ErrorResponse = {
    message: string;
    response: {
        data: {
            message: string;
        }
    }
};

export function getErrorMessage(error: ErrorResponse): string {
    console.log(error)
    const response = error.response;
    const errorMessage = error.message;
    if (!response) {
        return errorMessage === "Network Error" ? "З нашого боку щось пішло не так." : errorMessage;
    }
    return error.response.data.message;
}