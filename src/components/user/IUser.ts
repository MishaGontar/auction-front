export interface IUser {
    user_id: number,
    username: string,
    email: string,
    image_url: string,
    is_admin: boolean,
    is_owner?: boolean,

    seller_id?: number,
    full_name?: string,
    social_media?: string,
    status_name?: string,
    status_id?: number,
    address?: number,
    phone_number?: number,
}