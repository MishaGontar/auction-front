import {ColorTypeSecond} from "../../utils/CustomUtils.ts";

export interface IMenuItem {
    color: ColorTypeSecond,
    href: string,
    name: string,
    disabled?: boolean
}

export const adminMenuItem: IMenuItem = {
    color: 'foreground',
    href: '/admin/dashboard',
    name: 'Адмін панель'
}

export const sellerMenuItem: IMenuItem = {
    color: 'foreground',
    href: '/create/auction',
    name: 'Створити аукціон'
}
export const initMenu: IMenuItem = {
    color: 'foreground',
    href: '/auctions',
    name: 'Аукціони'
}