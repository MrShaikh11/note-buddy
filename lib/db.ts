import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "users",
    });

    isConnected = true;
    console.log("Connected to MongoDB ");
  } catch (error) {
    console.error("MongoDB connection error ", error);
  }
};
