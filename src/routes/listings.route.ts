import {Router} from "express";
import { ListingsController } from "../controllers/listings.controller";

const router = Router();

/**
 * @swagger
 * /listing:
 *   post:
 *     tags:
 *       - Listings
 *     summary: Create a new listing for a user
 *     description: Adds a new property listing to a user's profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/CreateListingDTO"
 *     responses:
 *       "201":
 *         description: Listing created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Created listing"
 *                 data:
 *                   type: boolean
 *                   example: true
 *       "400":
 *         description: Bad Request - Missing required fields or email not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Error adding listing, provided email does not exist."
 *                 data:
 *                   type: boolean
 *                   example: false
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Error creating listing."
 *                 data:
 *                   type: boolean
 *                   example: false
 */
router.post("/listing", ListingsController.CreateListing)


/**
 * @swagger
 * /listings:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Retrieve all listings
 *     description: Fetches all the property listings from the system.
 *     responses:
 *       "200":
 *         description: Listings fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Successfully fetched listings"
 *                 data:
 *                   type: array
 *                   items:
 *                      $ref: "#/components/schemas/IProperty"
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Error fetching listings."
 *                 data:
 *                   type: null
 */
router.get("/listings", ListingsController.GetAllListings);

/**
 * @swagger
 * /listing/{id}:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Get a specific listing by ID
 *     description: Retrieves a specific property listing using its unique identifier.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the listing.
 *     responses:
 *       "200":
 *         description: Listing retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Listing fetched successfully"
 *                 data:
 *                   $ref: "#/components/schemas/ListingDetailed"
 *       "404":
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No listing found."
 *                 data:
 *                   type: object
 *                   example: {}
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Error fetching listing."
 *                 data:
 *                   type: null
 */
router.get("/listing/:id", ListingsController.GetListingById);

/**
 * @swagger
 * /listing:
 *   put:
 *     tags:
 *       - Listings
 *     summary: Edit an existing listing
 *     description: Updates an existing property listing with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              $ref: "#/components/schemas/CreateListingDTO"
 *     responses:
 *       "200":
 *         description: Listing updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Listing edited successfully"
 *                 data:
 *                   type: boolean
 *                   example: true
 *       "404":
 *         description: Listing or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Error editing listing, provided email does not exist or user has no listings."
 *                 data:
 *                   type: boolean
 *                   example: false
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Error editing listing."
 *                 data:
 *                   type: boolean
 *                   example: false
 */
router.put("/listing", ListingsController.UpdateListing);

/**
 * @swagger
 * /listing/{id}:
 *   delete:
 *     tags:
 *       - Listings
 *     summary: Delete a listing by its ID
 *     description: Deletes a specific listing from the database using the provided listing ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the listing to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Listing successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Listing deleted successfully"
 *                 data:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid listing ID or bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Listing ID is required"
 *                 data:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Listing not found"
 *                 data:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 data:
 *                   type: boolean
 *                   example: false
 */
router.delete("/listing/:id", ListingsController.DeleteListing);

export default router;