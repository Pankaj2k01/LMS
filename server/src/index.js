import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { initializePersistence } from "./data/persistence.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { createApiRouter } from "./routes/index.js";
import { repositories } from "./services/repositories.js";

const app = express();
let dbStatus = "disconnected";

app.use(
  cors({
    origin: true,
    credentials: true
  })
);
app.use(express.json());

app.use("/api", createApiRouter(() => dbStatus));
app.use(errorHandler);

Promise.all([connectDatabase(Object.values(repositories)), initializePersistence()]).then(([databaseState]) => {
  dbStatus = databaseState;
}).finally(() => {
  app.listen(env.port, () => {
    console.log(`EduCore API running on port ${env.port}`);
  });
});
