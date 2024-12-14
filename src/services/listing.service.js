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
var user_model_ts_1 = require("../models/user.model.ts");
var users_service_ts_1 = require("./users.service.ts");
var ListingService = /** @class */ (function () {
    function ListingService() {
    }
    ListingService.getAllListings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var users, listings, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, user_model_ts_1.default.find({}, 'listings')];
                    case 1:
                        users = _a.sent();
                        listings = users.flatMap(function (u) { var _a; return (_a = u.listings) !== null && _a !== void 0 ? _a : []; });
                        if (listings === undefined || listings.length === 0) {
                            return [2 /*return*/, {
                                    code: 500,
                                    message: "Error fetching listings.",
                                    data: []
                                }];
                        }
                        return [2 /*return*/, {
                                code: 200,
                                message: "Successfully fetched listings",
                                data: listings
                            }];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, {
                                code: 500,
                                message: "Error fetching listings.",
                                data: null
                            }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ListingService.createListing = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, resEdit, e_2;
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0:
                        _r.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, users_service_ts_1.UserService.getUserByEmail(dto.email.trim()).then(function (user) { return user.data; })];
                    case 1:
                        user = _r.sent();
                        if (!user) {
                            return [2 /*return*/, {
                                    code: 400,
                                    message: "Error adding listing, provided email does not exist.",
                                    data: false
                                }];
                        }
                        (_a = user.listings) === null || _a === void 0 ? void 0 : _a.push({
                            zip_code: (_b = dto.zip_code) !== null && _b !== void 0 ? _b : "",
                            bathrooms: (_c = dto.bathrooms) !== null && _c !== void 0 ? _c : 0,
                            land_size: (_d = dto.land_size) !== null && _d !== void 0 ? _d : 0,
                            state: (_e = dto.state) !== null && _e !== void 0 ? _e : "",
                            city: (_f = dto.city) !== null && _f !== void 0 ? _f : "",
                            building_size: (_g = dto.building_size) !== null && _g !== void 0 ? _g : 0,
                            property_type: (_h = dto.property_type) !== null && _h !== void 0 ? _h : "",
                            address: (_j = dto.address) !== null && _j !== void 0 ? _j : "",
                            property_id: (_k = dto.property_id) !== null && _k !== void 0 ? _k : "",
                            images: (_l = dto.images) !== null && _l !== void 0 ? _l : [],
                            bedrooms: (_m = dto.bedrooms) !== null && _m !== void 0 ? _m : 0,
                            url: (_o = dto.url) !== null && _o !== void 0 ? _o : "",
                            description: (_p = dto.description) !== null && _p !== void 0 ? _p : "",
                            prices: (_q = dto.prices) !== null && _q !== void 0 ? _q : {},
                        });
                        return [4 /*yield*/, users_service_ts_1.UserService.editUser(user)];
                    case 2:
                        resEdit = _r.sent();
                        if (resEdit.code !== 200) {
                            return [2 /*return*/, {
                                    code: resEdit.code,
                                    data: false,
                                    message: resEdit.message
                                }];
                        }
                        return [2 /*return*/, {
                                code: 201,
                                message: "Created listing",
                                data: true
                            }];
                    case 3:
                        e_2 = _r.sent();
                        return [2 /*return*/, {
                                code: 500,
                                message: "Error creating listing.",
                                data: false
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return ListingService;
}());
exports.default = ListingService;
