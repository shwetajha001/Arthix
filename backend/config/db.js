import mongoose from "mongoose";

mongoose.set("bufferCommands", false);

let cachedConnection = null;
let cachedPromise = null;

export const connectDB = async () => {
  if (cachedConnection?.connection?.readyState === 1) {
    return cachedConnection;
  }

  cachedConnection = null;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    }).catch((error) => {
      cachedPromise = null;
      throw error;
    });
  }

  try {
    cachedConnection = await Promise.race([
      cachedPromise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("MongoDB connection timed out")), 8000);
      }),
    ]);

    return cachedConnection;
  } catch (error) {
    cachedPromise = null;
    mongoose.disconnect().catch(() => {});
    throw error;
  }
};
