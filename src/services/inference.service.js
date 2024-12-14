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
var ort = require("onnxruntime-web");
var inference_ts_1 = require("../inference/inference.ts");
var label_encoder_util_ts_1 = require("../utils/label_encoder.util.ts");
var logger_util_ts_1 = require("../utils/logger.util.ts");
var InferenceService = /** @class */ (function () {
    function InferenceService() {
    }
    InferenceService.getHouseInference = function (houseInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var inputData, inputBatch, inputTensor, feeds, results, e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.labelEncoder.fit(this.stateCodes);
                        inputData = [
                            houseInfo.bedrooms,
                            houseInfo.bathrooms,
                            houseInfo.acres,
                            this.labelEncoder.transform(houseInfo.state),
                            houseInfo.zip_code,
                            houseInfo.living_space_size
                        ];
                        inputBatch = [inputData];
                        inputTensor = new ort.Tensor('float32', inputBatch.flat(), [1, 6]);
                        feeds = { "onnx::Gemm_0": inputTensor };
                        return [4 /*yield*/, ((_a = inference_ts_1.default.GetInferenceSession().inferenceSession) === null || _a === void 0 ? void 0 : _a.run(feeds))];
                    case 1:
                        results = _b.sent();
                        if (results === undefined) {
                            throw new Error("Inference result is undefined.");
                        }
                        return [2 /*return*/, { code: 200, message: "Successfully made inference.", data: results["22"]["cpuData"]["0"] }];
                    case 2:
                        e_1 = _b.sent();
                        logger_util_ts_1.loggerUtil.error(e_1);
                        return [2 /*return*/, { code: 500, message: "Error making inference.\n".concat(e_1), data: 0 }];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    InferenceService.labelEncoder = new label_encoder_util_ts_1.default();
    InferenceService.stateCodes = [
        "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
    ];
    return InferenceService;
}());
exports.default = InferenceService;
