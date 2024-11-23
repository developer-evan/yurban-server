import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors"; // Import cors
import connectDB from "./config/dbConfig";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import rideRoutes from "./routes/rideRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("MongoDB URL is not defined in the environment variables");
  process.exit(1);
}

// Connect to MongoDB
connectDB(MONGO_URL);

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", rideRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
