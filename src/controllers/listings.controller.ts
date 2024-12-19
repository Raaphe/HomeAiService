import { Request, Response } from 'express';
import CreateListingDTO from "../payloads/dto/createListing.dto";
import ListingService from "../services/listing.service";
import { EditListingDto } from '../payloads/dto/editListing.dto';

export class ListingsController {
    static async CreateListing(req: Request, res: Response): Promise<Response> {
        try {
            const dto: CreateListingDTO = req.body;

            if (!dto.email) {
                return res.status(400).json({
                    code: 400,
                    message: "Email is required",
                    data: false,
                });
            }

            const result = await ListingService.createListing(dto);
            return res.status(result.code).json(result);
        } catch (error: any) {
            console.error('Error in createListing:', error.message);

            return res.status(500).json({
                code: 500,
                message: "Internal Server Error",
                data: false,
            });
        }
    }

    static async GetListingById(req: Request, res: Response): Promise<Response> {
        try {
            const listingId = req.params.id;
            if (!listingId) {
                return res.status(400).json({
                    code: 400,
                    message: "Listing ID is required",
                    data: false,
                });
            }

            const result = await ListingService.getListingById(listingId);
            if (result.code === 404) {
                return res.status(result.code).json(result);
            }

            return res.status(result.code).json(result);
        } catch (error: any) {
            console.error('Error in getListingById:', error.message);

            return res.status(500).json({
                code: 500,
                message: "Internal Server Error",
                data: false,
            });
        }
    }

    static async UpdateListing(req: Request, res: Response): Promise<Response> {
        try {
            const dto: EditListingDto = req.body;

            if (!req.body.property_id) {
                return res.status(400).json({
                    code: 400,
                    message: "Listing ID is required",
                    data: false,
                });
            }

            const result = await ListingService.editListing(dto);
            if (result.code === 404) {
                return res.status(result.code).json(result);
            }

            return res.status(result.code).json(result);
        } catch (error: any) {
            console.error('Error in updateListing:', error.message);

            return res.status(500).json({
                code: 500,
                message: "Internal Server Error",
                data: false,
            });
        }
    }

    static async DeleteListing(req: Request, res: Response): Promise<Response> {
        try {
            const listingId = req.params.id;

            if (!listingId) {
                return res.status(400).json({
                    code: 400,
                    message: "Listing ID is required",
                    data: false,
                });
            }

            const result = await ListingService.deleteListing(listingId);
            if (result.code === 404) {
                return res.status(result.code).json(result);
            }

            return res.status(result.code).json(result);
        } catch (error: any) {
            console.error('Error in deleteListing:', error.message);

            return res.status(500).json({
                code: 500,
                message: "Internal Server Error",
                data: false,
            });
        }
    }

    static async GetAllListings(req: Request, res: Response): Promise<Response> {
        try {
            const result = await ListingService.getAllListings();
            return res.status(result.code).json(result);
        } catch (error: any) {
            console.error('Error in getAllListings:', error.message);

            return res.status(500).json({
                code: 500,
                message: "Internal Server Error",
                data: false,
            });
        }
    }
}
