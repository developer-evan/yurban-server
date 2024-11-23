import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";
import RideModel from "../models/RideModel";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      pin,
      gender,
      email,
      county,
      subCounty,
      role,
    } = req.body;

    // Check if user already exists by phone number
    const existingUser = await UserModel.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the 4-digit PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    // Create user
    const newUser = await UserModel.create({
      firstName,
      lastName,
      phoneNumber,
      pin: hashedPin,
      gender,
      email,
      county,
      subCounty,
      role,
    });

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { phoneNumber, pin } = req.body;

    // Find the user by phone number
    const user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPinValid = await bcrypt.compare(pin, user.pin);
    if (!isPinValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, phoneNumber: user.phoneNumber, role: user.role },
      JWT_SECRET,
      { expiresIn: "24hr" }
    );

    res.status(200).json({
      token,
      userId: user._id,
      role: user.role,
      message: `${user.role} login successful`,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.user; // Extract the logged-in user's ID from JWT
    const { status } = req.body;

    // Validate status
    if (status !== "Online" && status !== "Offline") {
      return res
        .status(400)
        .json({ message: "Invalid status. Must be 'Online' or 'Offline'." });
    }

    // Find the user in the database
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Allow only drivers to update status
    if (user.role !== "Driver") {
      return res
        .status(403)
        .json({ message: "Only drivers can update their status." });
    }

    // Update the user's status
    user.status = status;
    await user.save();

    // Respond with success
    res.status(200).json({ message: "Status updated successfully", status });
  } catch (error) {
    // Log the error and respond with a server error
    console.error("Error updating status:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the status." });
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Fetch all users
    const users = await UserModel.find({}, "-pin"); // Exclude PIN for security

    // Map users to include their rides
    const usersWithRides = await Promise.all(
      users.map(async (user) => {
        // Get rides where the user is either a customer or a driver
        const rides =
          user.role === "Driver"
            ? await RideModel.find({ driverId: user._id }).populate(
                "customerId",
                "-pin" // Populate customer details but exclude sensitive data
              )
            : await RideModel.find({ customerId: user._id }).populate(
                "driverId",
                "-pin" // Populate driver details but exclude sensitive data
              );

        const userObject = user.toObject();
        return {
          ...userObject,
          rides, // Attach the rides to the user object
        };
      })
    );

    res.status(200).json(usersWithRides);
  } catch (error) {
    next(error);
  }
};

// export const getUsers = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     // Fetch all users
//     const users = await UserModel.find({}, "-pin"); // Exclude PIN for security

//     // Map the users to display the status only for drivers
//     const usersWithFilteredStatus = users.map((user) => {
//       const userObject = user.toObject();
//       if (user.role !== "Driver") {
//         delete userObject.status; // Remove the status field for non-drivers
//       }
//       return userObject;
//     });

//     res.status(200).json(usersWithFilteredStatus);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getUsers = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     // Optional role-based restriction: allow only "Admin" users
//     // if (req.user?.role !== "Driver") {
//     //   return res.status(403).json({ message: "Access denied" });
//     // }

//     // Fetch all users
//     const users = await UserModel.find({}, "-pin"); // Exclude PIN for security

//     res.status(200).json(users);
//   } catch (error) {
//     next(error);
//   }
// };
