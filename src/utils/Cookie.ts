import Cookies from "universal-cookie";

class Cookie {
    private cookie: Cookies;

    constructor() {
        this.cookie = new Cookies;
    }

    public saveCookie(name: string, value: unknown, path: string = "/"): boolean {
        try {
            const date = new Date();
            date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000));
            this.cookie.set(name, value, {path: path, expires: date,});
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