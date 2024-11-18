import mongoose from "mongoose";
// Create a connection function
async function connectDB() {
    const url = process.env.MONGODB_URL;
    if (!url) {
        console.error("MONGODB_URL environment variable is not defined.");
        process.exit(1); // Exit the process with failure
    }
    try {
        // Await the connection to ensure it's established before proceeding
        await mongoose.connect(url);
        console.log("✅ Connected to MongoDB");
    }
    catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process with failure
    }
    // Set up event listeners for the mongoose connection
    mongoose.connection.on("connected", () => {
        console.log("🔗 Mongoose connection is open.");
    });
    mongoose.connection.on("error", (err) => {
        console.error("❌ Mongoose connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
        console.warn("⚠️ Mongoose connection is disconnected.");
    });
    // Optional: Handle process termination gracefully
    process.on("SIGINT", async () => {
        await mongoose.connection.close();
        console.log("🔒 Mongoose connection closed due to app termination.");
        process.exit(0);
    });
}
export default connectDB;
