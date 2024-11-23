// src/routes/profileRoutes.ts
import { Router } from "express";
// import { getUserProfile } from "../controllers/profileController";
import { authenticateUser } from "../middleware/authMiddleware";
import { getUserProfile } from "../controllers/profileController";

const router = Router();

// Protect the routes with authentication middleware
router.get("/profile", authenticateUser, getUserProfile);
// Uncomment the route below to enable create/update profile functionality
// router.post("/profile", authenticateUser, upsertUserProfile);

export default router;
