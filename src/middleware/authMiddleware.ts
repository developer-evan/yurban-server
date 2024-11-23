// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include the user property
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; role?: string };
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface JwtPayload {
  userId: string;
}

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("Authentication failed - no token provided.");
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log("Decoded user ID from JWT:", decoded.userId);

    // Attach the decoded user ID to the request object
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// specific user role  , like only admins can access the route
export const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "Driver") {
    res.status(403).json({ message: "Only Drivers" });
    return;
  }
  next();
};

