import { Router } from "express";
import {
  requestRide,
  getDriverRides,
  updateRideStatus,
  getCustomerRides,
  getSingleRide,
  getAllRides,
  completeRide,
} from "../controllers/rideController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Rides
 *   description: API endpoints for managing rides
 */
/**
 * @swagger
 * /api/request:
 *   post:
 *     summary: Request a new ride
 *     tags: [Rides]
 *     description: Customers must select a driver while requesting a ride and provide all necessary ride details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 description: The ID of the customer requesting the ride
 *               driverId:
 *                 type: string
 *                 description: The ID of the driver selected for the ride
 *               passengerNumber:
 *                 type: integer
 *                 description: Number of passengers for the ride
 *               pickupLocation:
 *                 type: string
 *                 description: The pickup location address
 *               dropoffLocation:
 *                 type: string
 *                 description: The dropoff location address
 *             required:
 *               - customerId
 *               - driverId
 *               - pickupLocation
 *               - dropoffLocation
 *     responses:
 *       201:
 *         description: Ride request created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/request", authenticateUser, requestRide);

/**
 * @swagger
 * /api/all-rides:
 *   get:
 *     summary: View all rides
 *     tags: [Rides]
 *     description: Admins can view all rides in the system
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all rides
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/all-rides", authenticateUser, getAllRides);

/**
 * @swagger
 * /api/driver/rides:
 *   get:
 *     summary: View driver rides
 *     tags: [Rides]
 *     description: Drivers can view their assigned rides
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved driver rides
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/driver/rides", authenticateUser, getDriverRides);

/**
 * @swagger
 * /api/rides/{rideId}:
 *   patch:
 *     summary: Update ride status
 *     tags: [Rides]
 *     description: Drivers can update the status of a ride
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: rideId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ride to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the ride (e.g., accepted, rejected)
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Ride status updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Internal server error
 */
router.patch("/rides/:rideId", authenticateUser, updateRideStatus);

/**
 * @swagger
 * /api/customer/rides:
 *   get:
 *     summary: View customer rides
 *     tags: [Rides]
 *     description: Customers can view their ride history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved customer rides
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/customer/rides", authenticateUser, getCustomerRides);

/**
 * @swagger
 * /api/rides/{rideId}:
 *   get:
 *     summary: Get details of a single ride
 *     tags: [Rides]
 *     description: Get details of a specific ride by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: rideId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ride to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved ride details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Internal server error
 */
router.get("/rides/:rideId", authenticateUser, getSingleRide);

/**
 * @swagger
 * /api/rides/{rideId}/complete:
 *   patch:
 *     summary: Complete a ride
 *     tags: [Rides]
 *     description: Drivers can mark a ride as completed
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: rideId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the ride to complete
 *     responses:
 *       200:
 *         description: Ride completed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Ride not found
 *       500:
 *         description: Internal server error
 */
router.patch("/rides/:rideId/complete", authenticateUser, completeRide);

export default router;
