"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.soldPropertyService = exports.api_prefix_v1 = void 0;
var express_1 = require("express");
var path_1 = require("path");
var swagger_ui_express_1 = require("swagger-ui-express");
var swagger_jsdoc_1 = require("swagger-jsdoc");
var error_middleware_ts_1 = require("./middlewares/error.middleware.ts");
var auth_middleware_ts_1 = require("./middlewares/auth.middleware.ts");
var auth_route_ts_1 = require("./routes/auth.route.ts");
var listings_route_ts_1 = require("./routes/listings.route.ts");
var security_util_ts_1 = require("./utils/security.util.ts");
var realtor_route_ts_1 = require("./routes/realtor.route.ts");
var sold_property_service_ts_1 = require("./services/sold-property.service.ts");
var config_ts_1 = require("./config/config.ts");
var sold_property_route_ts_1 = require("./routes/sold-property.route.ts");
var fs_1 = require("fs");
var cors_1 = require("cors");
var version1 = 1;
exports.api_prefix_v1 = "/api/v".concat(version1);
var IP_ADDR = (0, security_util_ts_1.getLocalIPAddres)();
exports.soldPropertyService = new sold_property_service_ts_1.SoldPropertyService();
// async function updateAndWriteGraphFunctions(): Promise<void> {
//   try {
//     await runDatasetUpdate();
//
//     await soldPropertyService.loadProperties(config.DATASET_PATH);
//     await soldPropertyService.writeGraphFunctionsToFile('../data/graph-data.json');
//
//     console.log('Graph functions have been written successfully.');
//   } catch (err) {
//     console.error('Error in the dataset update or graph function write:', err);
//   }
// }
// cron.schedule('0 3 * * 6', async () => {
//   await updateAndWriteGraphFunctions();
// });
//
// fileUtil.checkFileExists(config.DATASET_PATH)
//     .then(async (doesFileExist) => {
//       if (!doesFileExist) {
//         await updateAndWriteGraphFunctions();
//       }
//     })
//     .catch((err) => {
//       console.error('Error checking if file exists:', err);
// });
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(error_middleware_ts_1.errorMiddleware);
app.use((cors_1.default));
var swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API v1',
            version: '1.0.0',
            description: 'API v1 documentation with JWT authentication',
        },
        servers: [
            {
                url: "http".concat(config_ts_1.config.ENV === 'test' ? 's' : '', "://").concat(IP_ADDR, ":3000").concat(exports.api_prefix_v1),
                description: 'Development server (HTTP) for v1',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path_1.default.join(__dirname, './routes/*.ts')],
};
var swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
fs_1.default.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
app.use("".concat(exports.api_prefix_v1, "/docs"), swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use(exports.api_prefix_v1, realtor_route_ts_1.default);
app.use(exports.api_prefix_v1, listings_route_ts_1.default);
app.use(exports.api_prefix_v1, sold_property_route_ts_1.default);
app.get('/', function (req, res) {
    res.send('<h1>Welcome to my Backend</h1>');
});
var filter = new auth_middleware_ts_1.default();
app.use(exports.api_prefix_v1, auth_route_ts_1.default);
exports.default = app;
