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
            return {id: 1, name: "Відкритий", color: "success"}
        case 2:
            return {id: 2, name: "Тільки по посиланню", color: "secondary"}
        case 3:
            return {id: 3, name: "Закритий", color: "danger"}
        case 4:
            return {id: 4, name: "Продано", color: "warning"}
        case 5:
            return {id: 5, name: "Завершений", color: "warning"}
        default:
            console.log("Unhandled id : ", id)
            return {id: -1, name: "Невизначено", color: "default"}
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

export function getColorByStatus(s: number) {
    if (s === 1) return "warning"
    if (s === 2) return "success"
    if (s === 3) return "danger"
}