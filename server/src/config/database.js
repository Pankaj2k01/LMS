import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase(seedRepositories) {
  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 2000
    });
    await Promise.all(seedRepositories.map((repository) => repository.seed()));
    console.log("MongoDB connected");
    return "connected";
  } catch (error) {
    console.log("MongoDB unavailable, running in mock mode");
    return "mock-mode";
  }
}
