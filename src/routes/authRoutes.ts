import { Router } from "express";
import {
  register,
  login,
  updateStatus,
  getUsers,
} from "../controllers/authController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for authentication and user management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Register a new user with detailed information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *               lastName:
 *                 type: string
 *                 description: Last name of the user
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the user
 *               pin:
 *                 type: string
 *                 description: 4-digit PIN for the user
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 description: Gender of the user
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               county:
 *                 type: string
 *                 description: County of residence
 *               subCounty:
 *                 type: string
 *                 description: Sub-county of residence
 *               role:
 *                 type: string
 *                 enum: [Driver, Customer, Admin]
 *                 description: Role of the user in the system
 *             required:
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - pin
 *               - gender
 *               - email
 *               - county
 *               - subCounty
 *               - role
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     description: Authenticate a user using phone number and PIN and return a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *                 description: Phone number of the user
 *               pin:
 *                 type: string
 *                 description: 4-digit PIN for the user
 *             required:
 *               - phoneNumber
 *               - pin
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/update-status:
 *   patch:
 *     summary: Update user status
 *     tags: [Auth]
 *     description: Update the online/offline status of a user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status (online/offline)
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.patch("/update-status", authenticateUser, updateStatus);

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     summary: Get all users
 *     tags: [Auth]
 *     description: Retrieve a list of all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/users", authenticateUser, getUsers);

export default router;
