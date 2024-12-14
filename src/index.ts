import app, { api_prefix_v1 } from './app';
import 'dotenv/config';
import mongoose, { connect, ConnectOptions } from 'mongoose';
import { config } from "./config/config";
import { loggerUtil } from './utils/logger.util';
import Inference from "./inference/inference"

const CLUSTER_URL = config.CLUSTER_URL || "";
const CLUSTER_URL_TEST = config.CLUSTER_URL_TEST || "";
const TEST_DB_NAME = config.TEST_DB_NAME;
const DB_NAME = config.DB_NAME;

app.listen("0.0.0.0", async () => {
  console.log(`Server is running on https://homeaiservice.onrender.com`);
  console.log(`API docs are running on: https://homeaiservice.onrender.com${api_prefix_v1}/docs`);
  Inference.GetInferenceSession();
});



const run = async () => {
  let connectOptions: ConnectOptions;

  if (config.ENV === "test") {
    connectOptions = {
      dbName: TEST_DB_NAME,
      serverApi: { version: "1", deprecationErrors: true, strict: true }
    };
    await connect(CLUSTER_URL_TEST, connectOptions);
    loggerUtil.info(`CONNECTING TO ${CLUSTER_URL_TEST}`);
  } else {
    connectOptions = {
      dbName: DB_NAME,
      serverApi: { version: "1", deprecationErrors: true, strict: true }
    };
    await connect(CLUSTER_URL, connectOptions);
    loggerUtil.info(`CONNECTING TO ${CLUSTER_URL}`);
  }
};

run().catch(err => loggerUtil.error('Error running server:', err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error to mongo db"));
db.once('open', () => {
  console.log('=== Connected to MongoDb Collection ===');
});
