export interface IAuction {
    auction_id: number,
    auction_name: string,
    auction_description: string,
    auction_status: string,
    auction_status_id: number,
    auction_img_path: string,
    seller_id: number,
    seller_name: string,
    date_created: string,
    is_owner?: boolean
}

// 1 = 'open'
// 2 = 'only by url'
// 3 = 'closed'
// 4 = 'finished'