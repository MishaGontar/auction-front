import {IImage} from "../../utils/ImageUtils.ts";

export interface IUserBet {
    bet_id: number,
    amount: number,
    date_created: string,
    lot_id: number,
    lot_name: string,
    seller_id: number,
    seller_name: string,
    is_winner: boolean,
    images: IImage[]
}