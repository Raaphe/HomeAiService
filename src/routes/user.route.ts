import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

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
router.get('/users', userController.getAllUsers);

export default router;
