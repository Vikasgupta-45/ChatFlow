import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // 1. Initiate the connection and wait for it to complete.
        // This line throws an error if connection fails.
        await mongoose.connect(`${process.env.MONGODB_URI}/chatflow`);

        // 2. Log success ONLY after the connection promise resolves.
        console.log("MongoDB connected successfully");

        // (Optional but Recommended): Keep the event listener for monitoring 
        // disconnections, though it's not strictly needed for initial success log.
        mongoose.connection.on("error", (err) => {
             console.error("MongoDB connection error AFTER initial success:", err);
        });
        
    } catch (error) {
        // 3. Log failure if the promise rejects.
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;