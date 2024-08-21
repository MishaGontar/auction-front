import axios, {AxiosResponse} from "axios";
import {usePage} from "../pages/page/PageContext.tsx";
import {getAdminAuthConfig, getAuthConfig, getAuthFormDataConfig, getMfaAuthConfig} from "../utils/TokenUtils.ts";
import {sendErrorNotify} from "../utils/NotifyUtils.ts";
import {getErrorMessage} from "../utils/ErrorUtils.ts";


export default function useAxios() {
    const {error, isLoading, setIsLoading, setError} = usePage();

    function getRequest(url: string, config?: any, onSuccess?: Function, onError?: Function) {
        setIsLoading(true);
        setError('');
        axios.get(url, config)
            .then(res => {
                if (onSuccess) onSuccess(res)
            })
            .catch((error) => {
                const message = getErrorMessage(error)
                setError(message)
                sendErrorNotify(message)
                if (onError) onError(error)
            })
            .finally(() => setIsLoading(false));
    }

    function postRequest(url: string, data: Object, config?: any, onSuccess?: Function) {
        setIsLoading(true);
        setError('');
        axios.post(url, data, config)
            .then(res => {
                if (onSuccess) onSuccess(res)
            })
            .catch((error) => {
                const message = getErrorMessage(error)
                setError(message)
                sendErrorNotify(message)
            })
            .finally(() => setIsLoading(false));
    }

    function deleteRequest(url: string, config?: any, onSuccess?: Function) {
        setIsLoading(true);
        setError('');
        axios.delete(url, config)
            .then((response: AxiosResponse) => {
                if (onSuccess) onSuccess(response)
            })
            .catch((error) => {
                const message = getErrorMessage(error)
                setError(message)
                sendErrorNotify(message)
            })
            .finally(() => setIsLoading(false));
    }

    function getAdminRequest(url: string, onSuccess?: Function) {
        getRequest(url, getAdminAuthConfig(), onSuccess)
    }

    function postAdminRequest(url: string, data: Object, onSuccess?: Function) {
        postRequest(url, data, getAdminAuthConfig(), onSuccess)
    }

    function deleteAdminRequest(url: string, onSuccess?: Function) {
        deleteRequest(url, getAdminAuthConfig(), onSuccess)
    }

    function getAuthRequest(url: string, onSuccess?: Function, onError?: Function) {
        getRequest(url, getAuthConfig(), onSuccess, onError)
    }

    function postAuthRequest(url: string, data: Object, onSuccess?: Function) {
        postRequest(url, data, getAuthConfig(), onSuccess)
    }

    function deleteAuthRequest(url: string, onSuccess?: Function) {
        deleteRequest(url, getAuthConfig(), onSuccess)
    }

    function postAuthFormDataRequest(url: string, data: FormData, onSuccess?: Function) {
        postRequest(url, data, getAuthFormDataConfig(), onSuccess)
    }

    function postMfaRequest(url: string, data: Object, onSuccess?: Function) {
        postRequest(url, data, getMfaAuthConfig(), onSuccess)
    }

    function getMfaRequest(url: string, onSuccess?: Function, onError?: Function) {
        getRequest(url, getMfaAuthConfig(), onSuccess, onError)
    }

    return {
        getRequest,
        postRequest,
        deleteRequest,
        getAuthRequest,
        postAuthRequest,
        deleteAuthRequest,
        getAdminRequest,
        postAdminRequest,
        deleteAdminRequest,
        postAuthFormDataRequest,
        postMfaRequest,
        getMfaRequest,
        error,
        isLoading
    }
}