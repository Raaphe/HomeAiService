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
exports.SoldPropertyService = void 0;
var fs_1 = require("fs");
var csv_parser_1 = require("csv-parser");
var path_1 = require("path");
var SoldPropertyService = /** @class */ (function () {
    function SoldPropertyService() {
    }
    SoldPropertyService.prototype.getProperties = function () {
        return this.properties;
    };
    SoldPropertyService.prototype.arePropertiesLoaded = function () {
        return !!this.properties && this.properties.length > 0;
    };
    SoldPropertyService.prototype.loadProperties = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var properties;
            var _this = this;
            return __generator(this, function (_a) {
                properties = [];
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        fs_1.default.createReadStream(filePath)
                            .pipe((0, csv_parser_1.default)())
                            .on('data', function (row) {
                            var property = _this.parseProperty(row);
                            if (property)
                                properties.push(property);
                        })
                            .on('end', function () {
                            _this.properties = properties;
                            console.log('Properties loaded successfully');
                            resolve();
                        })
                            .on('error', function (error) {
                            console.error('Error reading CSV file:', error);
                            reject(error);
                        });
                    })];
            });
        });
    };
    SoldPropertyService.prototype.parseProperty = function (row) {
        var price = parseFloat(row.price);
        var bed = parseInt(row.bed);
        var bath = parseInt(row.bath);
        var acreLot = parseFloat(row.acre_lot);
        var street = parseInt(row.street);
        var houseSize = parseFloat(row.house_size);
        var prevSoldDate = row.prev_sold_data ? new Date(row.prev_sold_data) : this.generateRandomDate();
        if (this.isValidProperty(price, bed, bath, acreLot, street, row)) {
            return {
                price: price,
                bed: bed,
                bath: bath,
                acre_lot: acreLot,
                street: street,
                city: row.city.trim(),
                state: row.state.trim(),
                zip_code: row.zip_code.trim(),
                house_size: houseSize > 0 ? houseSize : undefined,
                prev_sold_data: prevSoldDate,
            };
        }
        return null;
    };
    SoldPropertyService.prototype.isValidProperty = function (price, bed, bath, acreLot, street, row) {
        return !isNaN(price) && price > 0 &&
            !isNaN(bed) && bed > 0 && bed < 15 &&
            !isNaN(bath) && bath > 0 && bath < 15 &&
            !isNaN(acreLot) && acreLot > 0 &&
            !isNaN(street) && street > 0 &&
            row.city && row.city.trim() !== '' &&
            row.state && row.state.trim() !== '' &&
            row.zip_code && row.zip_code.trim() !== '';
    };
    SoldPropertyService.prototype.generateRandomDate = function () {
        var start = new Date(1950, 0, 1).getTime();
        var end = Date.now();
        return new Date(start + Math.random() * (end - start));
    };
    SoldPropertyService.prototype.getPropertiesBySize = function (numberOfBins) {
        if (numberOfBins === void 0) { numberOfBins = 5; }
        if (!this.arePropertiesLoaded()) {
            throw new Error("SoldPropertyService is not ready or properties are not loaded yet.");
        }
        var allProperties = this.getProperties();
        if (!allProperties || allProperties.length === 0) {
            return [];
        }
        var houseSizes = allProperties
            .map(function (property) { return property.house_size; })
            .filter(function (size) { return typeof size === 'number' && !isNaN(size) && size > 0; });
        if (houseSizes.length === 0) {
            return [];
        }
        var minSize = houseSizes.reduce(function (min, size) { return Math.min(min, size); }, Number.POSITIVE_INFINITY);
        var maxSize = houseSizes.reduce(function (max, size) { return Math.max(max, size); }, Number.NEGATIVE_INFINITY);
        var binSize = (maxSize - minSize) / numberOfBins;
        var bins = [];
        var _loop_1 = function (i) {
            var lowerBound = minSize + i * binSize;
            var upperBound = i === numberOfBins - 1 ? maxSize : lowerBound + binSize;
            var count = houseSizes.filter(function (size) { return size >= lowerBound && (i === numberOfBins - 1 ? size <= upperBound : size < upperBound); }).length;
            bins.push({
                min: lowerBound,
                max: upperBound,
                count: count,
            });
        };
        for (var i = 0; i < numberOfBins; i++) {
            _loop_1(i);
        }
        return bins;
    };
    SoldPropertyService.prototype.getAveragePriceByBedrooms = function () {
        var properties = this === null || this === void 0 ? void 0 : this.getProperties();
        if (!properties)
            return [];
        var pricesByBedrooms = {};
        properties.forEach(function (property) {
            if (property.bed) {
                pricesByBedrooms[property.bed] = pricesByBedrooms[property.bed] || [];
                pricesByBedrooms[property.bed].push(property.price || 0);
            }
        });
        return Object.entries(pricesByBedrooms).map(function (_a) {
            var bed = _a[0], prices = _a[1];
            var averagePrice = prices.reduce(function (sum, price) { return sum + price; }, 0) / prices.length;
            return { bed: parseInt(bed), averagePrice: averagePrice };
        });
    };
    SoldPropertyService.prototype.getAveragePriceByBathrooms = function () {
        var properties = this === null || this === void 0 ? void 0 : this.getProperties();
        if (!properties)
            return [];
        var pricesByBathrooms = {};
        properties.forEach(function (property) {
            if (property.bath) {
                pricesByBathrooms[property.bath] = pricesByBathrooms[property.bath] || [];
                pricesByBathrooms[property.bath].push(property.price || 0);
            }
        });
        return Object.entries(pricesByBathrooms).map(function (_a) {
            var bath = _a[0], prices = _a[1];
            var averagePrice = prices.reduce(function (sum, price) { return sum + price; }, 0) / prices.length;
            return { bath: parseInt(bath), averagePrice: averagePrice };
        });
    };
    SoldPropertyService.prototype.getPropertyCountByState = function () {
        var properties = this === null || this === void 0 ? void 0 : this.getProperties();
        if (!properties)
            return [];
        var countByState = {};
        properties.forEach(function (property) {
            if (property.state) {
                countByState[property.state] = (countByState[property.state] || 0) + 1;
            }
        });
        return Object.entries(countByState).map(function (_a) {
            var state = _a[0], count = _a[1];
            return ({ state: state, count: count });
        });
    };
    SoldPropertyService.prototype.getAveragePriceByState = function () {
        var properties = this === null || this === void 0 ? void 0 : this.getProperties();
        if (!properties)
            return [];
        var pricesByState = {};
        properties.forEach(function (property) {
            if (property.state && property.price) {
                pricesByState[property.state] = pricesByState[property.state] || [];
                pricesByState[property.state].push(property.price);
            }
        });
        return Object.entries(pricesByState).map(function (_a) {
            var state = _a[0], prices = _a[1];
            var averagePrice = prices.reduce(function (sum, price) { return sum + price; }, 0) / prices.length;
            return { state: state, averagePrice: averagePrice };
        });
    };
    SoldPropertyService.prototype.getSalesByYear = function () {
        var properties = this === null || this === void 0 ? void 0 : this.getProperties();
        if (!properties)
            return [];
        var salesByYear = {};
        properties.forEach(function (property) {
            var _a;
            var year = (_a = property.prev_sold_data) === null || _a === void 0 ? void 0 : _a.getFullYear().toString();
            if (year) {
                salesByYear[year] = (salesByYear[year] || 0) + 1;
            }
        });
        return Object.entries(salesByYear)
            .sort(function (_a, _b) {
            var a = _a[0];
            var b = _b[0];
            return parseInt(a) - parseInt(b);
        })
            .map(function (_a) {
            var year = _a[0], count = _a[1];
            return ({ year: year, count: count });
        });
    };
    SoldPropertyService.prototype.getPriceRangeByState = function () {
        var properties = this === null || this === void 0 ? void 0 : this.getProperties();
        if (!properties)
            return [];
        var priceRangeByState = {};
        properties.forEach(function (property) {
            if (property.state && property.price) {
                if (!priceRangeByState[property.state]) {
                    priceRangeByState[property.state] = { min: property.price, max: property.price };
                }
                else {
                    priceRangeByState[property.state].min = Math.min(priceRangeByState[property.state].min, property.price);
                    priceRangeByState[property.state].max = Math.max(priceRangeByState[property.state].max, property.price);
                }
            }
        });
        return Object.entries(priceRangeByState).map(function (_a) {
            var state = _a[0], range = _a[1];
            return ({
                state: state,
                minPrice: range.min,
                maxPrice: range.max
            });
        });
    };
    SoldPropertyService.prototype.writeGraphFunctionsToFile = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var data, filePath;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this || !this.arePropertiesLoaded()) {
                            throw new Error("SoldPropertyService is not ready or properties are not loaded yet.");
                        }
                        console.log("Got into writing graph function");
                        data = {
                            priceRangeByState: this.getPriceRangeByState(),
                            averagePriceByState: this.getAveragePriceByState(),
                            propertyCountByState: this.getPropertyCountByState(),
                            propertyCountBySize: this.getPropertiesBySize(),
                            averagePriceByBedrooms: this.getAveragePriceByBedrooms(),
                            averagePriceByBathrooms: this.getAveragePriceByBathrooms(),
                            salesByYear: this.getSalesByYear(),
                        };
                        filePath = path_1.default.join(__dirname, relativePath);
                        return [4 /*yield*/, fs_1.default.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')];
                    case 1:
                        _a.sent();
                        console.log("Graph functions written successfully.");
                        return [2 /*return*/];
                }
            });
        });
    };
    SoldPropertyService.prototype.readPriceRangeByStateFromFile = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, parsedData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path_1.default.join(__dirname, relativePath);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_1.default.promises.readFile(filePath, 'utf8')];
                    case 2:
                        data = _a.sent();
                        parsedData = JSON.parse(data);
                        return [2 /*return*/, parsedData.priceRangeByState || []];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error reading price range by state data from file:", error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SoldPropertyService.prototype.readAveragePriceByStateFromFile = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, parsedData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path_1.default.join(__dirname, relativePath);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_1.default.promises.readFile(filePath, 'utf8')];
                    case 2:
                        data = _a.sent();
                        parsedData = JSON.parse(data);
                        return [2 /*return*/, parsedData.averagePriceByState || []];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Error reading average price by state data from file:", error_2);
                        throw error_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SoldPropertyService.prototype.readPropertyCountByStateFromFile = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, parsedData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path_1.default.join(__dirname, relativePath);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_1.default.promises.readFile(filePath, 'utf8')];
                    case 2:
                        data = _a.sent();
                        parsedData = JSON.parse(data);
                        return [2 /*return*/, parsedData.propertyCountByState || []];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Error reading property count by state data from file:", error_3);
                        throw error_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SoldPropertyService.prototype.readPropertyCountBySizeFromFile = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, parsedData, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path_1.default.join(__dirname, relativePath);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_1.default.promises.readFile(filePath, 'utf8')];
                    case 2:
                        data = _a.sent();
                        parsedData = JSON.parse(data);
                        return [2 /*return*/, parsedData.propertyCountBySize || []];
                    case 3:
                        error_4 = _a.sent();
                        console.error("Error reading property count by size data from file:", error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SoldPropertyService.prototype.readAveragePriceByBedroomsFromFile = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, parsedData, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path_1.default.join(__dirname, relativePath);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_1.default.promises.readFile(filePath, 'utf8')];
                    case 2:
                        data = _a.sent();
                        parsedData = JSON.parse(data);
                        return [2 /*return*/, parsedData.averagePriceByBedrooms || []];
                    case 3:
                        error_5 = _a.sent();
                        console.error("Error reading average price by bedrooms data from file:", error_5);
                        throw error_5;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SoldPropertyService.prototype.readAveragePriceByBathroomsFromFile = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, parsedData, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path_1.default.join(__dirname, relativePath);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_1.default.promises.readFile(filePath, 'utf8')];
                    case 2:
                        data = _a.sent();
                        parsedData = JSON.parse(data);
                        return [2 /*return*/, parsedData.averagePriceByBathrooms || []];
                    case 3:
                        error_6 = _a.sent();
                        console.error("Error reading average price by bathrooms data from file:", error_6);
                        throw error_6;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SoldPropertyService.prototype.readSalesByYearFromFile = function (relativePath) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, data, parsedData, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filePath = path_1.default.join(__dirname, relativePath);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs_1.default.promises.readFile(filePath, 'utf8')];
                    case 2:
                        data = _a.sent();
                        parsedData = JSON.parse(data);
                        return [2 /*return*/, parsedData.salesByYear || []];
                    case 3:
                        error_7 = _a.sent();
                        console.error("Error reading sales by year data from file:", error_7);
                        throw error_7;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return SoldPropertyService;
}());
exports.SoldPropertyService = SoldPropertyService;
