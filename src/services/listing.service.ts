import ResponseObject from "../interfaces/response.interface";
import User from "../models/user.model";
import ListingDetailed from "../payloads/dto/listingDetailed.dto";
import CreateListingDTO from "../payloads/dto/createListing.dto";
import {UserService} from "./users.service"
import mongoose from "mongoose";


export default class ListingService {

    public static async getAllListings(): Promise<ResponseObject<ListingDetailed[] | null>> {
        try {
            const users = await User.find({}, 'listings');
            const listings = users.flatMap(u => u.listings ?? []);

            if (listings === undefined || listings.length === 0) {
                return {
                    code: 500,
                    message: "Error fetching listings.",
                    data: []
                };
            }

            return {
                code: 200,
                message: "Successfully fetched listings",
                data: listings
            };
        } catch (e: any) {
            return {
                code: 500,
                message: "Error fetching listings.",
                data: null
            };
        }
    }

    public static async createListing(dto: CreateListingDTO) : Promise<ResponseObject<boolean>> {
        try {
            let user = await UserService.getUserByEmail(dto.email.trim()).then((user) => user.data);
            if (!user) {
                return {
                    code: 400,
                    message: "Error adding listing, provided email does not exist.",
                    data: false
                }
            }

            user.listings?.push({
                zip_code: dto.zip_code ?? "",
                bathrooms: dto.bathrooms ?? 0,
                land_size: dto.land_size ?? 0,
                state: dto.state ?? "",
                city: dto.city ?? "",
                building_size: dto.building_size ?? 0,
                property_type: dto.property_type ?? "",
                address: dto.address ?? "",
                property_id: new mongoose.Types.ObjectId().toString(),
                images: dto.images ?? [],
                bedrooms: dto.bedrooms ?? 0,
                url: dto.url ?? "",
                description: dto.description ?? "",
                prices: dto.prices ?? {},
            })

            const resEdit = await UserService.editUser(user);

            if (resEdit.code !== 200) {
                return {
                    code: resEdit.code,
                    data: false,
                    message: resEdit.message
                };
            }

            return  {
                code: 201,
                message: "Created listing",
                data: true
            }
        } catch (e: any) {
            return {
                code: 500,
                message: "Error creating listing.",
                data: false
            };
        }
    }

    public static async getListingById(property_id: string): Promise<ResponseObject<ListingDetailed>> {
        try {
            const listing = await ListingService.getAllListings().then(res => {
                res.data?.filter(u => u.property_id === property_id);
            }).catch(e => {
                return {
                    code: 500,
                    message: "Error fetching listing.",
                    data: {}
                };
            });

            if (!listing) {
                return {
                    code: 404,
                    message: "No listing found.",
                    data: {}
                }
            }

            return listing;
        } catch (e: any) {
            return {
                code: 500,
                message: "Error fetching listing.",
                data: {}
            };
        }
    }

    public static async editListing(dto: CreateListingDTO): Promise<ResponseObject<boolean>> {
        try {
            const user = await UserService.getUserByEmail(dto.email.trim()).then((user) => user.data);

            if (!user || !user.listings) {
                return {
                    code: 404,
                    message: "Error editing listing, provided email does not exist or user has no listings.",
                    data: false
                };
            }

            const index = user.listings.findIndex(l => l.property_id === dto.property_id);

            if (index === -1) {
                return {
                    code: 404,
                    message: "Error editing listing, listing not found.",
                    data: false
                };
            }

            user.listings[index] = {
                ...user.listings[index],
                prices: dto.prices,
                bedrooms: dto.bedrooms ?? 0,
                land_size: dto.land_size ?? 0,
                state: dto.state ?? "",
                city: dto.city ?? "",
                building_size: dto.building_size ?? 0,
                property_type: dto.property_type ?? "",
                address: dto.address ?? "",
                description: dto.description ?? "",
                url: dto.url ?? "",
                images: dto.images ?? [],
                property_id: dto.property_id,
                bathrooms: dto.bathrooms ?? 0,
                zip_code: dto.zip_code ?? ""
            };

            const resEdit = await UserService.editUser(user);

            if (resEdit.code !== 200) {
                return {
                    code: resEdit.code,
                    message: resEdit.message,
                    data: false
                };
            }

            return {
                code: 200,
                message: "Listing edited successfully",
                data: true
            };
        } catch (error) {
            console.error("Error editing listing:", error);
            return {
                code: 500,
                message: "Internal Server Error occurred while editing listing.",
                data: false
            };
        }
    }


    public static async deleteListing(property_id: string): Promise<ResponseObject<boolean>> {
        try {
            const users = await UserService.getAllUsers().then((res) => res.data);

            if (!users || !Array.isArray(users)) {
                return {
                    code: 500,
                    message: "Error deleting listing: Unable to retrieve users.",
                    data: false
                };
            }

            const userIndex = users.findIndex(user => {
                if (!user.listings || !Array.isArray(user.listings)) {
                    return false;
                }
                const listingIndex = user.listings.findIndex(l => l.property_id === property_id);
                return listingIndex !== -1;
            });

            if (userIndex === -1 || !users[userIndex]) {
                return {
                    code: 404,
                    message: `No listing found with property_id ${property_id}`,
                    data: false
                };
            }

            if (!users[userIndex].listings) {
                return {
                    code: 404,
                    message: `No listing found with property_id ${property_id}`,
                    data: false
                };
            }

            // Remove the listing from the user's array
            users[userIndex].listings.splice(users[userIndex].listings.findIndex(l => l.property_id === property_id), 1);

            // Update the user in the database
            const updateUserResult = await UserService.editUser(users[userIndex]);

            if (updateUserResult.code !== 200) {
                return {
                    code: updateUserResult.code,
                    message: updateUserResult.message,
                    data: false
                };
            }

            return {
                code: 204,
                message: "Listing deleted successfully",
                data: true
            };
        } catch (error) {
            console.error("Error deleting listing:", error);
            return {
                code: 500,
                message: "Internal Server Error occurred while deleting listing.",
                data: false
            };
        }
    }


}