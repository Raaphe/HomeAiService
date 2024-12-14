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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var listing_service_ts_1 = require("../services/listing.service.ts");
var inference_service_ts_1 = require("../services/inference.service.ts");
var RealtorApi = /** @class */ (function () {
    function RealtorApi() {
    }
    RealtorApi.getUrl = function (endpoint, params) {
        var url = this.baseUrl + RealtorApi.endpoints[endpoint];
        Object.keys(params).forEach(function (key) {
            url = url.replace("{".concat(key, "}"), String(params[key]));
        });
        return url;
    };
    RealtorApi.fetchPropertiesList = function (zipCode_1) {
        return __awaiter(this, arguments, void 0, function (zipCode, number_of_listings) {
            var url, response, error_1, mongooseListingRes_1, mongooseListings_1, mongooseListingRes, mongooseListings, mongooseCount, apiCount, halfListings, finalListings, error_2;
            var _a, _b, _c, _d;
            if (number_of_listings === void 0) { number_of_listings = 25; }
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        url = this.getUrl('propertyListings', { zip_code: zipCode, number_of_listings: number_of_listings });
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.get(url)];
                    case 2:
                        // Attempt to fetch listings from the API
                        response = _e.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _e.sent();
                        // Handle API fetch errors gracefully
                        console.error('Error fetching from API:', error_1);
                        response = null; // Set response to null if the API call fails
                        return [3 /*break*/, 4];
                    case 4:
                        _e.trys.push([4, 8, , 9]);
                        if (!(!response || !response.data.listings)) return [3 /*break*/, 6];
                        console.log('API call failed or no listings found, returning MongoDB listings if available.');
                        return [4 /*yield*/, listing_service_ts_1.default.getAllListings()];
                    case 5:
                        mongooseListingRes_1 = _e.sent();
                        mongooseListings_1 = (_b = (_a = mongooseListingRes_1.data) === null || _a === void 0 ? void 0 : _a.filter(function (l) { return l.zip_code === zipCode; })) !== null && _b !== void 0 ? _b : [];
                        // Return only MongoDB listings if any exist
                        if (mongooseListings_1.length > 0) {
                            console.log('Returning MongoDB listings:', mongooseListings_1);
                            return [2 /*return*/, mongooseListings_1];
                        }
                        else {
                            console.log('No listings found in MongoDB either.');
                            return [2 /*return*/, []]; // Return empty array if no listings are found
                        }
                        _e.label = 6;
                    case 6: return [4 /*yield*/, listing_service_ts_1.default.getAllListings()];
                    case 7:
                        mongooseListingRes = _e.sent();
                        mongooseListings = (_d = (_c = mongooseListingRes.data) === null || _c === void 0 ? void 0 : _c.filter(function (l) { return l.zip_code === zipCode; })) !== null && _d !== void 0 ? _d : [];
                        mongooseCount = mongooseListings ? mongooseListings.length : 0;
                        apiCount = response.data.listings.length;
                        halfListings = Math.floor(number_of_listings / 2);
                        finalListings = [];
                        if (mongooseCount >= halfListings && apiCount >= halfListings) {
                            // If both sources have enough listings, fetch half from each
                            finalListings = __spreadArray(__spreadArray([], mongooseListings.slice(0, halfListings), true), response.data.listings.slice(0, halfListings), true);
                        }
                        else if (mongooseCount >= halfListings) {
                            // If MongoDB has enough listings, take the remainder from the API
                            finalListings = __spreadArray(__spreadArray([], mongooseListings.slice(0, halfListings), true), response.data.listings.slice(0, number_of_listings - halfListings), true);
                        }
                        else if (apiCount >= halfListings) {
                            // If API has enough listings, take the remainder from MongoDB
                            finalListings = __spreadArray(__spreadArray([], mongooseListings.slice(0, number_of_listings - halfListings), true), response.data.listings.slice(0, halfListings), true);
                        }
                        else {
                            // If both have fewer listings than expected, merge both sources until reaching the number of listings
                            finalListings = __spreadArray(__spreadArray([], mongooseListings.slice(0, mongooseCount), true), response.data.listings.slice(0, number_of_listings - mongooseCount), true);
                        }
                        console.log('Fetched Listings:', finalListings);
                        return [2 /*return*/, finalListings];
                    case 8:
                        error_2 = _e.sent();
                        console.error('Error processing property listings:', error_2);
                        throw new Error('Failed to process property listings.');
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    RealtorApi.fetchPropertyDetails = function (listingUrl) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, listingDetails, houseData, marketPrice, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.getUrl('propertyDetails', { listing_url: listingUrl });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, axios_1.default.get(url)];
                    case 2:
                        response = _a.sent();
                        if (!response.data.listing) return [3 /*break*/, 4];
                        listingDetails = response.data.listing;
                        houseData = {
                            state: listingDetails.state || "",
                            zip_code: Number(listingDetails.zip_code),
                            acres: listingDetails.land_size || 0,
                            bathrooms: listingDetails.bathrooms || 0,
                            bedrooms: listingDetails.bedrooms || 0,
                            living_space_size: listingDetails.building_size || 0,
                        };
                        return [4 /*yield*/, inference_service_ts_1.default.getHouseInference(houseData)];
                    case 3:
                        marketPrice = _a.sent();
                        listingDetails.estimated_market_price = Number(marketPrice.data);
                        console.log('Fetched Property Details:', response.data.listing);
                        return [2 /*return*/, listingDetails];
                    case 4:
                        console.log('No details found for this listing.');
                        return [2 /*return*/, null];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        console.error('Error fetching property details:', error_3);
                        throw new Error('Failed to fetch property details.');
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    RealtorApi.baseUrl = "https://real-estate-api-xi.vercel.app";
    RealtorApi.endpoints = {
        propertyListings: "/listings?zip_code={zip_code}&listings={number_of_listings}",
        propertyDetails: "/listing_detail?listing_url={listing_url}"
    };
    return RealtorApi;
}());
exports.default = RealtorApi;
