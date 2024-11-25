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
import { authenticateUser, authorizeUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/request", authenticateUser, requestRide); // Customer requests a ride
router.get("/all-rides", authenticateUser, getAllRides); // Admin views all rides
router.get("/driver/rides", authenticateUser,  getDriverRides); // Driver views assigned rides
router.patch("/rides/:rideId", authenticateUser, updateRideStatus); // Driver updates ride status
// get customer rides

router.get("/rides", authenticateUser, getCustomerRides);
// single ride get
router.get("/rides/:rideId", authenticateUser, getSingleRide);

// Complete Ride Route
router.patch("/rides/:rideId/complete", authenticateUser, completeRide);

export default router;

// authorizeUser,