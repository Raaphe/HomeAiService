import { Request, Response } from 'express';
import { UserService } from '../services/users.service';

export class UserController {

    static async getUserByJwt(req: Request, res: Response): Promise<Response> {
        try {
            const token = req.params.token;
            if (!token) {
                return res.status(400).json({
                    code: 400,
                    message: "token is required",
                    data: {},
                });
            }

            var user = await UserService.getUserFromJWT(token);
            if (!user || !user.data) {
                return res.status(user.code).json(user)
            }

            return res.status(user.code).json(user);
        } catch (error:any) {
            return res.status(500).json({
              code: 500,
              message: error.message,
              data: {},
            });
        }

    }

    static async getAllUsers(req: Request, res: Response): Promise<Response> {
        const users = await UserService.getAllUsers();
        return res.json(users);
    }
}