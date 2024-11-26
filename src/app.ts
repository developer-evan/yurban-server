import express from "express";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors"; // Import cors
import connectDB from "./config/dbConfig";
import authRoutes from "./routes/authRoutes";
import profileRoutes from "./routes/profileRoutes";
import rideRoutes from "./routes/rideRoutes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

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

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Yurban Ride API",
      description: "Yurban Ride API Information",
      contact: {
        name: "Developer Evans",
      },
      servers: [`https://yurban-server-2.onrender.com`],
    },
    schemes: ["http", "https"],
    servers: [
      {
        url: `https://yurban-server-2.onrender.com`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at https://yurban-server-2.onrender.com/api-docs`);
});
