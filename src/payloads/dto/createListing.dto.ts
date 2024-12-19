import { Price } from "./price.dto";

export default interface CreateListingDTO {
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    property_type?: string;
    building_size?: number;
    land_size?: number;
    description?: string;
    images?: string[];
    bedrooms?: number;
    bathrooms?: number;
    prices?: Price;
    url?: string;
    email: string;
}
