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
exports.runDatasetUpdate = runDatasetUpdate;
var axios_1 = require("axios");
var fs_1 = require("fs");
var path_1 = require("path");
var unzipper_1 = require("unzipper");
var config_ts_1 = require("../config/config.ts");
function updateDataset(datasetPath) {
    return __awaiter(this, void 0, void 0, function () {
        var datasetUrl, dataPath, zipPath, response_1, files, _i, files_1, file, oldFilePath, newFilePath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    datasetUrl = "https://www.kaggle.com/api/v1/datasets/download/ahmedshahriarsakib/usa-real-estate-dataset";
                    dataPath = path_1.default.join(__dirname, datasetPath);
                    zipPath = path_1.default.join(dataPath, 'dataset.zip');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!fs_1.default.existsSync(dataPath)) {
                        fs_1.default.mkdirSync(dataPath, { recursive: true });
                    }
                    console.log('Downloading dataset...');
                    return [4 /*yield*/, (0, axios_1.default)({
                            method: 'get',
                            url: datasetUrl,
                            responseType: 'stream',
                            auth: {
                                username: config_ts_1.config.KAGGLE_USERNAME,
                                password: config_ts_1.config.KAGGLE_KEY,
                            },
                        })];
                case 2:
                    response_1 = _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var fileStream = fs_1.default.createWriteStream(zipPath);
                            response_1.data.pipe(fileStream);
                            fileStream.on('finish', resolve);
                            fileStream.on('error', reject);
                        })];
                case 3:
                    _a.sent();
                    console.log('Dataset downloaded successfully. Extracting...');
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            fs_1.default.createReadStream(zipPath)
                                .pipe(unzipper_1.default.Extract({ path: dataPath }))
                                .on('close', resolve)
                                .on('error', reject);
                        })];
                case 4:
                    _a.sent();
                    console.log('Dataset extracted successfully.');
                    files = fs_1.default.readdirSync(dataPath);
                    for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                        file = files_1[_i];
                        oldFilePath = path_1.default.join(dataPath, file);
                        if (fs_1.default.lstatSync(oldFilePath).isFile() && file !== 'dataset.zip') {
                            newFilePath = path_1.default.join(dataPath, "realtor-data.zip.csv");
                            fs_1.default.renameSync(oldFilePath, newFilePath);
                            console.log("Renamed ".concat(file, " to renamed_").concat(file));
                        }
                    }
                    fs_1.default.unlinkSync(zipPath);
                    console.log('Temporary ZIP file deleted.');
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error during dataset update: ".concat(error_1.message));
                    if (fs_1.default.existsSync(zipPath)) {
                        fs_1.default.unlinkSync(zipPath);
                    }
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function runDatasetUpdate() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, updateDataset('../data/datasets')];
                case 1:
                    _a.sent();
                    console.log('Dataset update job completed successfully');
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error updating dataset:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
