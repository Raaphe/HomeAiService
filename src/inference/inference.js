"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var onnxruntime_web_1 = require("onnxruntime-web");
var config_ts_1 = require("../config/config.ts");
var logger_util_ts_1 = require("../utils/logger.util.ts");
var path_1 = require("path");
var Inference = /** @class */ (function () {
    function Inference() {
        var _this = this;
        this.hasLoaded = false;
        this.modelName = path_1.default.resolve(__dirname, "./".concat(config_ts_1.config.MODEL_NAME, ".onnx"));
        onnxruntime_web_1.InferenceSession.create(this.modelName).then(function (is) {
            _this.inferenceSession = is;
            _this.hasLoaded = true;
            logger_util_ts_1.loggerUtil.info("Inference Model Loaded");
        }).catch(function (e) {
            _this.hasLoaded = false;
            logger_util_ts_1.loggerUtil.error("Error loading inference model");
            logger_util_ts_1.loggerUtil.error(e);
        });
    }
    Inference.GetInferenceSession = function () {
        if (!Inference.instance) {
            Inference.instance = new Inference();
        }
        return Inference.instance;
    };
    return Inference;
}());
exports.default = Inference;
