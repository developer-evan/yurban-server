import { Router } from "express";
import { authenticateUser } from "../middleware/authMiddleware";
import { getUserProfile } from "../controllers/profileController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: API endpoints for managing user profiles
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Profile]
 *     description: Retrieve the profile details of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   description: User's name
 *                 email:
 *                   type: string
 *                   description: User's email
 *                 profilePicture:
 *                   type: string
 *                   description: URL of the user's profile picture
 *       401:
 *         description: Unauthorized - User must be authenticated
 *       500:
 *         description: Internal server error
 */
router.get("/profile", authenticateUser, getUserProfile);

// Uncomment the route below to enable create/update profile functionality
// /**
//  * @swagger
//  * /api/profile:
//  *   post:
//  *     summary: Create or update user profile
//  *     tags: [Profile]
//  *     description: Create or update the profile of the authenticated user
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 description: User's name
//  *               profilePicture:
//  *                 type: string
//  *                 description: URL of the user's profile picture
//  *     responses:
//  *       201:
//  *         description: Profile created/updated successfully
//  *       400:
//  *         description: Bad request - Invalid input
//  *       401:
//  *         description: Unauthorized - User must be authenticated
//  *       500:
//  *         description: Internal server error
//  */
// router.post("/profile", authenticateUser, upsertUserProfile);

export default router;
