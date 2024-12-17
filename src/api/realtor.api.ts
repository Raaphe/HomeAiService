import ListingDetailed from "../payloads/dto/listingDetailed.dto";
import axios from "axios";
import ListingService from "../services/listing.service";
import InferenceService from "../services/inference.service";
import HouseDTO from "../payloads/dto/houseInfo.dto";
import IProperty from "../interfaces/listing.interface";
import ResponseObject from "../interfaces/response.interface";

class RealtorApi {
    static baseUrl: string = "https://real-estate-api-xi.vercel.app";

    private static endpoints: any = {
        propertyListings: "/listings?zip_code={zip_code}&listings={number_of_listings}",
        propertyDetails: "/listing_detail?listing_url={listing_url}"
    };

    static getUrl(endpoint: keyof typeof RealtorApi.endpoints, params: Record<string, string | number>) {
        let url = this.baseUrl + RealtorApi.endpoints[endpoint];
        Object.keys(params).forEach(key => {
            url = url.replace(`{${key}}`, String(params[key]));
        });
        return url;
    }

    static async fetchPropertiesList(zipCode: string, number_of_listings: number = 25) : Promise<ResponseObject<ListingDetailed | {}>> {
        const url = this.getUrl('propertyListings', { zip_code: zipCode, number_of_listings });
        let apiListings: ListingDetailed[] = [];
        let mongooseListings: IProperty[] = [];

        try {
            // Attempt to fetch listings from the API
            const response = await axios.get<{
                listings?: ListingDetailed[];
            }>(url);

            apiListings = response.data.listings || [];
        } catch (error: any) {
            return {
                data: {},
                code: 500,
                message: error.message,
            }
        }

        try {
            // Fetch listings from MongoDB
            const mongooseListingRes = await ListingService.getAllListings();
            mongooseListings = mongooseListingRes.data?.filter(l => l.zip_code === zipCode) || [];
        } catch (error: any) {
            return {
                data: {},
                code: 500,
                message: error.message,
            }
        }

        // Ensure equal number of listings from both sources, or fill from one if the other lacks enough
        const halfListings = Math.ceil(number_of_listings / 2); // Half the requested listings (round up)

        const apiCount = apiListings.length;
        const mongooseCount = mongooseListings.length;

        let finalListings: ListingDetailed[];

        // Fetch half from each source if both have enough
        if (apiCount >= halfListings && mongooseCount >= halfListings) {
            finalListings = [
                ...apiListings.slice(0, halfListings),
                ...mongooseListings.slice(0, number_of_listings - halfListings),
            ];
        } else {
            // Calculate the shortfall in one source and compensate with the other
            const apiToTake = Math.min(apiCount, halfListings);
            const mongooseToTake = Math.min(mongooseCount, number_of_listings - apiToTake);

            finalListings = [
                ...apiListings.slice(0, apiToTake),
                ...mongooseListings.slice(0, mongooseToTake),
            ];

            // If still short, fill the remainder with the source that has more
            const remaining = number_of_listings - finalListings.length;
            if (remaining > 0) {
                if (apiCount > apiToTake) {
                    finalListings = [
                        ...finalListings,
                        ...apiListings.slice(apiToTake, apiToTake + remaining),
                    ];
                } else if (mongooseCount > mongooseToTake) {
                    finalListings = [
                        ...finalListings,
                        ...mongooseListings.slice(mongooseToTake, mongooseToTake + remaining),
                    ];
                }
            }
        }

        console.log('Final Listings:', finalListings);
        return {
            code: 200,
            message: "Successfully fetched listings",
            data: finalListings,
        };
    }



    static async fetchPropertyDetails(listingUrl: string) : Promise<ListingDetailed | null> {
        const url = this.getUrl('propertyDetails', { listing_url: listingUrl });

        try {
            const response = await axios.get<{
                listing?: ListingDetailed;
            }>(url);

            if (response.data.listing) {
                let listingDetails = response.data.listing;

                const houseData: HouseDTO = {
                    state: listingDetails.state || "",
                    zip_code: Number(listingDetails.zip_code),
                    acres: listingDetails.land_size || 0,
                    bathrooms: listingDetails.bathrooms || 0,
                    bedrooms: listingDetails.bedrooms || 0,
                    living_space_size: listingDetails.building_size || 0,
                };

                const marketPrice = await InferenceService.getHouseInference(houseData);
                listingDetails.estimated_market_price = Number(marketPrice.data);

                console.log('Fetched Property Details:', response.data.listing);
                return listingDetails;
            } else {
                console.log('No details found for this listing.');
                return null;
            }
        } catch (error) {
            console.error('Error fetching property details:', error);
            throw new Error('Failed to fetch property details.');
        }
    }
}

const mixListingsTypes = (listingsOverview: ListingDetailed[], properties: IProperty[]): IProperty[] => {
    listingsOverview.forEach(listing => {
        properties.push({
            zip_code: listing.zip_code,
            bathrooms: listing.bathrooms,
            url: listing.url,
            bedrooms: listing.bedrooms,
            property_id: listing.property_id,
            images: listing.images,
            description: listing.description,
            prices: listing.prices,
            property_type: listing.property_type,
            address: listing.address,
            city: listing.city,
            state: listing.state,
            building_size: listing.building_size,
            land_size: listing.land_size
        })
    })

    return listingsOverview;
}

export default RealtorApi;