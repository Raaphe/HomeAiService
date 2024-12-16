import express, { Request, Response } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { errorMiddleware } from './middlewares/error.middleware';
import AuthenticationFilter from './middlewares/auth.middleware';
import authRoute from './routes/auth.route';
import listingRoute from "./routes/listings.route"
import realtorRoute from './routes/realtor.route';
import { SoldPropertyService } from './services/sold-property.service';
import soldPropertyRoute from "./routes/sold-property.route";
import fs from "fs";
import cors from "cors";
import {loggingMiddleware} from "./middlewares/logging.middleware";
const version1 = 1;
export const api_prefix_v1 = `/api/v${version1}`;

export const soldPropertyService = new SoldPropertyService();


const app = express();

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
        url: `https://homeaiservice.onrender.com/api/v1`,
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
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));

const filter = new AuthenticationFilter();

app.use(`${api_prefix_v1}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(api_prefix_v1, realtorRoute);
app.use(api_prefix_v1, listingRoute);
app.use(api_prefix_v1, soldPropertyRoute);
app.use(api_prefix_v1, authRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Welcome to my Backend</h1>');
});

export default app;