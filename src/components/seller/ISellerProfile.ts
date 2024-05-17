export interface ISellerProfile {
    seller_id: number,
    full_name: string,
    description: string,
    image_url: string,
    social_media: string,
    phone_number?: string,
    address?: string,
}