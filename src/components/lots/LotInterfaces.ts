import {IImage} from "../../utils/ImageUtils.ts";
import {IStatus} from "../../utils/IStatus.ts";
import {IWinner} from "./IWinner.ts";

export interface ILot {
    id?: number,
    name: string,
    description: string,
    seller_id: number,
    auction_id: number,
    status_id: number,
    monobank_link?: string,
    bank_card_number?: string,
    amount: number
}

export interface ILotPageResponse {
    lot_id: number,
    lot_name: string,
    lot_description: string,
    lot_amount: number,
    lot_bank_card_number: string,
    lot_monobank_link: string,
    lot_date_created: string,
    seller_id: number,
    seller_full_name: string,
    auction_id: number,
    auction_name: string,
    lot_status_id: number,
    lot_status_name: string
}

export interface ILotData {
    winner: IWinner
    lot: ILotPageResponse,
    images: IImage[],
    is_owner: boolean,
    status: IStatus
}

