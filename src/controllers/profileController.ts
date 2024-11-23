// src/controllers/userController.ts
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/UserModel";

// Fetch user profile
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Ensure the user is authenticated
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // Find the user in the database by ID, excluding the pin field
    const user = await UserModel.findById(req.user.id).select("-pin");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter status field only for drivers
    const userObject = user.toObject();
    if (user.role !== "Driver") {
      delete userObject.status; // Remove the status field for non-drivers
    }

    // Return the user's profile data
    res.status(200).json({ user: userObject });
  } catch (error) {
    next(error);
  }
};
