"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LabelEncoder = /** @class */ (function () {
    function LabelEncoder() {
        this.labelMap = new Map();
        this.inverseLabelMap = new Map();
    }
    LabelEncoder.prototype.fit = function (labels) {
        var _this = this;
        labels.forEach(function (l, index) {
            if (!_this.labelMap.has(l)) {
                _this.labelMap.set(l, index);
                _this.inverseLabelMap.set(index, l);
            }
        });
    };
    LabelEncoder.prototype.transform = function (label) {
        var _a;
        if (!this.labelMap.has(label) || !this.labelMap.get(label)) {
            throw new Error("Label, \"".concat(label, "\" was not seen during fitting"));
        }
        return (_a = this.labelMap.get(label)) !== null && _a !== void 0 ? _a : 0;
    };
    LabelEncoder.prototype.inverseTransform = function (encodedLabel) {
        if (!this.inverseLabelMap.has(encodedLabel)) {
            throw new Error("Encoded label \"".concat(encodedLabel, "\" was not seen during fitting."));
        }
        return this.inverseLabelMap.get(encodedLabel);
    };
    return LabelEncoder;
}());
exports.default = LabelEncoder;
