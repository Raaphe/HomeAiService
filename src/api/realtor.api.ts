import { ListingOverview } from "../payloads/dto/listing.dto";
import  ListingDetailed from "../payloads/dto/listingDetailed.dto";
import axios from "axios";
import ListingService from "../services/listing.service";
import InferenceService from "../services/inference.service";
import HouseDTO from "../payloads/dto/houseInfo.dto";

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

    static async fetchPropertiesList(zipCode: string, number_of_listings: number = 25) {
        const url = this.getUrl('propertyListings', { zip_code: zipCode, number_of_listings });
        let apiListings: ListingOverview[] = [];
        let mongooseListings: ListingOverview[] = [];

        try {
            // Attempt to fetch listings from the API
            const response = await axios.get<{
                listings?: ListingOverview[];
            }>(url);

            apiListings = response.data.listings || [];
        } catch (error) {
            console.error('Error fetching from API:', error);
        }

        try {
            // Fetch listings from MongoDB
            const mongooseListingRes = await ListingService.getAllListings();
            mongooseListings = mongooseListingRes.data?.filter(l => l.zip_code === zipCode) || [];
        } catch (error) {
            console.error('Error fetching from MongoDB:', error);
        }

        // Ensure equal number of listings from both sources, or fill from one if the other lacks enough
        const halfListings = Math.ceil(number_of_listings / 2); // Half the requested listings (round up)

        const apiCount = apiListings.length;
        const mongooseCount = mongooseListings.length;

        let finalListings: ListingOverview[];

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
        return finalListings;
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

export default RealtorApi;