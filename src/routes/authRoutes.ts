import { Router } from "express";
import { register, login, updateStatus, getUsers } from "../controllers/authController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.patch("/update-status", authenticateUser, updateStatus); // New route for updating status
router.get("/users", authenticateUser, getUsers); // New route for fetching all users

export default router;
