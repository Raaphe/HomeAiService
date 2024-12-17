import ListingBase from "./listing.dto";

export default interface ListingDetailed extends ListingBase {
    land_size?: number;
    description?: string;
    images?: string[];
    contact?: {
        first_name?: string;
        last_name?: string;
        phone_number?: string;
        profile_pic?: string | null;
        company?: string;
        company_url?: string;
    };
    estimated_market_price?: number;
}