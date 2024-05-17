import {bytesToMegabytes} from "./CustomUtils.ts";
import {SERVER_URL} from "../constans.ts";

export interface IImage {
    lot_image_id: number,
    image_url: string
}

// max 2mb
export function checkImageFile(file: File): string | null {

    if (!isJpegOrPngFile(file)) {
        return "File need to be .jpeg or .png format"
    }
    const maxFileSize = 2;
    if (isLargeFile(file, maxFileSize)) {
        return `File size max ${maxFileSize}mb`
    }
    return null
}

export function isJpegOrPngFile(file: File): boolean {
    const type = file.type;
    return type === "image/jpeg" || type === "image/png"
}

export function isLargeFile(file: File, maxValue: number): boolean {
    const size = file.size;
    return bytesToMegabytes(size) > maxValue
}

export function getImagePath(path: string | undefined): string {
    return `${SERVER_URL}${path}`;
}