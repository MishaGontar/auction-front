export interface IBet {
    bet_id: number,
    lot_id: number,
    amount: number,
    user_id: number,
    username?: string,
    date_created: string,
    date_updated: string
}