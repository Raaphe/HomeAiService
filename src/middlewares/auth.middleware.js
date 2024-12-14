"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = require("jsonwebtoken");
var config_ts_1 = require("../config/config.ts");
var logger_util_ts_1 = require("../utils/logger.util.ts");
var AuthenticationFilter = /** @class */ (function () {
    function AuthenticationFilter() {
    }
    AuthenticationFilter.prototype.authFilter = function (req, res, next) {
        console.log("============ URL ============\n".concat(req.url));
        var whitelist = [
            "/docs"
        ];
        if (whitelist.some(function (path) { return req.url.startsWith(path); })) {
            return next();
        }
        var authHeader = req.headers['authorization'];
        logger_util_ts_1.loggerUtil.info(req.headers);
        if (!authHeader) {
            return res.status(401).json({ message: 'No authorization header provided' });
        }
        var parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return res.status(401).json({ message: 'Malformed authorization header' });
        }
        var token = parts[1];
        console.log("token -> " + token);
        try {
            var decoded = jsonwebtoken_1.default.verify(token, config_ts_1.config.JWT_SECRET);
            console.log("Token is valid", decoded);
            next();
        }
        catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
    return AuthenticationFilter;
}());
exports.default = AuthenticationFilter;
