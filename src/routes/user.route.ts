import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Retrieve a list of users
 *     security: []
 *     description: Retrieve a list of users from the API. Can be used to populate a list of users in your system.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: "#/components/schemas/IUser"
 *       400:
 *         description: Invalid input, please check the request format.
 *       404:
 *         description: No users found.
 *       500:
 *         description: Internal server error.
 */
router.get('/users', UserController.getAllUsers);

/**
 * @swagger
 * /user/{token}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Gets a user by a valid token.
 *     security: []
 *     description: Retrieves a specific user from values in an access token.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT
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
 *                   $ref: "#/components/schemas/IUser"
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
router.get("/user/:token", UserController.getUserByJwt)

export default router;
