import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Mongoose 6+ requires no special options for basic connection
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully.");

    // Optional: Log events for connection status changes
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected.');
    });
    mongoose.connection.on('reconnected', () => {
      console.info('MongoDB reconnected.');
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Exit process with failure code
    process.exit(1);
  }
};
