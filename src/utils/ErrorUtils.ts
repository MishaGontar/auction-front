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
        return errorMessage === "Network Error" ? "Something went wrong on our side." : errorMessage;
    }
    return error.response.data.message;
}