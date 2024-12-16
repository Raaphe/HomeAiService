export interface Price {
    USD?: number;
    CAD?: number;
    EUR?: number;
}

export interface ListingBase {
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

export interface ListingOverview extends ListingBase {
    image?: string;
}