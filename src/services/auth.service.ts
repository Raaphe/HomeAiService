import jwt from 'jsonwebtoken';
import RegistrationDTO from '../payloads/dto/register.dto';
import LoginDTO from '../payloads/dto/login.dto';
import { verifyPassword } from '../utils/security.util';
import { config } from "../config/config"
import { loggerUtil } from '../utils/logger.util';
import ResponseObject from '../interfaces/response.interface';
import User from '../models/user.model';
import mongoose from 'mongoose';
import Role from '../models/roles.enum';
import { UserService } from './users.service';
import bcrypt from "bcryptjs";

export class AuthService {

    private static saltRounds = 10;

    static async register(registrationDto: RegistrationDTO): Promise<ResponseObject<string>> {
        try {
            await User.create({
                listings: [],
                first_name: registrationDto.first_name,
                last_name: registrationDto.last_name,
                company: registrationDto.company_name,
                email: registrationDto.username,
                password: await bcrypt.hash(registrationDto.password, this.saltRounds),
                role: Role.Guest
            });

            const token = jwt.sign({ username: registrationDto.username }, config.JWT_SECRET ?? "", { expiresIn: '1h' });

            return {
                code: 201,
                data: token,
                message: "Successfully Registered."
            };
        } catch (e: any) {
            loggerUtil.error(`Error in register method: ${e.message}`, e);
            return {
                code: 400,
                data: "",
                message: e.message || 'An error occurred during registration',
            };
        }
    }
    

    static async authenticate(loginDto: LoginDTO) : Promise<ResponseObject<string>> {
        const user = (await UserService.getAllUsers()).data?.findLast(u => u.email === loginDto.username);

        if (!user) {
            return {code : 400, message: 'Utilisateur non trouvé', data:""}
        }

        const isValidPassword = await bcrypt.compare(loginDto.password.trim(), user.password);
        if (!isValidPassword) {
            return {code : 400, message: 'Mot de passe incorrect', data: ""}
        }

        // Génération d'un JWT
        const token = jwt.sign({ username: user.email }, config.JWT_SECRET ?? "", { expiresIn: '1h' });
        return {
            code: 200,
            message: "Logged in Successfully",
            data: token,
        }
    }
}