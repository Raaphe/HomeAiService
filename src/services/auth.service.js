"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var config_ts_1 = require("../config/config.ts");
var logger_util_ts_1 = require("../utils/logger.util.ts");
var user_model_ts_1 = require("../models/user.model.ts");
var mongoose_1 = require("mongoose");
var roles_enum_ts_1 = require("../models/roles.enum.ts");
var users_service_ts_1 = require("./users.service.ts");
var bcryptjs_1 = require("bcryptjs");
var AuthService = /** @class */ (function () {
    function AuthService() {
    }
    AuthService.register = function (registrationDto) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, token, e_1;
            var _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 3, , 4]);
                        _b = (_a = user_model_ts_1.default).create;
                        _c = {
                            _id: new mongoose_1.default.Types.ObjectId(),
                            listings: [],
                            first_name: registrationDto.first_name,
                            last_name: registrationDto.last_name,
                            company: registrationDto.company_name,
                            email: registrationDto.username
                        };
                        return [4 /*yield*/, bcryptjs_1.default.hash(registrationDto.password, this.saltRounds)];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.password = _e.sent(),
                                _c.role = roles_enum_ts_1.default.Guest,
                                _c)])];
                    case 2:
                        _e.sent();
                        token = jsonwebtoken_1.default.sign({ username: registrationDto.username }, (_d = config_ts_1.config.JWT_SECRET) !== null && _d !== void 0 ? _d : "", { expiresIn: '1h' });
                        return [2 /*return*/, {
                                code: 201,
                                data: token,
                                message: "Successfully Registered."
                            }];
                    case 3:
                        e_1 = _e.sent();
                        logger_util_ts_1.loggerUtil.error("Error in register method: ".concat(e_1.message), e_1);
                        return [2 /*return*/, {
                                code: 400,
                                data: "",
                                message: e_1.message || 'An error occurred during registration',
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.authenticate = function (loginDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, isValidPassword, token;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, users_service_ts_1.UserService.getAllUsers()];
                    case 1:
                        user = (_a = (_c.sent()).data) === null || _a === void 0 ? void 0 : _a.findLast(function (u) { return u.email === loginDto.username; });
                        if (!user) {
                            return [2 /*return*/, { code: 400, message: 'Utilisateur non trouvé', data: "" }];
                        }
                        return [4 /*yield*/, bcryptjs_1.default.compare(loginDto.password.trim(), user.password)];
                    case 2:
                        isValidPassword = _c.sent();
                        if (!isValidPassword) {
                            return [2 /*return*/, { code: 400, message: 'Mot de passe incorrect', data: "" }];
                        }
                        token = jsonwebtoken_1.default.sign({ username: user.email }, (_b = config_ts_1.config.JWT_SECRET) !== null && _b !== void 0 ? _b : "", { expiresIn: '1h' });
                        return [2 /*return*/, {
                                code: 200,
                                message: "Logged in Successfully",
                                data: token,
                            }];
                }
            });
        });
    };
    AuthService.saltRounds = 10;
    return AuthService;
}());
exports.AuthService = AuthService;
