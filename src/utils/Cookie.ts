import Cookies from "universal-cookie";

class Cookie {
    private cookie: Cookies;

    constructor() {
        this.cookie = new Cookies;
    }

    public saveCookie(name: string, value: unknown, path: string = "/"): boolean {
        try {
            this.cookie.set(name, value, {path: path});
            return true;
        } catch (e) {
            return false;
        }
    }

    public removeCookie(name: string, path: string = "/"): boolean {
        try {
            this.cookie.remove(name, {path: path});
            return true;
        } catch (e) {
            return false;
        }
    }

    public getCookie(name: string) {
        return this.cookie.get(name);
    }

}

export default new Cookie();