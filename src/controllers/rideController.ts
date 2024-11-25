import { Request, Response, NextFunction } from "express";
import RideModel from "../models/RideModel";
import UserModel from "../models/UserModel";

export const requestRide = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { driverId, pickupLocation, dropoffLocation, passengerNumber } =
      req.body;
    const customerId = req.user?.id; // Assuming `req.user` contains authenticated user info

    // Validate driver existence and role
    const driver = await UserModel.findById(driverId);
    if (!driver || driver.role !== "Driver") {
      return res.status(400).json({ message: "Invalid driver ID" });
    }

    // Create the ride
    const newRide = await RideModel.create({
      customerId,
      driverId,
      passengerNumber,
      pickupLocation,
      dropoffLocation,
    });

    res
      .status(201)
      .json({ message: "Ride requested successfully", ride: newRide });
  } catch (error) {
    next(error);
  }
};

// get customer rides from the database
export const getCustomerRides = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const customerId = req.user?.id; // Assuming `req.user` contains authenticated customer info

    const rides = await RideModel.find({ customerId }).populate(
      "driverId",
      "-pin"
    );
    // remove driver status from the response

    res.status(200).json(rides);
  } catch (error) {
    next(error);
  }
};

// get rides from the database
export const getDriverRides = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const driverId = req.user?.id; // Assuming `req.user` contains authenticated driver info

    const rides = await RideModel.find({ driverId }).populate(
      "customerId",
      "-pin"
    );
    //   remove customer status from the response

    res.status(200).json(rides);
  } catch (error) {
    next(error);
  }
};

//   get single ride from the database
export const getSingleRide = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { rideId } = req.params;
    const userId = req.user?.id; // Assuming `req.user` contains authenticated user info

    const ride = await RideModel.findOne({
      _id: rideId,
      $or: [{ driverId: userId }, { customerId: userId }],
    })
      .populate("customerId", "-pin")
      .populate("driverId", "-pin");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.status(200).json(ride);
  } catch (error) {
    next(error);
  }
};

export const updateRideStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { rideId } = req.params;
    const { status } = req.body; // Should be "Accepted" or "Rejected"
    const userId = req.user?.id; // Assuming `req.user` contains authenticated user info

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const ride = await RideModel.findOne({ _id: rideId });
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if the user is either the driver or the customer
    if (
      ride.driverId.toString() !== userId &&
      ride.customerId.toString() !== userId
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update ride status and timestamp
    ride.status = status;
    if (status === "Accepted") ride.acceptedAt = new Date();
    if (status === "Rejected") ride.rejectedAt = new Date();

    await ride.save();
    res.status(200).json({ message: "Ride status updated", ride });
  } catch (error) {
    next(error);
  }
};

export const completeRide = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { rideId } = req.params;
    const userId = req.user?.id; // Assuming `req.user` contains authenticated user info

    // Fetch the ride from the database
    const ride = await RideModel.findOne({ _id: rideId });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Ensure only the assigned driver can complete the ride
    if (ride.driverId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if the ride status is "Accepted"
    if (ride.status !== "Accepted") {
      return res
        .status(400)
        .json({
          message: "Ride can only be completed from the 'Accepted' status",
        });
    }

    // Update the status to "Completed" and set the timestamp
    ride.status = "Completed";
    ride.completedAt = new Date();

    await ride.save();

    res.status(200).json({ message: "Ride completed successfully", ride });
  } catch (error) {
    next(error);
  }
};

// export const completeRide = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const { rideId } = req.params;
//     const userId = req.user?.id; // Assuming `req.user` contains authenticated user info

//     const ride = await RideModel.findOne({ _id: rideId });
//     if (!ride) {
//       return res.status(404).json({ message: "Ride not found" });
//     }

//     // Check if the user is the driver
//     if (ride.driverId.toString() !== userId) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     // Update ride status to "Completed" and set completedAt timestamp
//     ride.status = "Completed";
//     ride.completedAt = new Date();

//     await ride.save();
//     res.status(200).json({ message: "Ride completed successfully", ride });
//   } catch (error) {
//     next(error);
//   }
// };

// get all rides from the database
// export const getAllRides = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const rides = await RideModel.find().populate("customerId", "-pin").populate("driverId", "-pin");
//     res.status(200).json(rides);
//   } catch (error) {
//     next(error);
//   }
// };

export const getAllRides = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Fetch all rides and populate driver and customer details (excluding sensitive info)
    const rides = await RideModel.find()
      .populate("driverId", "-pin") // Exclude the driver's PIN
      .populate("customerId", "-pin"); // Exclude the customer's PIN

    res.status(200).json(rides);
  } catch (error) {
    next(error);
  }
};
