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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
var app_ts_1 = require("./app.ts");
require("dotenv/config");
var mongoose_1 = require("mongoose");
var config_ts_1 = require("./config/config.ts");
var logger_util_ts_1 = require("./utils/logger.util.ts");
var https_1 = require("https");
var fs_1 = require("fs");
var path_1 = require("path");
var inference_ts_1 = require("./inference/inference.ts");
var security_util_ts_1 = require("./utils/security.util.ts");
var IP_ADDR = (0, security_util_ts_1.getLocalIPAddres)();
var port = config_ts_1.config.PORT || 3000;
var CLUSTER_URL = config_ts_1.config.CLUSTER_URL || "";
var CLUSTER_URL_TEST = config_ts_1.config.CLUSTER_URL_TEST || "";
var TEST_DB_NAME = config_ts_1.config.TEST_DB_NAME;
var DB_NAME = config_ts_1.config.DB_NAME;
var run = function () { return __awaiter(void 0, void 0, void 0, function () {
    var connectOptions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(config_ts_1.config.ENV === "test")) return [3 /*break*/, 2];
                connectOptions = {
                    dbName: TEST_DB_NAME,
                    serverApi: { version: "1", deprecationErrors: true, strict: true }
                };
                return [4 /*yield*/, (0, mongoose_1.connect)(CLUSTER_URL_TEST, connectOptions)];
            case 1:
                _a.sent();
                logger_util_ts_1.loggerUtil.info("CONNECTING TO ".concat(CLUSTER_URL_TEST));
                return [3 /*break*/, 4];
            case 2:
                connectOptions = {
                    dbName: DB_NAME,
                    serverApi: { version: "1", deprecationErrors: true, strict: true }
                };
                return [4 /*yield*/, (0, mongoose_1.connect)(CLUSTER_URL, connectOptions)];
            case 3:
                _a.sent();
                logger_util_ts_1.loggerUtil.info("CONNECTING TO ".concat(CLUSTER_URL));
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
run().catch(function (err) { return logger_util_ts_1.loggerUtil.error('Error running server:', err); });
var db = mongoose_1.default.connection;
db.on("error", console.error.bind(console, "Connection error to mongo db"));
db.once('open', function () {
    console.log('=== Connected to MongoDb Collection ===');
});
if (config_ts_1.config.ENV === "production") {
    app_ts_1.default.listen(port, function () {
        console.log("Server is running on http://0.0.0.0:".concat(port));
        inference_ts_1.default.GetInferenceSession();
    });
}
else {
    var httpsOptions = {
        key: fs_1.default.readFileSync(path_1.default.resolve((_a = config_ts_1.config.CERT_KEY) !== null && _a !== void 0 ? _a : "")),
        cert: fs_1.default.readFileSync(path_1.default.resolve((_b = config_ts_1.config.CERT_CERT) !== null && _b !== void 0 ? _b : "")),
    };
    https_1.default.createServer(httpsOptions, app_ts_1.default).listen(port, function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("Server is running on https://".concat(IP_ADDR, ":").concat(port));
            console.log("API docs are running on: https://".concat(IP_ADDR, ":3000").concat(app_ts_1.api_prefix_v1, "/docs"));
            inference_ts_1.default.GetInferenceSession();
            return [2 /*return*/];
        });
    }); });
}
