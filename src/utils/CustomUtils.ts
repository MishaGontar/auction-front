import moment from 'moment-timezone';
import {IStatus} from "./IStatus.ts";


export function capitalizeFirstLetter(word: string): string {
    if (!word) return '';

    const firstLetter = word.charAt(0).toUpperCase();
    const restOfWord = word.slice(1);

    return firstLetter + restOfWord;
}

export function bytesToMegabytes(bytes: number): number {
    return +(bytes / (1024 * 1024)).toFixed(2);
}

export function getInfoStatusById(id: number): IStatus {
    switch (id) {
        case 1:
            return {id: 1, name: "open", color: "success"}
        case 2:
            return {id: 2, name: "only by url", color: "secondary"}
        case 3:
            return {id: 3, name: "closed", color: "danger"}
        case 4:
            return {id: 4, name: "finished", color: "warning"}
        default:
            console.log("Unhandled id : ", id)
            return {id: -1, name: "unhandled", color: "default"}
    }
}

export type ColorType = "default" | "success" | "secondary" | "danger" | "primary" | "warning" | undefined
export type ColorTypeSecond =
    "success"
    | "secondary"
    | "danger"
    | "primary"
    | "warning"
    | "foreground"
    | undefined;

// Додаємо пробіли між кожною трійкою цифр, починаючи з кінця рядка
export function formatNumberWithSpaces(inputNumber: string): string {
    return inputNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function convertFormattedAmountToNumber(formattedAmount: string): number {
    const numberWithoutSpaces = formattedAmount.replace(/\s/g, '');
    return parseInt(numberWithoutSpaces, 10);
}

export function convertToKyivTime(utcDateTime: string): string {
    return moment
        .utc(utcDateTime)
        .tz('Europe/Kiev')
        .format('HH:mm:ss (DD.MM.YYYY)');
}

export function convertToOnlyData(utcDateTime: string): string {
    return moment
        .utc(utcDateTime)
        .tz('Europe/Kiev')
        .format('DD.MM.YYYY');
}
