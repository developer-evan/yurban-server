import { Router } from "express";
import {
  requestRide,
  getDriverRides,
  updateRideStatus,
  getCustomerRides,
  getSingleRide,
} from "../controllers/rideController";
import { authenticateUser, authorizeUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/request", authenticateUser, requestRide); // Customer requests a ride
router.get("/driver/rides", authenticateUser,  getDriverRides); // Driver views assigned rides
router.patch("/rides/:rideId", authenticateUser, updateRideStatus); // Driver updates ride status
// get customer rides
router.get("/rides", authenticateUser, getCustomerRides);
// single ride get
router.get("/rides/:rideId", authenticateUser, getSingleRide);

export default router;

// authorizeUser,