import { Price } from "./price.dto";

export default interface ListingBase {
    property_id?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    property_type?: string;
    bedrooms?: number;
    bathrooms?: number;
    building_size?: number;
    prices?: Price;
    url?: string;
}

