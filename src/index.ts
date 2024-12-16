import app, {api_prefix_v1, soldPropertyService} from './app';
import 'dotenv/config';
import mongoose, { connect, ConnectOptions } from 'mongoose';
import { config } from "./config/config";
import { loggerUtil } from './utils/logger.util';
import Inference from "./inference/inference"
import fileUtil from "./utils/file.util";
import {runDatasetUpdate} from "./utils/update_dataset.util";
import cron from "node-cron";

const CLUSTER_URL = config.CLUSTER_URL || "";
const CLUSTER_URL_TEST = config.CLUSTER_URL_TEST || "";
const TEST_DB_NAME = config.TEST_DB_NAME;
const DB_NAME = config.DB_NAME;
const PORT = process.env.PORT || 10000;

/// DOWNLOADING DATASET + GRAPHS [START]

async function updateAndWriteGraphFunctions(): Promise<void> {
  try {
    await runDatasetUpdate();
    await soldPropertyService.loadProperties(config.DATASET_PATH);
    await soldPropertyService.writeGraphFunctionsToFile('../data/graph-data.json');

    console.log('Graph functions have been written successfully.');
  } catch (err) {
    console.error('Error in the dataset update or graph function write:', err);
  }
}

cron.schedule('0 3 * * 6', async () => {
  await updateAndWriteGraphFunctions();
});

fileUtil.checkFileExists(config.DATASET_PATH)
    .then(async (doesFileExist) => {
      if (!doesFileExist) {
        await updateAndWriteGraphFunctions();
      }
    })
    .catch((err) => {
      console.error('Error checking if file exists:', err);
    });

/// DOWNLOADING DATASET + GRAPHS [END]


app.listen(Number(PORT), "0.0.0.0", async () => {
  if (config.ENV === "test") {
    console.log(`Server is running on http://127.0.0.1/`);
    console.log(`API docs are running on: http://127.0.0.1${api_prefix_v1}/docs`);
  } else {
    console.log(`Server is running on https://homeaiservice.onrender.com`);
    console.log(`API docs are running on: https://homeaiservice.onrender.com${api_prefix_v1}/docs`);
  }
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
