import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET || "change-this-secret",
  clientUrls: (process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://127.0.0.1:5173,http://127.0.0.1:5174,http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lms"
};
