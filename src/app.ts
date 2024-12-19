import express, { Request, Response } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoute from './routes/auth.route';
import listingRoute from "./routes/listings.route"
import realtorRoute from './routes/realtor.route';
import { SoldPropertyService } from './services/sold-property.service';
import soldPropertyRoute from "./routes/sold-property.route";
import fs from "fs";
import cors from "cors";
import {loggingMiddleware} from "./middlewares/logging.middleware";
import {config} from "./config/config";
import userRoute from "./routes/user.route";

const version1 = 1;
const app = express();
const PORT = process.env.PORT || 10000;
export const soldPropertyService = new SoldPropertyService();
export const api_prefix_v1 = `/api/v${version1}`;

app.use(express.json());
app.use(errorMiddleware);
app.use(loggingMiddleware);
app.use(cors<Request>({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: '*',
}));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API v1',
      version: '1.0.0',
      description: 'API v1 documentation with JWT authentication',
    },
    servers: [
      {
        url: `http${config.ENV !== "test" ? 's' : ''}://${config.ENV !== "test" ? "homeaiservice.onrender.com" : `localhost:${PORT}`}${api_prefix_v1}`,
        description: 'Development server (HTTP) for v1',
      },
    ],
    components: {
      schemas: require('../src/routes/schemas.json').definitions,
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
  apis: [path.join(__dirname, './routes/*.js')],
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(`${api_prefix_v1}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));


swaggerOptions.definition.servers = [
  {
    url: `https://homeaiservice.onrender.com${api_prefix_v1}`,
    description: 'Development server (HTTP) for v1',
  }
]

fs.writeFileSync('./swagger.json', JSON.stringify(swaggerJsdoc(swaggerOptions), null, 2));

app.use(api_prefix_v1, realtorRoute);
app.use(api_prefix_v1, userRoute);
app.use(api_prefix_v1, listingRoute);
app.use(api_prefix_v1, soldPropertyRoute);
app.use(api_prefix_v1, authRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Welcome to my Backend</h1>');
});

export default app;