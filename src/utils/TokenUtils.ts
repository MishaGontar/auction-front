import Cookie from "./Cookie.ts";

const AUTH_TOKEN: string = "authToken"
const MFA_TOKEN: string = "mfaToken"
const ADMIN_TOKEN: string = "adminToken"

export function saveAuthToken(token: string): boolean {
    return Cookie.saveCookie(AUTH_TOKEN, token);
}

export function getAuthToken(): string {
    return Cookie.getCookie(AUTH_TOKEN);
}

export function removeAuthToken(): boolean {
    return Cookie.removeCookie(AUTH_TOKEN)
}

export function saveMfaToken(token: string): boolean {
    return Cookie.saveCookie(MFA_TOKEN, token);
}

export function getMfaToken(): string {
    return Cookie.getCookie(MFA_TOKEN);
}

export function removeMfaToken(): boolean {
    return Cookie.removeCookie(MFA_TOKEN)
}

export function saveAdminToken(token: string): boolean {
    return Cookie.saveCookie(ADMIN_TOKEN, token);
}

export function getAdminToken(): string {
    return Cookie.getCookie(ADMIN_TOKEN);
}

export function removeAdminToken(): boolean {
    return Cookie.removeCookie(ADMIN_TOKEN)
}

export function removeAllTokens(): void {
    removeAuthToken()
    removeMfaToken()
    removeAdminToken()
}

export function getAuthConfig() {
    return {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`
        }
    }
}

export function getAuthFormDataConfig() {
    return {
        headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            'Content-Type': 'multipart/form-data',
        }
    }
}

export function getMfaAuthConfig() {
    return {
        headers: {
            Authorization: `Bearer ${getMfaToken()}`
        }
    }
}

export function getAdminAuthConfig() {
    return {
        headers: {
            Authorization: `Bearer ${getAdminToken()}`
        }
    }
}