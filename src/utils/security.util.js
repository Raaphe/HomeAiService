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
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.generateRSAKeys = generateRSAKeys;
exports.encryptWithPublicKey = encryptWithPublicKey;
exports.decryptWithPrivateKey = decryptWithPrivateKey;
exports.getLocalIPAddres = getLocalIPAddres;
var bcryptjs_1 = require("bcryptjs");
var crypto_1 = require("crypto");
var node_rsa_1 = require("node-rsa");
var config_ts_1 = require("../config/config.ts");
var node_os_1 = require("node:os");
var secretKey = config_ts_1.config.JWT_SECRET;
var iv = Buffer.alloc(16, 0);
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function verifyPassword(password, hashedPassword) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, bcryptjs_1.default.compare(password, hashedPassword)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function encrypt(text) {
    var cipher = crypto_1.default.createCipheriv('aes-256-ctr', secretKey, iv);
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
function decrypt(encryptedText) {
    var decipher = crypto_1.default.createDecipheriv('aes-256-ctr', secretKey, iv);
    var decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
function generateRSAKeys(bits) {
    if (bits === void 0) { bits = 512; }
    var key = new node_rsa_1.default({ b: bits });
    return {
        publicKey: key.exportKey('public'),
        privateKey: key.exportKey('private'),
        key: key
    };
}
function encryptWithPublicKey(key, data) {
    return key.encrypt(data, 'base64');
}
function decryptWithPrivateKey(key, encryptedData) {
    return key.decrypt(encryptedData, 'utf8');
}
function getLocalIPAddres() {
    var networkInterfaces = node_os_1.default.networkInterfaces();
    for (var interfaceName in networkInterfaces) {
        var addresses = networkInterfaces[interfaceName];
        for (var _i = 0, _a = addresses !== null && addresses !== void 0 ? addresses : []; _i < _a.length; _i++) {
            var address = _a[_i];
            if (address.family === 'IPv4' && !address.internal) {
                return address.address;
            }
        }
    }
    return 'IP address not found';
}
