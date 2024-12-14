"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerUtil = void 0;
var winston_1 = require("winston");
exports.loggerUtil = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.json(),
    transports: [new winston_1.default.transports.Console()],
});
